# RecordingSchedulerService.py
import asyncio
import subprocess
import os
import signal
from datetime import datetime, timedelta, time
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_, or_
from fastapi import HTTPException, status
from app.models.RadioSessionRecordingModel import RadioSessionRecording, RECORDING_STATUSES
from app.models.StationScheduleModel import StationSchedule
from app.models.StationModel import Station
from app.models.RadioProgramModel import RadioProgram
from app.models.UserModel import User
from app.utils.constants import BASE_URL
from app.database import get_database
import logging
import json
from pathlib import Path
import requests
from app.utils.file_upload import remove_file

logger = logging.getLogger(__name__)

class RecordingSchedulerService:
    def __init__(self):
        self.recording_processes = {}  # Store active recording processes
        self.base_recording_path = os.getenv("RECORDING_BASE_PATH", "/var/recordings")
        self.recording_quality = os.getenv("DEFAULT_RECORDING_QUALITY", "128kbps")
        self.recording_format = os.getenv("DEFAULT_RECORDING_FORMAT", "mp3")
        self.max_retry_count = int(os.getenv("MAX_RECORDING_RETRIES", "3"))
        self.stream_timeout = int(os.getenv("STREAM_TIMEOUT_SECONDS", "30"))
        
        # Ensure recording directory exists
        Path(self.base_recording_path).mkdir(parents=True, exist_ok=True)
    
    async def generate_daily_recordings(self, db: AsyncSession, target_date: datetime = None) -> List[Dict[str, Any]]:
        if target_date is None:
            target_date = datetime.now()
        
        day_name = target_date.strftime('%A').lower()
        created_recordings = []
        
        try:
            stmt = select(Station).where(and_(Station.status == True, Station.state == True, Station.stream_status == 'active'))
            
            result = await db.execute(stmt)
            stations = result.scalars().all()
            
            for station in stations:
                # Validate station has streaming URL
                if not station.streaming_link:
                    logger.warning(f"Station {station.name} has no streaming URL, skipping recordings")
                    continue
                
                schedule_stmt = select(StationSchedule).where(and_(StationSchedule.station_id == station.id, StationSchedule.status == True, StationSchedule.state == True))
                
                schedule_result = await db.execute(schedule_stmt)
                schedule = schedule_result.scalar_one_or_none()
                
                if not schedule or not schedule.sessions or day_name not in schedule.sessions:
                    continue
                
                day_sessions = schedule.sessions[day_name]
                
                for session in day_sessions:
                    if not session.get('is_live', False):
                        continue
                    
                    existing_recording = await self._get_existing_recording(db, station.id, session, target_date)
                    
                    if existing_recording:
                        continue
                    
                    recording = await self._create_recording_entry(db, station, schedule, session, target_date)
                    
                    if recording:
                        created_recordings.append(recording)
            
            logger.info(f"Generated {len(created_recordings)} recordings for {target_date.date()}")
            return created_recordings
            
        except Exception as e:
            logger.error(f"Error generating daily recordings: {str(e)}")
            raise
    
    async def _get_existing_recording(self, db: AsyncSession, station_id: str, session: Dict, target_date: datetime) -> Optional[RadioSessionRecording]:
        start_time = datetime.combine(target_date.date(), datetime.strptime(session['start_time'], '%H:%M').time())
        
        stmt = select(RadioSessionRecording).where(and_(RadioSessionRecording.station_id == station_id, RadioSessionRecording.program_id == session['program_id'], RadioSessionRecording.scheduled_start_time == start_time, RadioSessionRecording.state == True))
        result = await db.execute(stmt)
        return result.scalar_one_or_none()
    

    
    async def _create_recording_entry(self, db: AsyncSession, station: Station, schedule: StationSchedule, session: Dict, target_date: datetime) -> Dict[str, Any]:
        try:
            start_time = datetime.combine(target_date.date(), datetime.strptime(session['start_time'], '%H:%M').time())
            end_time = datetime.combine(target_date.date(), datetime.strptime(session['end_time'], '%H:%M').time())
            
            
            if end_time <= start_time:
                end_time += timedelta(days=1)
            
            stream_url = station.streaming_link
            if not stream_url:
                logger.error(f"No valid streaming URL for station: {station.name}")
                return None
            
            if not await self._test_stream_connectivity(stream_url):
                logger.warning(f"Stream connectivity test failed for {station.name}: {stream_url}")
            
            recording = RadioSessionRecording(
                station_id=station.id,
                program_id=session['program_id'],
                session_date=target_date,
                day_of_week=target_date.strftime('%A').lower(),
                scheduled_start_time=start_time,
                scheduled_end_time=end_time,
                recording_status='scheduled',
                stream_url=stream_url,
                audio_format=self.recording_format,
                audio_quality=self.recording_quality,
                studio=session.get('studio', 'A'),
                hosts=session.get('hosts', []),
                session_notes=session.get('notes', ''),
                is_live_session=session.get('is_live', True),
                is_repeat_session=session.get('is_repeat', False),
                recording_metadata={
                    'station_name': station.name,
                    'station_frequency': station.frequency,
                    'backup_stream_url': station.backup_streaming_link,
                    'stream_url': station.streaming_link
                },
                status=True,
                state=True,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            
            db.add(recording)
            await db.commit()
            await db.refresh(recording)
            
            logger.info(f"Created recording for {station.name} - {session.get('start_time', 'Unknown')} to {session.get('end_time', 'Unknown')}")
            return await recording.to_dict_with_relations(db)
            
        except Exception as e:
            await db.rollback()
            logger.error(f"Error creating recording entry for station {station.name}: {str(e)}")
            return None
    
    async def _test_stream_connectivity(self, stream_url: str) -> bool:
        try:
            response = requests.head(stream_url, timeout=5)
            return response.status_code == 200
        except:
            return False
    


    async def start_recording(self, db: AsyncSession, recording_id: str) -> bool:
        try:
            stmt = select(RadioSessionRecording).where(RadioSessionRecording.id == recording_id)
            result = await db.execute(stmt)
            recording = result.scalar_one_or_none()
            
            if not recording:
                logger.error(f"Recording not found: {recording_id}")
                return False
            
            if recording.recording_status != 'scheduled':
                logger.warning(f"Recording {recording_id} is not in scheduled state: {recording.recording_status}")
                return False
            
            station_stmt = select(Station).where(Station.id == recording.station_id)
            station_result = await db.execute(station_stmt)
            station = station_result.scalar_one_or_none()
            
            if not station:
                logger.error(f"Station not found for recording {recording_id}")
                return False
            
            # Validate stream is available
            current_stream_url = station.streaming_link
            if not current_stream_url:
                recording.recording_status = 'failed'
                recording.error_message = 'No streaming URL available for station'
                await db.commit()
                return False
            
            # Update stream URL if it has changed
            if recording.stream_url != current_stream_url:
                recording.stream_url = current_stream_url
            
            # Generate file path with station-specific naming
            filename = self._generate_recording_filename(recording, station)
            station_dir = os.path.join(self.base_recording_path, station.name.replace(' ', '_').lower())
            Path(station_dir).mkdir(parents=True, exist_ok=True)
            file_path = os.path.join(station_dir, filename)
            
            process = await self._start_ffmpeg_recording(recording, station, file_path)
            
            if process:
                recording.recording_status = 'recording'
                recording.actual_start_time = datetime.utcnow()
                recording.recording_file_path = file_path
                recording.recording_process_id = str(process.pid)
                recording.updated_at = datetime.utcnow()
                
                await db.commit()
                
                # Store process reference
                self.recording_processes[recording_id] = process
                
                logger.info(f"Started recording {recording_id} for station {station.name} with PID {process.pid}")
                return True
            else:
                # Try backup stream if available
                if station.backup_streaming_link and station.backup_streaming_link != current_stream_url:
                    logger.info(f"Trying backup stream for {station.name}")
                    recording.stream_url = station.backup_streaming_link
                    process = await self._start_ffmpeg_recording(recording, station, file_path)
                    
                    if process:
                        recording.recording_status = 'recording'
                        recording.actual_start_time = datetime.utcnow()
                        recording.recording_file_path = file_path
                        recording.recording_process_id = str(process.pid)
                        recording.updated_at = datetime.utcnow()
                        
                        await db.commit()
                        self.recording_processes[recording_id] = process
                        
                        logger.info(f"Started recording {recording_id} for station {station.name} using backup stream with PID {process.pid}")
                        return True
                
                # Mark as failed
                recording.recording_status = 'failed'
                recording.error_message = 'Failed to start FFmpeg process'
                recording.retry_count += 1
                await db.commit()
                
            return False
            
        except Exception as e:
            logger.error(f"Error starting recording {recording_id}: {str(e)}")
            return False
    
    def _generate_recording_filename(self, recording: RadioSessionRecording, station: Station) -> str:
        date_str = recording.session_date.strftime('%Y%m%d')
        time_str = recording.scheduled_start_time.strftime('%H%M') if recording.scheduled_start_time else '0000'
        station_name = station.name.replace(' ', '_').replace('-', '_').lower()
        frequency = station.frequency.replace('.', '_')
        
        return f"{station_name}_{frequency}fm_{date_str}_{time_str}.{recording.audio_format}"
    
    
    async def _start_ffmpeg_recording(self, recording: RadioSessionRecording, station: Station, output_path: str) -> Optional[subprocess.Popen]:
        try:
            quality_settings = recording.get_recording_quality_settings()
            
            ffmpeg_cmd = [
                'ffmpeg',
                '-i', recording.stream_url,  # Input stream URL for this station
                '-reconnect', '1',  # Auto-reconnect on connection loss
                '-reconnect_streamed', '1',
                '-reconnect_delay_max', '30',
                '-timeout', str(self.stream_timeout * 1000000),  # Timeout in microseconds
                '-acodec', 'libmp3lame' if recording.audio_format == 'mp3' else 'copy',
                '-ab', quality_settings['bitrate'],
                '-ar', quality_settings['sample_rate'],
                '-ac', '2',  # Stereo
                '-metadata', f"title=Recording from {station.name} {station.frequency}FM",
                '-metadata', f"artist={station.name}",
                '-metadata', f"album=Radio Recordings",
                '-metadata', f"date={recording.session_date.strftime('%Y-%m-%d')}",
                '-y',  # Overwrite output file
                '-loglevel', 'warning',  # Reduce verbosity but keep important info
                output_path
            ]
            
            logger.info(f"Starting FFmpeg for {station.name}: {' '.join(ffmpeg_cmd[:8])}...")  # Log partial command for security
            
            # Start FFmpeg process
            process = subprocess.Popen(
                ffmpeg_cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                preexec_fn=os.setsid  # Create new process group
            )
            
            await asyncio.sleep(3)
            
            if process.poll() is None:
                logger.info(f"FFmpeg process started successfully for {station.name}")
                return process
            else:
                stderr_output = process.stderr.read().decode() if process.stderr else "Unknown error"
                logger.error(f"FFmpeg failed to start for {station.name}: {stderr_output}")
                return None
                
        except Exception as e:
            logger.error(f"Error starting FFmpeg for {station.name}: {str(e)}")
            return None
    
    async def stop_recording(self, db: AsyncSession, recording_id: str) -> bool:
        try:
            stmt = select(RadioSessionRecording).where(RadioSessionRecording.id == recording_id)
            result = await db.execute(stmt)
            recording = result.scalar_one_or_none()
            
            if not recording:
                logger.error(f"Recording not found: {recording_id}")
                return False
            
            if recording.recording_status != 'recording':
                logger.warning(f"Recording {recording_id} is not currently recording: {recording.recording_status}")
                return False
            
            station_stmt = select(Station).where(Station.id == recording.station_id)
            station_result = await db.execute(station_stmt)
            station = station_result.scalar_one_or_none()
            station_name = station.name if station else "Unknown Station"
            
            process = self.recording_processes.get(recording_id)
            if process:
                try:
                    os.killpg(os.getpgid(process.pid), signal.SIGTERM)
                    
                    try:
                        await asyncio.wait_for(
                            asyncio.create_task(asyncio.to_thread(process.wait)), 
                            timeout=10
                        )
                    except asyncio.TimeoutError:
                        logger.warning(f"Force killing FFmpeg process for {station_name}")
                        os.killpg(os.getpgid(process.pid), signal.SIGKILL)
                        process.wait()
                    
                    del self.recording_processes[recording_id]
                except Exception as e:
                    logger.error(f"Error stopping recording process for {station_name}: {str(e)}")
            
            recording.recording_status = 'completed'
            recording.actual_end_time = datetime.utcnow()
            recording.updated_at = datetime.utcnow()
            
            if recording.actual_start_time and recording.actual_end_time:
                duration = recording.actual_end_time - recording.actual_start_time
                recording.duration_minutes = int(duration.total_seconds() / 60)
            
            if recording.recording_file_path and os.path.exists(recording.recording_file_path):
                file_size_bytes = os.path.getsize(recording.recording_file_path)
                recording.file_size_mb = round(file_size_bytes / (1024 * 1024), 2)
                
                recording.recording_file_url = self._generate_public_url(recording.recording_file_path)
            
            await db.commit()
            
            logger.info(f"Stopped recording {recording_id} for {station_name}")
            return True
            
        except Exception as e:
            logger.error(f"Error stopping recording {recording_id}: {str(e)}")
            return False
    
    def _generate_public_url(self, file_path: str) -> str:
        relative_path = os.path.relpath(file_path, self.base_recording_path)
        return f"{BASE_URL}/{relative_path}"
    
    async def check_and_manage_recordings(self, db: AsyncSession) -> Dict[str, int]:
        now = datetime.utcnow()
        stats = {
            'started': 0,
            'stopped': 0,
            'failed': 0
        }
        
        try:
            # Get recordings that should start
            start_stmt = select(RadioSessionRecording).where(and_(RadioSessionRecording.recording_status == 'scheduled',RadioSessionRecording.scheduled_start_time <= now,RadioSessionRecording.is_live_session == True,RadioSessionRecording.state == True))
            
            result = await db.execute(start_stmt)
            recordings_to_start = result.scalars().all()
            
            for recording in recordings_to_start:
                if await self.start_recording(db, recording.id):
                    stats['started'] += 1
                else:
                    stats['failed'] += 1
            
            # Get recordings that should stop
            stop_stmt = select(RadioSessionRecording).where(and_(RadioSessionRecording.recording_status == 'recording',RadioSessionRecording.scheduled_end_time <= now,RadioSessionRecording.state == True))
            
            result = await db.execute(stop_stmt)
            recordings_to_stop = result.scalars().all()
            
            for recording in recordings_to_stop:
                if await self.stop_recording(db, recording.id):
                    stats['stopped'] += 1
                else:
                    stats['failed'] += 1
            
            return stats
            
        except Exception as e:
            logger.error(f"Error in check_and_manage_recordings: {str(e)}")
            return stats
    


    async def cleanup_failed_recordings(self, db: AsyncSession) -> int:
        cleaned = 0
        
        try:
            for recording_id, process in list(self.recording_processes.items()):
                if process.poll() is not None:  # Process has terminated
                    stmt = select(RadioSessionRecording).where(RadioSessionRecording.id == recording_id)
                    result = await db.execute(stmt)
                    recording = result.scalar_one_or_none()
                    
                    if recording and recording.recording_status == 'recording':
                        recording.recording_status = 'failed'
                        recording.error_message = 'Recording process terminated unexpectedly'
                        recording.actual_end_time = datetime.utcnow()
                        recording.updated_at = datetime.utcnow()
                        
                        await db.commit()
                        del self.recording_processes[recording_id]
                        cleaned += 1
            
            return cleaned
            
        except Exception as e:
            logger.error(f"Error cleaning up failed recordings: {str(e)}")
            return cleaned
    


    async def get_station_recording_status(self, db: AsyncSession, station_id: str) -> Dict[str, Any]:
        try:
            stmt = select(RadioSessionRecording).where(and_(RadioSessionRecording.station_id == station_id,RadioSessionRecording.recording_status.in_(['scheduled', 'recording']),RadioSessionRecording.state == True))
            result = await db.execute(stmt)
            recordings = result.scalars().all()
            
            station_stmt = select(Station).where(Station.id == station_id)
            station_result = await db.execute(station_stmt)
            station = station_result.scalar_one_or_none()
            
            if not station:
                return {"error": "Station not found"}
            
            return {
                "station_id": station_id,
                "station_name": station.name,
                "stream_url": station.streaming_url,
                "stream_status": station.stream_status,
                "active_recordings": len([r for r in recordings if r.recording_status == 'recording']),
                "scheduled_recordings": len([r for r in recordings if r.recording_status == 'scheduled']),
                "recordings": [await r.to_dict() for r in recordings]
            }
            
        except Exception as e:
            logger.error(f"Error getting station recording status: {str(e)}")
            return {"error": str(e)}

# Singleton instance
recording_scheduler = RecordingSchedulerService()