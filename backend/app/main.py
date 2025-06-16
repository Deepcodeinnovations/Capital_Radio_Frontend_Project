from fastapi import FastAPI, Request, Response, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from contextlib import asynccontextmanager
from app.models import *
from app.routes import api_router
from app.database import init_models, close_models, get_database
from app.apiv1.services.admin.AdminRecordingBackgroundService import RecordingSchedulerService
from app.utils.RecordingBackgroundUtil import RecordingBackgroundService
import logging
import os

app = FastAPI(
    title="Capital Radio App System",
    description="Backend API for Captal Radio Application",
    version="1.0.0",
    openapi_extra={
        "x-upload-size-limit": 5000 * 1024 * 1024,  # 5000 MB
    }
)

# Global instance
recording_service = RecordingSchedulerService()
recording_background_service = RecordingBackgroundService()

# FastAPI lifespan event handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    await recording_background_service.start()
    try:
        async with get_database() as db:
            today_recordings = await recording_service.generate_daily_recordings(db)
            if today_recordings:
                logger.info(f"Generated {len(today_recordings)} recordings for today on startup")
    except Exception as e:
        logger.error(f"Error generating initial recordings: {str(e)}")
    
    yield
    await recording_background_service.stop()



# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)   
logger = logging.getLogger("uvicorn")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://192.168.100.10:3000", "http://localhost:3001","http://localhost:3002","http://localhost:5173",'https://boomry.com','https://admin.boomry.com'],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)


# Static files configuration
STATIC_DIR = "static"
UPLOADS_DIR = os.path.join(STATIC_DIR, "uploads")
if not os.path.exists(UPLOADS_DIR):
    os.makedirs(UPLOADS_DIR, exist_ok=True)

# Mount static directory
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@app.get("/")
async def read_root():
    return RedirectResponse("https://capitalradio.co.ug/", status_code=302)


app.include_router(api_router, prefix="/api/v1")
# Startup and shutdown events
@app.on_event("startup")
async def startup():
    try:
        logger.info("Initializing application...")
        await init_models()
        logger.info("Application startup completed successfully")
    except Exception as e:
        error_location = get_error_location()
        error_message = format_error_message(str(e), error_location)
        logger.error(f"Startup failed: {error_message}", exc_info=True)
        raise

@app.on_event("shutdown")
async def shutdown():
    try:
        logger.info("Shutting down application...")
        await close_models()
        logger.info("Application shutdown completed successfully")
    except Exception as e:
        error_location = get_error_location()
        error_message = format_error_message(str(e), error_location)
        logger.error(f"Shutdown failed: {error_message}", exc_info=True)
        raise