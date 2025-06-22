from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any, Annotated
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import and_, select
from sqlalchemy.exc import SQLAlchemyError
from passlib.context import CryptContext
from app.database import get_database
from app.utils.returns_data import returnsdata
from app.utils.constants import SUCCESS, ERROR
from app.models.UserModel import User
from app.models.UserTokenModel import Usertoken
import os
import re
import json
import logging
from dotenv import load_dotenv


# Load environment variables
load_dotenv()

# Constants
SECRET_KEY = os.getenv("SECRET_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyOCwidXNlcm5hbWUiOiJyYW5kb21fdXNlciJ9.KfpKPkcoVZBIlVXZJ6eSpxFG6wlGbGUDnU8VlESnL-Q")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "6000000"))

# Setup password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

async def create_user_access_token(db: AsyncSession,user: Dict[str, Any],data: Dict[str, Any],expires_delta: Optional[timedelta] = None) -> Dict[str, Any]:
    try:
        if not isinstance(user, dict) or not user.get('id') or not user.get('email'):
            raise ValueError("Invalid user data: missing required fields")
        expire = datetime.now(timezone.utc) + (
            expires_delta if expires_delta 
            else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )

        token_data = {
            "sub": str(user["id"]),
            "email": str(user["email"]),
            "exp": expire,
            "device_fingerprint": str(data.get("device_fingerprint", ""))
        }

        encoded_jwt = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

        if token_data["device_fingerprint"]:
            try:
                stmt = select(Usertoken).where(
                    and_(
                        Usertoken.user_id == user["id"],
                        Usertoken.device_fingerprint == token_data["device_fingerprint"],
                        Usertoken.revoked == False,
                        Usertoken.status == True,
                        Usertoken.expires_at > datetime.now(timezone.utc)
                    )
                )
                result = await db.execute(stmt)
                existing_token = result.scalar_one_or_none()

                if existing_token:
                    # Update existing token
                    existing_token.access_token = encoded_jwt
                    existing_token.token_type = "bearer"
                    existing_token.expires_at = expire
                    existing_token.last_used_at = datetime.now(timezone.utc)
                    existing_token.revoked = False
                    existing_token.status = True
                    db.add(existing_token)
                else:
                    # Create new token
                    new_token = Usertoken(
                        user_id=user["id"],
                        access_token=encoded_jwt,
                        token_type="bearer",
                        expires_at=expire,
                        device_fingerprint=token_data["device_fingerprint"],
                        last_used_at=datetime.now(timezone.utc)
                    )
                    db.add(new_token)

                await db.commit()

            except SQLAlchemyError as e:
                await db.rollback()
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Database error: {str(e)}"
                )

        return {
            "access_token": encoded_jwt,
            "token_type": "bearer",
            "expires_at": expire.isoformat(),
            "device_fingerprint": token_data["device_fingerprint"]
        }

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create access token"
        )

async def extract_token_from_header(authorization: Annotated[str | None, Header()] = None) -> str:
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=returnsdata.error_msg("Missing authorization header", ERROR)
        )

    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=returnsdata.error_msg("Invalid authorization scheme", ERROR)
            )
        print('Authorization Bearere Code Extracted')
        print(token)
        return token
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=returnsdata.error_msg("Invalid authorization format", ERROR)
        )



async def decode_and_validate_token(token: str, db: AsyncSession) -> Dict[str, Any]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            return returnsdata.error_msg("Invalid token payload", "error")
        token_query = select(Usertoken).where(
            Usertoken.user_id == user_id,
            Usertoken.access_token == token,
            Usertoken.revoked == False,
            Usertoken.expires_at > datetime.now(timezone.utc),
            Usertoken.status == True,
            Usertoken.state == True
        )

        result = await db.execute(token_query)
        token_data = result.scalar_one_or_none()
        print("Token Data")
        print(token_data)
        if not token_data:
            return returnsdata.error_msg("Token not found or expired", "error")

        token_data.last_used_at = datetime.now(timezone.utc)
        await db.commit()
        
        return payload
        
    except JWTError:
        return returnsdata.error_msg("Invalid token format", "error")
    except Exception as e:
        return returnsdata.error_msg(f"Error validating token: {str(e)}", "error")



async def get_user_from_token(payload: Dict[str, Any], db: AsyncSession) -> Dict[str, Any]:
    try:
        print("Now Extracting User Data")
        print(payload.get("sub"))
        user_id = payload.get("sub")
        print("This is the user Id of the Logined User===================================================")
        print(user_id)
        stmt = select(User).where(and_(User.id == user_id,User.state == True,User.status == True))
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()
        
        if not user:
            return returnsdata.error_msg("User not found or inactive", ERROR)
        print("Updating user Last Seen")
        user.last_seen =datetime.now(timezone.utc)
        await db.commit()
        print("User Last Seen Updated and returning")
        return await user.to_dict_with_relations(db)
    except Exception as e:
       return returnsdata.error_msg(f"Something Wrong Has Happened: {str(e)}", ERROR)


async def get_current_user_details(authorization: Optional[str] = Header(None),db: AsyncSession = Depends(get_database)) -> Dict[str, Any]:
    token = await extract_token_from_header(authorization)
    print('Token Extracted Well')
    payload = await decode_and_validate_token(token, db)
    print(payload)
    print('Payload Extracted Well')
    user_data = await get_user_from_token(payload, db)
    print(user_data)
    return user_data


async def invalidate_user_tokens(user_id: str,device_fingerprint: str,db: AsyncSession) -> None:
    try:
        query = select(Usertoken).where(
            and_(
                Usertoken.user_id == user_id,
                Usertoken.device_fingerprint == device_fingerprint
            )
        )
        result = await db.execute(query)
        token_records = result.scalars().all()

        if token_records:
            for token_record in token_records:
                token_record.revoked = True
                token_record.status = False
                db.add(token_record)
            
            await db.commit()

    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to invalidate tokens"
        )

def verify_admin_access(current_user: Dict[str, Any]) -> None:
    try:
        if not current_user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
        authuser = None
        if hasattr(current_user, 'status_code'):
           import json
           authuser = json.loads(current_user.body.decode())
        else:
            authuser = current_user
        if authuser.get('role') != 'admin':
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
        return authuser
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Access verification error: {str(e)}")

# Password utilities
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def is_valid_email(email: str) -> bool:
    email_regex = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return re.match(email_regex, email) is not None