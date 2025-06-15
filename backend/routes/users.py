from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User, SubscriptionType
from models.memory import Memory
from models.reminder import Reminder
from database import db
from datetime import datetime, timedelta

users_bp = Blueprint('users', __name__)

@users_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify({'user': user.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to retrieve profile', 'error': str(e)}), 500

@users_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'No data provided'}), 400
        
        # Update name if provided
        if 'name' in data:
            user.name = data['name'].strip()
        
        # Update email if provided
        if 'email' in data:
            email = data['email'].strip().lower()
            if email != user.email:
                # Check if email already exists
                existing_user = User.query.filter_by(email=email).first()
                if existing_user:
                    return jsonify({'message': 'Email already in use'}), 409
                user.email = email
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to update profile', 'error': str(e)}), 500

@users_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'No data provided'}), 400
        
        current_password = data.get('current_password', '')
        new_password = data.get('new_password', '')
        
        if not current_password or not new_password:
            return jsonify({'message': 'Current and new passwords are required'}), 400
        
        # Verify current password
        if not user.check_password(current_password):
            return jsonify({'message': 'Current password is incorrect'}), 401
        
        # Validate new password
        if len(new_password) < 8:
            return jsonify({'message': 'New password must be at least 8 characters long'}), 400
        
        # Update password
        user.set_password(new_password)
        db.session.commit()
        
        return jsonify({'message': 'Password changed successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to change password', 'error': str(e)}), 500

@users_bp.route('/subscription', methods=['GET'])
@jwt_required()
def get_subscription():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # Get usage stats
        memory_count = Memory.query.filter_by(user_id=current_user_id).count()
        reminder_count = Reminder.query.filter_by(user_id=current_user_id).count()
        
        # Calculate limits based on subscription
        memory_limit = None if user.subscription_type == SubscriptionType.premium else 100
        
        return jsonify({
            'subscription_type': user.subscription_type.value,
            'memory_count': memory_count,
            'memory_limit': memory_limit,
            'reminder_count': reminder_count,
            'features': {
                'unlimited_memories': user.subscription_type == SubscriptionType.premium,
                'ai_features': user.subscription_type == SubscriptionType.premium,
                'multimedia_storage': user.subscription_type == SubscriptionType.premium,
                'encryption': user.subscription_type == SubscriptionType.premium,
                'cloud_backup': user.subscription_type == SubscriptionType.premium
            }
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to retrieve subscription info', 'error': str(e)}), 500

@users_bp.route('/subscription/upgrade', methods=['POST'])
@jwt_required()
def upgrade_subscription():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        if user.subscription_type == SubscriptionType.premium:
            return jsonify({'message': 'User already has premium subscription'}), 400
        
        # In a real app, you would integrate with Stripe here
        # For now, we'll just simulate the upgrade
        user.subscription_type = SubscriptionType.premium
        db.session.commit()
        
        return jsonify({
            'message': 'Subscription upgraded to Premium successfully',
            'subscription_type': user.subscription_type.value
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to upgrade subscription', 'error': str(e)}), 500

@users_bp.route('/subscription/downgrade', methods=['POST'])
@jwt_required()
def downgrade_subscription():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        if user.subscription_type == SubscriptionType.free:
            return jsonify({'message': 'User already has free subscription'}), 400
        
        # Check if user has more than 100 memories
        memory_count = Memory.query.filter_by(user_id=current_user_id).count()
        if memory_count > 100:
            return jsonify({
                'message': f'Cannot downgrade: You have {memory_count} memories. Please delete some to get under the 100 memory limit for free accounts.'
            }), 400
        
        user.subscription_type = SubscriptionType.free
        db.session.commit()
        
        return jsonify({
            'message': 'Subscription downgraded to Free successfully',
            'subscription_type': user.subscription_type.value
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to downgrade subscription', 'error': str(e)}), 500

@users_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # Get stats
        memory_count = Memory.query.filter_by(user_id=current_user_id).count()
        reminder_count = Reminder.query.filter_by(user_id=current_user_id).count()
        
        # Get recent memories
        recent_memories = Memory.query.filter_by(user_id=current_user_id)\
            .order_by(Memory.created_at.desc())\
            .limit(5)\
            .all()
        
        # Get upcoming reminders
        upcoming_reminders = Reminder.query.filter(
            Reminder.user_id == current_user_id,
            Reminder.is_completed == False,
            Reminder.trigger_date >= datetime.utcnow(),
            Reminder.trigger_date <= datetime.utcnow() + timedelta(days=7)
        ).order_by(Reminder.trigger_date.asc())\
         .limit(5)\
         .all()
        
        # Get overdue reminders
        overdue_reminders = Reminder.query.filter(
            Reminder.user_id == current_user_id,
            Reminder.is_completed == False,
            Reminder.trigger_date < datetime.utcnow()
        ).count()
        
        return jsonify({
            'user': user.to_dict(),
            'stats': {
                'memory_count': memory_count,
                'reminder_count': reminder_count,
                'overdue_reminders': overdue_reminders,
                'memory_limit': None if user.subscription_type == SubscriptionType.premium else 100
            },
            'recent_memories': [memory.to_dict(include_content=False) for memory in recent_memories],
            'upcoming_reminders': [reminder.to_dict() for reminder in upcoming_reminders]
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to retrieve dashboard', 'error': str(e)}), 500

@users_bp.route('/deactivate', methods=['POST'])
@jwt_required()
def deactivate_account():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        user.is_active = False
        db.session.commit()
        
        return jsonify({'message': 'Account deactivated successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to deactivate account', 'error': str(e)}), 500 