from fastapi import APIRouter
from app.apiv1.http.user import UserGlobalAccessController

user_routers = APIRouter()
user_routers.include_router(UserGlobalAccessController.router, prefix="/user", tags=["User Global Access"])
