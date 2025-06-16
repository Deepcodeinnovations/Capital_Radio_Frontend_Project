from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete, func, and_, between, or_, asc, desc
from app.models.BaseModel import Base
from datetime import datetime
from typing import Optional, Dict, Any

class User(Base):
    __tablename__ = "users"
    
    role = Column(String(36), nullable=True)
    provider = Column(String(255), nullable=True)
    provider_id = Column(String(255), nullable=True)
    password = Column(String(255), nullable=True)
    allow_login = Column(Boolean, default=True)
    remember_token = Column(String(255), nullable=True)
    device_fingerprint = Column(String(255), nullable=True)

    # Profile fields
    name = Column(String(255), nullable=True)
    email = Column(String(255), nullable=True, unique=True, index=True)
    phone = Column(String(255), nullable=True)
    slug = Column(String(255), nullable=True)
    address = Column(String(255), nullable=True)
    image_path = Column(String(255), nullable=True)
    image_url = Column(String(255), nullable=True)
    about = Column(String(500), nullable=True)
    
    # Verification fields
    phone_verified_at = Column(DateTime, nullable=True)
    email_verified_at = Column(DateTime, nullable=True)
    verify_code = Column(String(6), nullable=True)
    verify_code_at = Column(DateTime, nullable=True)

    # Activity tracking
    last_seen = Column(DateTime, nullable=True)
    device_token = Column(Text, nullable=True)
    last_device = Column(Text, nullable=True)

    async def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'role': self.role,
            'provider': self.provider,
            'provider_id': self.provider_id,
            'allow_login': self.allow_login,
            'remember_token': self.remember_token,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'slug': self.slug,
            'address': self.address,
            'about': self.about,
            'image_path': self.image_path,
            'image_url': self.image_url,
            'phone_verified_at': self.phone_verified_at.isoformat() if self.phone_verified_at else None,
            'email_verified_at': self.email_verified_at.isoformat() if self.email_verified_at else None,
            'verify_code': self.verify_code,
            'verify_code_at': self.verify_code_at.isoformat() if self.verify_code_at else None,
            'last_seen': self.last_seen.isoformat() if self.last_seen else None,
            'device_token': self.device_token,
            'last_device': self.last_device,
            'status': self.status,
            'state': self.state,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    async def to_dict_with_relations(self, db: AsyncSession) -> Dict[str, Any]:
        try:
            await db.refresh(self)
            data = await self.to_dict()
            return data
            
        except Exception as e:
            raise Exception(f"Failed to convert user to dictionary with relations: {str(e)}")
    
    async def delete_with_relations(self, db: AsyncSession) -> bool:
        try:


            await db.execute(delete(User).where(User.id == self.id))
            return True
            
        except Exception as e:
            await db.rollback()
            raise Exception(f"Failed to delete user with relations: {str(e)}")