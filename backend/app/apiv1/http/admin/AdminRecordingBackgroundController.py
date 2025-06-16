from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_database
from app.utils.security import get_current_user_details, verify_admin_access
from app.utils.returns_data import returnsdata
from app.utils.constants import SUCCESS, ERROR
from app.utils.RecordingBackgroundUtil import recording_service
from app.apiv1.services.admin.AdminRecordingBackgroundService import recording_scheduler
from datetime import datetime

service_router = APIRouter()

@service_router.post("/status")
async def get_recording_service_status(request: Request,current_user = Depends(get_current_user_details)):
    try:
        verify_admin_access(current_user)
        
        status_data = recording_service.get_status()
        
        return returnsdata.success(
            data=status_data,
            msg="Recording service status retrieved successfully",
            status=SUCCESS
        )
    except Exception as e:
        return returnsdata.error_msg(f"Failed to get service status: {str(e)}", ERROR)


@service_router.post("/restart")
async def restart_recording_service(request: Request,current_user = Depends(get_current_user_details)):
    try:
        verify_admin_access(current_user)
        
        await recording_service.stop()
        await recording_service.start()
        
        return returnsdata.success(
            data={"restarted": True, "timestamp": datetime.now().isoformat()},
            msg="Recording service restarted successfully",
            status=SUCCESS
        )
    except Exception as e:
        return returnsdata.error_msg(f"Failed to restart recording service: {str(e)}", ERROR)


@service_router.post("/generate_today")
async def generate_today_recordings(request: Request,db: AsyncSession = Depends(get_database),current_user = Depends(get_current_user_details)):
    try:
        verify_admin_access(current_user)
        
        recordings = await recording_scheduler.generate_daily_recordings(db, datetime.now())
        
        return returnsdata.success(
            data={
                "generated_recordings": recordings,
                "count": len(recordings),
                "date": datetime.now().strftime('%Y-%m-%d')
            },
            msg=f"Generated {len(recordings)} recordings for today",
            status=SUCCESS
        )
    except Exception as e:
        return returnsdata.error_msg(f"Failed to generate today's recordings: {str(e)}", ERROR)


@service_router.post("/force_cleanup")
async def force_cleanup(request: Request,db: AsyncSession = Depends(get_database),current_user = Depends(get_current_user_details)):
    try:
        verify_admin_access(current_user)
        
        cleaned = await recording_scheduler.cleanup_failed_recordings(db)
        
        return returnsdata.success(
            data={
                "cleaned_recordings": cleaned,
                "timestamp": datetime.now().isoformat()
            },
            msg=f"Cleaned up {cleaned} failed recordings",
            status=SUCCESS
        )
    except Exception as e:
        return returnsdata.error_msg(f"Failed to cleanup recordings: {str(e)}", ERROR)