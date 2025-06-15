from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.reminder import Reminder, ReminderType
from models.memory import Memory
from app import db
from datetime import datetime, timedelta
from sqlalchemy import desc, asc

reminders_bp = Blueprint('reminders', __name__)

@reminders_bp.route('/', methods=['GET'])
@jwt_required()
def get_reminders():
    try:
        current_user_id = get_jwt_identity()
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        reminder_type = request.args.get('type', '')
        status = request.args.get('status', '')  # completed, pending, overdue
        
        # Build query
        query = Reminder.query.filter_by(user_id=current_user_id)
        
        # Type filter
        if reminder_type and reminder_type in [e.value for e in ReminderType]:
            query = query.filter_by(reminder_type=ReminderType(reminder_type))
        
        # Status filter
        if status == 'completed':
            query = query.filter_by(is_completed=True)
        elif status == 'pending':
            query = query.filter_by(is_completed=False)
        elif status == 'overdue':
            query = query.filter(
                Reminder.is_completed == False,
                Reminder.trigger_date < datetime.utcnow()
            )
        
        # Order by trigger date (soonest first for pending, latest first for completed)
        if status == 'completed':
            query = query.order_by(desc(Reminder.completed_at))
        else:
            query = query.order_by(asc(Reminder.trigger_date.nullslast()))
        
        # Paginate
        reminders = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        return jsonify({
            'reminders': [reminder.to_dict() for reminder in reminders.items],
            'pagination': {
                'page': page,
                'pages': reminders.pages,
                'per_page': per_page,
                'total': reminders.total,
                'has_next': reminders.has_next,
                'has_prev': reminders.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to retrieve reminders', 'error': str(e)}), 500

@reminders_bp.route('/<int:reminder_id>', methods=['GET'])
@jwt_required()
def get_reminder(reminder_id):
    try:
        current_user_id = get_jwt_identity()
        reminder = Reminder.query.filter_by(id=reminder_id, user_id=current_user_id).first()
        
        if not reminder:
            return jsonify({'message': 'Reminder not found'}), 404
        
        return jsonify({'reminder': reminder.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to retrieve reminder', 'error': str(e)}), 500

@reminders_bp.route('/', methods=['POST'])
@jwt_required()
def create_reminder():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'No data provided'}), 400
        
        title = data.get('title', '').strip()
        description = data.get('description', '').strip()
        reminder_type = data.get('reminder_type', 'deadline')
        trigger_date_str = data.get('trigger_date')
        repeat_pattern = data.get('repeat_pattern', '').strip()
        memory_id = data.get('memory_id')
        
        if not title:
            return jsonify({'message': 'Title is required'}), 400
        
        # Validate reminder type
        if reminder_type not in [e.value for e in ReminderType]:
            reminder_type = 'deadline'
        
        # Parse trigger date
        trigger_date = None
        if trigger_date_str:
            try:
                trigger_date = datetime.fromisoformat(trigger_date_str.replace('Z', '+00:00'))
            except ValueError:
                return jsonify({'message': 'Invalid trigger date format'}), 400
        
        # Validate memory_id if provided
        if memory_id:
            memory = Memory.query.filter_by(id=memory_id, user_id=current_user_id).first()
            if not memory:
                return jsonify({'message': 'Associated memory not found'}), 404
        
        # Create reminder
        reminder = Reminder(
            title=title,
            user_id=current_user_id,
            description=description,
            reminder_type=ReminderType(reminder_type),
            trigger_date=trigger_date,
            repeat_pattern=repeat_pattern if repeat_pattern else None,
            memory_id=memory_id
        )
        
        db.session.add(reminder)
        db.session.commit()
        
        return jsonify({
            'message': 'Reminder created successfully',
            'reminder': reminder.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to create reminder', 'error': str(e)}), 500

@reminders_bp.route('/<int:reminder_id>', methods=['PUT'])
@jwt_required()
def update_reminder(reminder_id):
    try:
        current_user_id = get_jwt_identity()
        reminder = Reminder.query.filter_by(id=reminder_id, user_id=current_user_id).first()
        
        if not reminder:
            return jsonify({'message': 'Reminder not found'}), 404
        
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'No data provided'}), 400
        
        # Update fields if provided
        if 'title' in data:
            title = data['title'].strip()
            if not title:
                return jsonify({'message': 'Title cannot be empty'}), 400
            reminder.title = title
        
        if 'description' in data:
            reminder.description = data['description'].strip()
        
        if 'reminder_type' in data:
            reminder_type = data['reminder_type']
            if reminder_type in [e.value for e in ReminderType]:
                reminder.reminder_type = ReminderType(reminder_type)
        
        if 'trigger_date' in data:
            trigger_date_str = data['trigger_date']
            if trigger_date_str:
                try:
                    reminder.trigger_date = datetime.fromisoformat(trigger_date_str.replace('Z', '+00:00'))
                except ValueError:
                    return jsonify({'message': 'Invalid trigger date format'}), 400
            else:
                reminder.trigger_date = None
        
        if 'repeat_pattern' in data:
            reminder.repeat_pattern = data['repeat_pattern'].strip() or None
        
        if 'memory_id' in data:
            memory_id = data['memory_id']
            if memory_id:
                memory = Memory.query.filter_by(id=memory_id, user_id=current_user_id).first()
                if not memory:
                    return jsonify({'message': 'Associated memory not found'}), 404
            reminder.memory_id = memory_id
        
        db.session.commit()
        
        return jsonify({
            'message': 'Reminder updated successfully',
            'reminder': reminder.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to update reminder', 'error': str(e)}), 500

@reminders_bp.route('/<int:reminder_id>', methods=['DELETE'])
@jwt_required()
def delete_reminder(reminder_id):
    try:
        current_user_id = get_jwt_identity()
        reminder = Reminder.query.filter_by(id=reminder_id, user_id=current_user_id).first()
        
        if not reminder:
            return jsonify({'message': 'Reminder not found'}), 404
        
        db.session.delete(reminder)
        db.session.commit()
        
        return jsonify({'message': 'Reminder deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to delete reminder', 'error': str(e)}), 500

@reminders_bp.route('/<int:reminder_id>/complete', methods=['POST'])
@jwt_required()
def complete_reminder(reminder_id):
    try:
        current_user_id = get_jwt_identity()
        reminder = Reminder.query.filter_by(id=reminder_id, user_id=current_user_id).first()
        
        if not reminder:
            return jsonify({'message': 'Reminder not found'}), 404
        
        reminder.mark_completed()
        
        return jsonify({
            'message': 'Reminder marked as completed',
            'reminder': reminder.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to complete reminder', 'error': str(e)}), 500

@reminders_bp.route('/<int:reminder_id>/uncomplete', methods=['POST'])
@jwt_required()
def uncomplete_reminder(reminder_id):
    try:
        current_user_id = get_jwt_identity()
        reminder = Reminder.query.filter_by(id=reminder_id, user_id=current_user_id).first()
        
        if not reminder:
            return jsonify({'message': 'Reminder not found'}), 404
        
        reminder.mark_uncompleted()
        
        return jsonify({
            'message': 'Reminder marked as pending',
            'reminder': reminder.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to uncomplete reminder', 'error': str(e)}), 500

@reminders_bp.route('/upcoming', methods=['GET'])
@jwt_required()
def get_upcoming_reminders():
    try:
        current_user_id = get_jwt_identity()
        days_ahead = request.args.get('days', 7, type=int)
        
        end_date = datetime.utcnow() + timedelta(days=days_ahead)
        
        reminders = Reminder.query.filter(
            Reminder.user_id == current_user_id,
            Reminder.is_completed == False,
            Reminder.trigger_date <= end_date,
            Reminder.trigger_date >= datetime.utcnow()
        ).order_by(asc(Reminder.trigger_date)).all()
        
        return jsonify({
            'reminders': [reminder.to_dict() for reminder in reminders],
            'count': len(reminders)
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to retrieve upcoming reminders', 'error': str(e)}), 500

@reminders_bp.route('/overdue', methods=['GET'])
@jwt_required()
def get_overdue_reminders():
    try:
        current_user_id = get_jwt_identity()
        
        reminders = Reminder.query.filter(
            Reminder.user_id == current_user_id,
            Reminder.is_completed == False,
            Reminder.trigger_date < datetime.utcnow()
        ).order_by(asc(Reminder.trigger_date)).all()
        
        return jsonify({
            'reminders': [reminder.to_dict() for reminder in reminders],
            'count': len(reminders)
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to retrieve overdue reminders', 'error': str(e)}), 500 