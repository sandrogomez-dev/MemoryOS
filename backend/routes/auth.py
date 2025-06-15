from flask import Blueprint, request, jsonify, make_response
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, set_access_cookies, unset_jwt_cookies
from models.user import User
from app import db
import re

auth_bp = Blueprint('auth', __name__)

def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    # At least 8 characters, one uppercase, one lowercase, one number
    if len(password) < 8:
        return False
    if not re.search("[a-z]", password):
        return False
    if not re.search("[A-Z]", password):
        return False
    if not re.search("\d", password):
        return False
    return True

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'No data provided'}), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        name = data.get('name', '').strip()
        
        # Validation
        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400
        
        if not validate_email(email):
            return jsonify({'message': 'Invalid email format'}), 400
        
        if not validate_password(password):
            return jsonify({'message': 'Password must be at least 8 characters with uppercase, lowercase, and number'}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=email).first():
            return jsonify({'message': 'User already exists'}), 409
        
        # Create new user
        user = User(email=email, password=password, name=name)
        db.session.add(user)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        # Create response with httpOnly cookie
        response = make_response(jsonify({
            'message': 'Registration successful',
            'user': user.to_dict()
        }))
        
        set_access_cookies(response, access_token)
        
        return response, 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Registration failed', 'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'No data provided'}), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400
        
        # Find user
        user = User.query.filter_by(email=email).first()
        
        if not user or not user.check_password(password):
            return jsonify({'message': 'Invalid credentials'}), 401
        
        if not user.is_active:
            return jsonify({'message': 'Account is deactivated'}), 401
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        # Create response with httpOnly cookie
        response = make_response(jsonify({
            'message': 'Login successful',
            'user': user.to_dict()
        }))
        
        set_access_cookies(response, access_token)
        
        return response, 200
        
    except Exception as e:
        return jsonify({'message': 'Login failed', 'error': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    response = make_response(jsonify({'message': 'Logout successful'}))
    unset_jwt_cookies(response)
    return response, 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify({'user': user.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get user info', 'error': str(e)}), 500

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required()
def refresh():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # Create new access token
        access_token = create_access_token(identity=user.id)
        
        response = make_response(jsonify({
            'message': 'Token refreshed successfully',
            'user': user.to_dict()
        }))
        
        set_access_cookies(response, access_token)
        
        return response, 200
        
    except Exception as e:
        return jsonify({'message': 'Token refresh failed', 'error': str(e)}), 500 