from fastapi import APIRouter, HTTPException, Request, Response, Depends
from fastapi.responses import StreamingResponse
import httpx
from app.models.StationModel import Station
from app.database import get_database
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

router = APIRouter()

@router.post("/stream")
async def stream_station_audio(request: Request, db: AsyncSession = Depends(get_database)):
    form_data = await request.form()
    access_link = form_data.get("access_link")
    if not access_link:
        raise HTTPException(status_code=404, detail="Station not found")
    stmt = select(Station).where(and_(Station.access_link == access_link, Station.state == True, Station.status == True, Station.radio_access_status == True))
    station = (await db.execute(stmt)).scalar_one_or_none()
    
    if not station or not station.streaming_link:
        raise HTTPException(status_code=404, detail="Station not found")
    
    async def audio_generator():
        async with httpx.AsyncClient(timeout=httpx.Timeout(10.0, read=None)) as client:
            headers = {'User-Agent': request.headers.get('User-Agent', 'Capital Radio Proxy/1.0')}
            async with client.stream('GET', station.streaming_link, headers=headers) as response:
                if response.status_code not in [200, 206]:
                    raise HTTPException(status_code=response.status_code, detail="Stream error")
                async for chunk in response.aiter_bytes(chunk_size=8192):
                    yield chunk
    
    return StreamingResponse(
        audio_generator(),
        media_type="audio/mpeg",
        headers={
            "Accept-Ranges": "bytes",
            "Cache-Control": "no-cache",
            "Access-Control-Allow-Origin": "*"
        }
    )

@router.post("/stream/info")
async def get_station_stream_info(request: Request, db: AsyncSession = Depends(get_database)):
    form_data = await request.form()
    access_link = form_data.get("access_link")
    if not access_link:
        raise HTTPException(status_code=404, detail="Station not found")
    stmt = select(Station).where(and_(Station.access_link == access_link, Station.state == True, Station.status == True))
    station = (await db.execute(stmt)).scalar_one_or_none()
    
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
    
    return {
        "station_id": station.id,
        "station_name": station.name,
        "frequency": station.frequency,
        "stream_url": f"/api/v1/stream/{station.id}",
        "streaming_status": station.streaming_status,
        "logo_url": station.logo_url
    }