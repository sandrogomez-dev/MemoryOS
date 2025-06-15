from flask import Flask, send_from_directory
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from datetime import timedelta
import os
from dotenv import load_dotenv

# Import database configuration
from database import db, init_db

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__, static_folder='dist', static_url_path='')

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-string-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_COOKIE_SECURE'] = os.getenv('FLASK_ENV') == 'production'
app.config['JWT_COOKIE_CSRF_PROTECT'] = False

# Database configuration
if os.getenv('DATABASE_URL'):
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///memoryos.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
init_db(app)  # Initialize database with app
jwt = JWTManager(app)

# CORS configuration for production
cors_origins = [
    "http://localhost:3000",  # Local development
    "https://memory-os-*.vercel.app",  # Vercel deployments
    "https://memoryos.vercel.app"  # Custom domain if you have one
]

CORS(app, 
     supports_credentials=True,
     origins=cors_origins,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# Import models
from models.user import User
from models.memory import Memory
from models.reminder import Reminder

# Import routes
from routes.auth import auth_bp
from routes.memories import memories_bp
from routes.reminders import reminders_bp
from routes.users import users_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(memories_bp, url_prefix='/api/memories')
app.register_blueprint(reminders_bp, url_prefix='/api/reminders')
app.register_blueprint(users_bp, url_prefix='/api/users')

# Serve React app
@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# Health check route
@app.route('/api/health')
def health_check():
    return {'status': 'healthy', 'message': 'MemoryOS Backend is running!'}, 200

# Create tables on startup
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001) 