from app import db
from datetime import datetime
import enum

class ReminderType(enum.Enum):
    spaced_repetition = "spaced_repetition"
    deadline = "deadline"
    habit = "habit"
    contextual = "contextual"

class Reminder(db.Model):
    __tablename__ = 'reminders'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    reminder_type = db.Column(db.Enum(ReminderType), default=ReminderType.deadline)
    trigger_date = db.Column(db.DateTime)
    repeat_pattern = db.Column(db.String(100))  # daily, weekly, custom
    is_completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = db.Column(db.DateTime)
    
    # Foreign Keys
    memory_id = db.Column(db.Integer, db.ForeignKey('memories.id'), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    def __init__(self, title, user_id, description=None, reminder_type=ReminderType.deadline, 
                 trigger_date=None, repeat_pattern=None, memory_id=None):
        self.title = title
        self.user_id = user_id
        self.description = description
        self.reminder_type = reminder_type
        self.trigger_date = trigger_date
        self.repeat_pattern = repeat_pattern
        self.memory_id = memory_id
    
    def mark_completed(self):
        self.is_completed = True
        self.completed_at = datetime.utcnow()
        db.session.commit()
    
    def mark_uncompleted(self):
        self.is_completed = False
        self.completed_at = None
        db.session.commit()
    
    def is_overdue(self):
        if self.trigger_date and not self.is_completed:
            return datetime.utcnow() > self.trigger_date
        return False
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'reminder_type': self.reminder_type.value,
            'trigger_date': self.trigger_date.isoformat() if self.trigger_date else None,
            'repeat_pattern': self.repeat_pattern,
            'is_completed': self.is_completed,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'memory_id': self.memory_id,
            'user_id': self.user_id,
            'is_overdue': self.is_overdue()
        }
    
    def __repr__(self):
        return f'<Reminder {self.title}>' 