from fastapi import HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete, func, and_, between, or_, asc, desc
from slugify import slugify
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional, Union, Dict, Any
from app.database import get_database
from app.models.UserModel import User
from app.models.UserTokenModel import Usertoken
from app.utils.messaging_service import MessagingService
from app.apiv1.email_templates.get_password_reset_template import get_password_reset_template
from app.utils.security import verify_password, create_user_access_token, invalidate_user_tokens, is_valid_email, get_password_hash
from app.utils.returns_data import returnsdata
import re
import os
import random



async def authenticate_user(db: AsyncSession, email: str, password: str, remember: bool = False) -> Dict[str, Any]:
    try:
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Invalid email or password" )
        if not verify_password(password, user.password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Invalid email or password")
        if not user.status:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="User account is deactivated")
        expires_delta = timedelta(days=30) if remember else None
        device_fingerprint = f"admin-{user.id}"
        user_data = await user.to_dict()
        token_data = await create_user_access_token(db=db,user=user_data,data={"device_fingerprint": device_fingerprint},expires_delta=expires_delta)
        return {
            "user": await user.to_dict_with_relations(db=db),
            "authtoken": token_data
        }

        
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


async def send_verify_code_to_email(db: AsyncSession, email: str):
    messaging_service = MessagingService()
    try:
        # Validate email format
        if not is_valid_email(email):
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,detail="Invalid email format")
        # Check if user exists
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Invalid email or password")

        # Generate a random 6-digit code
        code = str(random.randint(100000, 999999))
        subject = "Reset your Boomry Password with this Code"
        html_content = get_password_reset_template(code)
    
        result = await messaging_service.send_email(
            recipient_email=email,
            subject=subject,
            html_content=html_content
        )
        if result["status"] == "error":
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail=str(result["message"]) )
        user.verify_code = code
        user.verify_code_at = datetime.utcnow()
        await db.commit()
        await db.refresh(user)
        return result
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail=str(e))
        
        
async def verify_reset_code_to_email(db: AsyncSession, code: str):
    try:
        # Check if user exists
        result = await db.execute(select(User).where(User.verify_code == code))
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Invalid Verify Code")

        user.verify_code = None
        user.verify_code_at = None
        await db.commit()
        await db.refresh(user)
        return user

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail=str(e))



async def update_user_password(db: AsyncSession, email: str, password: str, user_id: str):
    try:
        result = await db.execute(select(User).where(User.email == email).where(User.id == user_id))
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Please Reload Page and repeat this Process")
        hashed_password = get_password_hash(password)
        user.password = hashed_password
        await db.commit()
        await db.refresh(user)
        return user
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail=str(e))


async def get_user_by_id(db: AsyncSession, id: str):
    try:
        result = await db.execute(select(User).where(User.id == id))
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Please Reload Page and repeat this Process")
        return user
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail=str(e))


async def logout_user(db: AsyncSession, user_id: str, device_fingerprint: Optional[str] = None):
    try:
        device_fp = device_fingerprint or f"admin-{user_id}"
        await invalidate_user_tokens(user_id, device_fp, db)
        return True
    except Exception as e:
        raise HTTPException( status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail=f"Failed to logout: {str(e)}")
