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
from app.utils.security import  create_user_access_token
from app.utils.returns_data import returnsdata
from app.utils.constants import BASE_URL
import re
import os
import random



async def authenticate_or_create_open_user(db: AsyncSession, device_fingerprint: str) -> Dict[str, Any]:
   try:
       result = await db.execute(select(User).where(User.device_fingerprint == device_fingerprint))
       user = result.scalar_one_or_none()
       
       if not user:
           # Create new user if not found
           slug = f"open-user-{device_fingerprint[:8]}"
           
           user = User(
               name=f"User - {device_fingerprint[:8]}",
               slug=slug,
               image_url= BASE_URL + "static/default.png",
               email=f"open-user-{device_fingerprint[:8]}@capitalfm.co.ug",
               role="open_user",
               device_fingerprint=device_fingerprint,
               last_seen=datetime.now(),
           )
           
           db.add(user)
           await db.commit()
           await db.refresh(user)
       
       expires_delta = timedelta(days=30)
       user_data = await user.to_dict()
       user.last_seen = datetime.now()
       await db.commit()
       token_data = await create_user_access_token(
           db=db,
           user=user_data,
           data={"device_fingerprint": device_fingerprint},
           expires_delta=expires_delta
       )
       
       return {
           "user": await user.to_dict_with_relations(db=db),
           "authtoken": token_data
       }
       
   except Exception as e:
       raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


async def update_user_information(db: AsyncSession, name: str, email: str, user_id: str):
    try:
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Please Reload Page and repeat this Process")
        user.name = name
        user.email = email
        user.last_seen = datetime.now()
        await db.commit()
        await db.refresh(user)
        return await user.to_dict_with_relations(db=db)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail=str(e))


async def get_user_by_id(db: AsyncSession, id: str):
    try:
        result = await db.execute(select(User).where(User.id == id))
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Please Reload Page and repeat this Process")
        user.last_seen = datetime.now()
        await db.commit()
        await db.refresh(user)
        return await user.to_dict_with_relations(db=db)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail=str(e))