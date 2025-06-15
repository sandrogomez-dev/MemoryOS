from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.api.models.memory import Memory, MemoryType
from src.api.models.user import User, SubscriptionType
from app import db
from sqlalchemy import or_, desc

memories_bp = Blueprint('memories', __name__)

@memories_bp.route('/', methods=['GET'])
@jwt_required()
def get_memories():
    try:
        current_user_id = get_jwt_identity()
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        search = request.args.get('search', '')
        memory_type = request.args.get('type', '')
        importance = request.args.get('importance', type=int)
        
        # Build query
        query = Memory.query.filter_by(user_id=current_user_id)
        
        # Search filter
        if search:
            query = query.filter(
                or_(
                    Memory.title.contains(search),
                    Memory.content.contains(search),
                    Memory.tags.contains(search)
                )
            )
        
        # Type filter
        if memory_type and memory_type in [e.value for e in MemoryType]:
            query = query.filter_by(memory_type=MemoryType(memory_type))
        
        # Importance filter
        if importance:
            query = query.filter_by(importance_level=importance)
        
        # Order by creation date (newest first)
        query = query.order_by(desc(Memory.created_at))
        
        # Paginate
        memories = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'memories': [memory.to_dict() for memory in memories.items],
            'pagination': {
                'page': page,
                'pages': memories.pages,
                'per_page': per_page,
                'total': memories.total,
                'has_next': memories.has_next,
                'has_prev': memories.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to retrieve memories', 'error': str(e)}), 500

@memories_bp.route('/<int:memory_id>', methods=['GET'])
@jwt_required()
def get_memory(memory_id):
    try:
        current_user_id = get_jwt_identity()
        memory = Memory.query.filter_by(id=memory_id, user_id=current_user_id).first()
        
        if not memory:
            return jsonify({'message': 'Memory not found'}), 404
        
        # Update last accessed
        memory.update_last_accessed()
        
        return jsonify({'memory': memory.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to retrieve memory', 'error': str(e)}), 500

@memories_bp.route('/', methods=['POST'])
@jwt_required()
def create_memory():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        # Check memory limit for free users
        if user.subscription_type == SubscriptionType.free:
            memory_count = Memory.query.filter_by(user_id=current_user_id).count()
            if memory_count >= 100:
                return jsonify({'message': 'Memory limit reached. Upgrade to Premium for unlimited memories.'}), 403
        
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'No data provided'}), 400
        
        title = data.get('title', '').strip()
        content = data.get('content', '').strip()
        memory_type = data.get('memory_type', 'note')
        tags = data.get('tags', [])
        importance_level = data.get('importance_level', 1)
        
        if not title:
            return jsonify({'message': 'Title is required'}), 400
        
        # Validate memory type
        if memory_type not in [e.value for e in MemoryType]:
            memory_type = 'note'
        
        # Validate importance level
        if not isinstance(importance_level, int) or importance_level < 1 or importance_level > 5:
            importance_level = 1
        
        # Create memory
        memory = Memory(
            title=title,
            content=content,
            user_id=current_user_id,
            memory_type=MemoryType(memory_type),
            importance_level=importance_level,
            tags=tags
        )
        
        db.session.add(memory)
        db.session.commit()
        
        return jsonify({
            'message': 'Memory created successfully',
            'memory': memory.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to create memory', 'error': str(e)}), 500

@memories_bp.route('/<int:memory_id>', methods=['PUT'])
@jwt_required()
def update_memory(memory_id):
    try:
        current_user_id = get_jwt_identity()
        memory = Memory.query.filter_by(id=memory_id, user_id=current_user_id).first()
        
        if not memory:
            return jsonify({'message': 'Memory not found'}), 404
        
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'No data provided'}), 400
        
        # Update fields if provided
        if 'title' in data:
            title = data['title'].strip()
            if not title:
                return jsonify({'message': 'Title cannot be empty'}), 400
            memory.title = title
        
        if 'content' in data:
            memory.content = data['content'].strip()
        
        if 'memory_type' in data:
            memory_type = data['memory_type']
            if memory_type in [e.value for e in MemoryType]:
                memory.memory_type = MemoryType(memory_type)
        
        if 'tags' in data:
            memory.tags = data['tags']
        
        if 'importance_level' in data:
            importance_level = data['importance_level']
            if isinstance(importance_level, int) and 1 <= importance_level <= 5:
                memory.importance_level = importance_level
        
        db.session.commit()
        
        return jsonify({
            'message': 'Memory updated successfully',
            'memory': memory.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to update memory', 'error': str(e)}), 500

@memories_bp.route('/<int:memory_id>', methods=['DELETE'])
@jwt_required()
def delete_memory(memory_id):
    try:
        current_user_id = get_jwt_identity()
        memory = Memory.query.filter_by(id=memory_id, user_id=current_user_id).first()
        
        if not memory:
            return jsonify({'message': 'Memory not found'}), 404
        
        db.session.delete(memory)
        db.session.commit()
        
        return jsonify({'message': 'Memory deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to delete memory', 'error': str(e)}), 500

@memories_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_memory_stats():
    try:
        current_user_id = get_jwt_identity()
        
        total_memories = Memory.query.filter_by(user_id=current_user_id).count()
        
        # Count by type
        type_counts = {}
        for memory_type in MemoryType:
            count = Memory.query.filter_by(
                user_id=current_user_id, 
                memory_type=memory_type
            ).count()
            type_counts[memory_type.value] = count
        
        # Count by importance level
        importance_counts = {}
        for level in range(1, 6):
            count = Memory.query.filter_by(
                user_id=current_user_id, 
                importance_level=level
            ).count()
            importance_counts[str(level)] = count
        
        return jsonify({
            'total_memories': total_memories,
            'type_counts': type_counts,
            'importance_counts': importance_counts
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to retrieve stats', 'error': str(e)}), 500 