from app import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import enum

class SubscriptionType(enum.Enum):
    free = "free"
    premium = "premium"

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(100))
    subscription_type = db.Column(db.Enum(SubscriptionType), default=SubscriptionType.free)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    memories = db.relationship('Memory', backref='user', lazy=True, cascade='all, delete-orphan')
    reminders = db.relationship('Reminder', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def __init__(self, email, password, name=None):
        self.email = email
        self.password = generate_password_hash(password)
        self.name = name
    
    def check_password(self, password):
        return check_password_hash(self.password, password)
    
    def set_password(self, password):
        self.password = generate_password_hash(password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'subscription_type': self.subscription_type.value,
            'created_at': self.created_at.isoformat(),
            'is_active': self.is_active
        }
    
    def __repr__(self):
        return f'<User {self.email}>' 