from fastapi import APIRouter, Request, status, HTTPException, Depends, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_database
from app.utils.constants import SUCCESS, ERROR
from app.utils.returns_data import returnsdata
from typing import Optional, Dict, Any
from app.utils.security import get_current_user_details, decode_and_validate_token, extract_token_from_header
from app.apiv1.services.admin.AdminAuthService import (
    authenticate_user,
    send_verify_code_to_email,
    verify_reset_code_to_email,
    update_user_password,
    get_user_by_id,
)

import json

router = APIRouter()


#admin
@router.post("/login",  status_code=status.HTTP_201_CREATED)
async def login_user(request: Request,  db: AsyncSession = Depends(get_database)):
    try:
        body_data = await request.form()
        email = body_data.get("email")
        password = body_data.get("password")
        remember = body_data.get("remember", False)

        if not email or not password:
            return  returnsdata.error_msg("Email and password are required", ERROR)
        user_data = await authenticate_user(db, email, password, remember)
        return  returnsdata.success(data=user_data,msg="Login successful",status="Success")
    except Exception as e:
        return returnsdata.error_msg( f"Logout failed: {str(e)}", ERROR )


@router.post("/password_reset",  status_code=status.HTTP_201_CREATED)
async def password_reset(request: Request,  db: AsyncSession = Depends(get_database)):
    try:
        body_data = await request.form()
        email = body_data.get("email")
        if not email:
            return  returnsdata.error_msg("Email and password are required", ERROR)
        user_data = await send_verify_code_to_email(db, email)
        return  returnsdata.success(data=user_data, msg="Password reset code sent", status="Success")
    except Exception as e:
        return returnsdata.error_msg( f"Logout failed: {str(e)}", ERROR )
        
@router.post("/verify_reset",  status_code=status.HTTP_201_CREATED)
async def verify_reset(request: Request,  db: AsyncSession = Depends(get_database)):
    try:
        body_data = await request.form()
        code = body_data.get("code")
        if not code:
            return returnsdata.error_msg("Verify Code is Required", ERROR)
        user_data = await verify_reset_code_to_email(db, code)
        if user_data:
            returndata = await user_data.to_dict()
            return returnsdata.success(data=returndata,msg="Password reset successful",status="Success")
    except Exception as e:
        return returnsdata.error_msg( f"Logout failed: {str(e)}", ERROR )

@router.post("/update_password",  status_code=status.HTTP_201_CREATED)
async def update_password(request: Request,  db: AsyncSession = Depends(get_database)):
    try:
        body_data = await request.form()
        email = body_data.get("email")
        password = body_data.get("password")
        user_id = body_data.get("user_id")
        if not email:
            return returnsdata.error_msg("Email is Required", ERROR)
        if not password:
            return returnsdata.error_msg("Password is Required", ERROR)
        if not user_id:
            return returnsdata.error_msg("User  is Required", ERROR)
        user_data = await update_user_password(db, email, password, user_id)
        if user_data:
            returndata = await user_data.to_dict()
            return returnsdata.success(data=returndata, msg="Password reset successful",status="Success")
    except Exception as e:
        return returnsdata.error_msg( f"Logout failed: {str(e)}", ERROR )

@router.post("/authuser",  status_code=status.HTTP_201_CREATED)
async def get_auth_user(request: Request,  db: AsyncSession = Depends(get_database), current_user = Depends(get_current_user_details)):
    try:
        user_id = current_user.get('id')
        user_data = await get_user_by_id(db, user_id)
        return  returnsdata.success(data=user_data, msg="Password reset code sent", status="Success" )
    except Exception as e:
        return returnsdata.error_msg( f"Logout failed: {str(e)}", ERROR )

# Admin logout
@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(authorization: Optional[str] = Header(None),db: AsyncSession = Depends(get_database)):
    try:
        if not authorization:
            return returnsdata.error_msg("Authorization header is required", ERROR)
        try:
            token = await extract_token_from_header(authorization)
        except HTTPException as e:
            return returnsdata.error_msg(str(e.detail), ERROR)
            
        try:
            payload = await decode_and_validate_token(token, db)
            user_id = payload.get("sub")
            device_fingerprint = payload.get("device_fingerprint", f"admin-{user_id}")
        except HTTPException as e:
            return returnsdata.error_msg(str(e.detail), ERROR)
        await logout_user(db, user_id, device_fingerprint)
        return returnsdata.success_msg(msg="Logged out successfully",status=SUCCESS ) 
    except Exception as e:
        return returnsdata.error_msg( f"Logout failed: {str(e)}", ERROR )
    

