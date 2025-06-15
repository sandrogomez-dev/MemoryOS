from app import db
from datetime import datetime
import enum

class MemoryType(enum.Enum):
    note = "note"
    process = "process"
    learning = "learning"
    personal = "personal"

class Memory(db.Model):
    __tablename__ = 'memories'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text)
    memory_type = db.Column(db.Enum(MemoryType), default=MemoryType.note)
    tags = db.Column(db.JSON)
    importance_level = db.Column(db.Integer, default=1)  # 1-5 scale
    is_encrypted = db.Column(db.Boolean, default=False)
    media_url = db.Column(db.String(500))  # For multimedia files
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_accessed = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Relationships
    reminders = db.relationship('Reminder', backref='memory', lazy=True)
    
    def __init__(self, title, content, user_id, memory_type=MemoryType.note, importance_level=1, tags=None):
        self.title = title
        self.content = content
        self.user_id = user_id
        self.memory_type = memory_type
        self.importance_level = importance_level
        self.tags = tags or []
    
    def update_last_accessed(self):
        self.last_accessed = datetime.utcnow()
        db.session.commit()
    
    def to_dict(self, include_content=True):
        data = {
            'id': self.id,
            'title': self.title,
            'memory_type': self.memory_type.value,
            'tags': self.tags,
            'importance_level': self.importance_level,
            'is_encrypted': self.is_encrypted,
            'media_url': self.media_url,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'last_accessed': self.last_accessed.isoformat() if self.last_accessed else None,
            'user_id': self.user_id
        }
        
        if include_content:
            data['content'] = self.content
            
        return data
    
    def __repr__(self):
        return f'<Memory {self.title}>' 