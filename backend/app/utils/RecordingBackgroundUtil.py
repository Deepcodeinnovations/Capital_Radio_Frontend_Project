import asyncio
import subprocess
import os
import signal
import platform
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from fastapi import HTTPException, UploadFile
from app.models.RadioSessionRecordingModel import RadioSessionRecording
from app.models.StationModel import Station
from app.models.StationScheduleModel import StationSchedule
from app.models.RadioProgramModel import RadioProgram
from app.database import get_database
from app.utils.file_upload import save_upload_file
import logging
from pathlib import Path
import io

logger = logging.getLogger(__name__)

class EnhancedStationRecordingService:
    def __init__(self):
        self.station_tasks = {}
        self.recording_processes = {}
        self.base_recording_path = os.getenv("RECORDING_BASE_PATH", "./temp_recordings")
        self.recording_format = "mp3"
        self.check_interval = 5
        
        Path(self.base_recording_path).mkdir(parents=True, exist_ok=True)
        
        self.platform_system = platform.system().lower()
        self.is_windows = self.platform_system == 'windows'
        self.is_linux = self.platform_system == 'linux'
        self.is_mac = self.platform_system == 'darwin'
        
        logger.info(f"Enhanced Recording Service - Platform: {self.platform_system}")
    
    def _get_process_creation_kwargs(self):
        kwargs = {'stdout': subprocess.PIPE, 'stderr': subprocess.PIPE}
        if self.is_windows:
            kwargs['creationflags'] = subprocess.CREATE_NEW_PROCESS_GROUP
        else:
            kwargs['preexec_fn'] = os.setsid
        return kwargs
    
    def _terminate_process(self, process):
        try:
            if self.is_windows:
                process.terminate()
            else:
                os.killpg(os.getpgid(process.pid), signal.SIGTERM)
        except Exception as e:
            logger.warning(f"Graceful termination failed: {str(e)}")
            self._force_kill_process(process)
    
    def _force_kill_process(self, process):
        try:
            if self.is_windows:
                process.kill()
            else:
                os.killpg(os.getpgid(process.pid), signal.SIGKILL)
        except Exception as e:
            logger.error(f"Force kill failed: {str(e)}")
    
    def _add_seconds_to_time(self, time_str: str, seconds: int) -> str:
        try:
            hour, minute = map(int, time_str.split(':'))
            dt = datetime.now().replace(hour=hour, minute=minute, second=0)
            new_dt = dt + timedelta(seconds=seconds)
            return new_dt.strftime('%H:%M')
        except:
            return time_str
    
    def _time_to_seconds(self, time_str: str) -> int:
        try:
            hour, minute = map(int, time_str.split(':'))
            return hour * 3600 + minute * 60
        except:
            return 0
    
    def _get_current_session(self, schedule: StationSchedule) -> Optional[Dict]:
        now = datetime.now()
        day_name = now.strftime('%A').lower()
        current_seconds = now.hour * 3600 + now.minute * 60 + now.second
        
        if day_name not in schedule.sessions:
            return None
        
        for session in schedule.sessions[day_name]:
            start_time = session.get('start_time')
            end_time = session.get('end_time')
            
            if start_time and end_time:
                start_seconds = self._time_to_seconds(start_time)
                end_seconds = self._time_to_seconds(end_time)
                
                if end_seconds <= start_seconds:
                    end_seconds += 24 * 3600
                
                if start_seconds <= current_seconds <= end_seconds:
                    return session
        return None
    
    def _should_start_recording(self, session: Dict) -> bool:
        now = datetime.now()
        current_seconds = now.hour * 3600 + now.minute * 60 + now.second
        start_seconds = self._time_to_seconds(session.get('start_time', '00:00'))
        
        return current_seconds >= start_seconds
    
    def _should_stop_recording(self, session: Dict) -> bool:
        now = datetime.now()
        current_seconds = now.hour * 3600 + now.minute * 60 + now.second
        end_seconds = self._time_to_seconds(session.get('end_time', '23:59'))
        
        return current_seconds >= end_seconds
    
    async def start(self):
        logger.info("Starting Enhanced Station Recording Service")
        db = get_database()
        try:
            db_session = await db.__anext__()
            stations = await self._get_active_stations(db_session)
            logger.info(f"Found {len(stations)} active stations")
            for station in stations:
                await self._start_station_task(station)
        finally:
            await db.aclose()
    
    async def stop(self):
        logger.info("Stopping Enhanced Recording Service - Saving all active recordings")
        
        for recording_key in list(self.recording_processes.keys()):
            logger.info(f"Saving recording: {recording_key}")
            db = get_database()
            try:
                db_session = await db.__anext__()
                await self._stop_session_recording(db_session, recording_key)
            except Exception as e:
                logger.error(f"Error saving recording {recording_key}: {str(e)}")
            finally:
                await db.aclose()
        
        for station_id, task in self.station_tasks.items():
            logger.info(f"Cancelling station task: {station_id}")
            task.cancel()
            try:
                await task
            except asyncio.CancelledError:
                pass
        
        self.station_tasks.clear()
        logger.info("Enhanced Recording Service stopped - All recordings saved")
    
    async def _get_active_stations(self, db: AsyncSession) -> List[Station]:
        result = await db.execute(
            select(Station).where(and_(Station.status == True, Station.state == True))
        )
        return result.scalars().all()
    
    async def _start_station_task(self, station: Station):
        if station.id in self.station_tasks:
            self.station_tasks[station.id].cancel()
        
        task = asyncio.create_task(self._station_recording_loop(station.id))
        self.station_tasks[station.id] = task
        logger.info(f"Started recording task for: {station.name}")
    
    async def _station_recording_loop(self, station_id: str):
        logger.info(f"Recording loop started for station: {station_id}")
        
        while True:
            try:
                db = get_database()
                try:
                    db_session = await db.__anext__()
                    station = await self._get_station(db_session, station_id)
                    if not station:
                        logger.warning(f"Station {station_id} not found, stopping loop")
                        break
                    
                    schedule = await self._get_station_schedule(db_session, station_id)
                    if not schedule:
                        await asyncio.sleep(self.check_interval)
                        continue
                    
                    current_session = self._get_current_session(schedule)
                    if current_session:
                        session_date = datetime.now().strftime('%Y%m%d')
                        recording_key = f"{station_id}_{session_date}_{current_session['start_time'].replace(':', '')}"
                        
                        if (self._should_start_recording(current_session) and 
                            recording_key not in self.recording_processes):
                            logger.info(f"Starting recording for session: {current_session['start_time']}-{current_session['end_time']}")
                            await self._start_session_recording(db_session, station, current_session, recording_key)
                        
                        if (recording_key in self.recording_processes and 
                            self._should_stop_recording(current_session)):
                            logger.info(f"Stopping recording for session: {current_session['start_time']}-{current_session['end_time']}")
                            await self._stop_session_recording(db_session, recording_key)
                            
                            await asyncio.sleep(30)
                
                finally:
                    await db.aclose()
                    
                await asyncio.sleep(self.check_interval)
                
            except asyncio.CancelledError:
                logger.info(f"Station {station_id} task cancelled")
                await self._save_station_recordings_on_shutdown(station_id)
                break
            except Exception as e:
                logger.error(f"Error in station {station_id} loop: {str(e)}")
                await asyncio.sleep(self.check_interval)
    
    async def _get_station(self, db: AsyncSession, station_id: str) -> Optional[Station]:
        result = await db.execute(select(Station).where(Station.id == station_id))
        return result.scalar_one_or_none()
    
    async def _get_station_schedule(self, db: AsyncSession, station_id: str) -> Optional[StationSchedule]:
        result = await db.execute(
            select(StationSchedule).where(
                and_(StationSchedule.station_id == station_id, StationSchedule.state == True)
            )
        )
        return result.scalar_one_or_none()
    
    async def _get_program(self, db: AsyncSession, program_id: str) -> Optional[RadioProgram]:
        if not program_id:
            return None
        result = await db.execute(select(RadioProgram).where(RadioProgram.id == program_id))
        return result.scalar_one_or_none()
    
    async def _generate_filename(self, station: Station, program: Optional[RadioProgram], session: Dict) -> str:
        station_name = station.name.replace(' ', '_').replace('-', '_').lower()
        program_name = program.title.replace(' ', '_').replace('-', '_').lower() if program else 'unknown_program'
        date_str = datetime.now().strftime('%Y%m%d')
        start_time = session.get('start_time', '0000').replace(':', '')
        
        return f"{station_name}_{program_name}_{date_str}_{start_time}.{self.recording_format}"
    
    async def _start_session_recording(self, db: AsyncSession, station: Station, session: Dict, recording_key: str):
        try:
            program = await self._get_program(db, session.get('program_id'))
            filename = await self._generate_filename(station, program, session)
            file_path = os.path.join(self.base_recording_path, filename)
            
            recording_entry = await self._create_recording_entry(db, station, session, file_path)
            logger.info(f"Created recording entry: {recording_entry.id}")
            
            process = await self._start_ffmpeg_recording(station.streaming_link, file_path)
            if process:
                self.recording_processes[recording_key] = {
                    'process': process,
                    'recording_id': recording_entry.id,
                    'file_path': file_path,
                    'start_time': datetime.now(),
                    'session': session
                }
                logger.info(f"Recording started: {station.name} - {filename} (PID: {process.pid})")
            else:
                recording_entry.recording_status = 'failed'
                recording_entry.error_message = 'Failed to start FFmpeg process'
                recording_entry.actual_end_time = datetime.now()
                await db.commit()
                logger.error(f"Failed to start FFmpeg for {station.name}")
            
        except Exception as e:
            logger.error(f"Failed to start recording for {station.name}: {str(e)}")
    
    async def _create_recording_entry(self, db: AsyncSession, station: Station, session: Dict, file_path: str) -> RadioSessionRecording:
        now = datetime.now()
        session_date = now.date()
        
        start_time_str = session.get('start_time', '00:00')
        end_time_str = session.get('end_time', '23:59')
        
        start_time = datetime.combine(session_date, datetime.strptime(start_time_str, '%H:%M').time())
        end_time = datetime.combine(session_date, datetime.strptime(end_time_str, '%H:%M').time())
        
        if end_time <= start_time:
            end_time += timedelta(days=1)
        
        recording = RadioSessionRecording(
            station_id=station.id,
            program_id=session.get('program_id'),
            session_date=session_date,
            day_of_week=now.strftime('%A').lower(),
            scheduled_start_time=start_time,
            scheduled_end_time=end_time,
            actual_start_time=now,
            recording_status='recording',
            stream_url=station.streaming_link,
            recording_file_path=file_path,
            audio_format=self.recording_format,
            audio_quality='128kbps',
            studio=session.get('studio', 'A'),
            hosts=session.get('hosts', []),
            session_notes=session.get('notes', ''),
            is_live_session=session.get('is_live', True),
            is_repeat_session=session.get('is_repeat', False),
            status=True,
            state=True
        )
        
        db.add(recording)
        await db.commit()
        await db.refresh(recording)
        return recording
    
    async def _start_ffmpeg_recording(self, stream_url: str, output_path: str) -> Optional[subprocess.Popen]:
        try:
            ffmpeg_cmd = [
                'ffmpeg',
                '-i', stream_url,
                '-reconnect', '1',
                '-reconnect_streamed', '1',
                '-reconnect_delay_max', '30',
                '-timeout', '30000000',
                '-acodec', 'libmp3lame',
                '-ab', '128k',
                '-ar', '44100',
                '-ac', '2',
                '-y',
                '-loglevel', 'warning',
                output_path
            ]
            
            process_kwargs = self._get_process_creation_kwargs()
            logger.info(f"Starting FFmpeg on {self.platform_system}")
            
            process = subprocess.Popen(ffmpeg_cmd, **process_kwargs)
            
            await asyncio.sleep(3)
            if process.poll() is None:
                logger.info(f"FFmpeg started successfully (PID: {process.pid})")
                return process
            else:
                stderr_output = process.stderr.read().decode() if process.stderr else "Unknown error"
                logger.error(f"FFmpeg failed: {stderr_output}")
                return None
            
        except FileNotFoundError:
            logger.error("FFmpeg not found - Please install FFmpeg")
            return None
        except Exception as e:
            logger.error(f"FFmpeg start error: {str(e)}")
            return None
    
    async def _stop_session_recording(self, db: AsyncSession, recording_key: str):
        if recording_key not in self.recording_processes:
            return
        
        recording_data = self.recording_processes[recording_key]
        process = recording_data['process']
        
        logger.info(f"Stopping recording: {recording_key}")
        
        try:
            self._terminate_process(process)
            
            await asyncio.wait_for(
                asyncio.create_task(asyncio.to_thread(process.wait)), 
                timeout=15
            )
        except asyncio.TimeoutError:
            logger.warning("Force killing FFmpeg process")
            self._force_kill_process(process)
            try:
                process.wait()
            except:
                pass
        except Exception as e:
            logger.error(f"Error stopping process: {str(e)}")
            self._force_kill_process(process)
        
        await self._finalize_recording(db, recording_data)
        del self.recording_processes[recording_key]
    
    async def _finalize_recording(self, db: AsyncSession, recording_data: Dict):
        try:
            recording_id = recording_data['recording_id']
            file_path = recording_data['file_path']
            actual_start_time = recording_data['start_time']
            
            result = await db.execute(
                select(RadioSessionRecording).where(RadioSessionRecording.id == recording_id)
            )
            recording = result.scalar_one_or_none()
            
            if not recording:
                logger.error(f"Recording entry not found: {recording_id}")
                return
            
            actual_end_time = datetime.now()
            actual_duration_minutes = (actual_end_time - actual_start_time).total_seconds() / 60
            
            if os.path.exists(file_path) and os.path.getsize(file_path) > 0:
                file_size_mb = os.path.getsize(file_path) / (1024 * 1024)
                
                try:
                    original_filename = os.path.basename(file_path)
                    
                    with open(file_path, 'rb') as f:
                        file_content = f.read()
                    
                    file_obj = io.BytesIO(file_content)
                    upload_file = UploadFile(
                        file=file_obj,
                        filename=original_filename,
                        headers={"content-type": "audio/mpeg"}
                    )
                    
                    file_path_saved, file_url = await save_upload_file(upload_file, "recordings/sessions")
                    
                    recording.recording_status = 'completed'
                    recording.actual_end_time = actual_end_time
                    recording.recording_file_path = file_path_saved
                    recording.recording_file_url = file_url
                    recording.file_size_mb = round(file_size_mb, 2)
                    recording.duration_minutes = round(actual_duration_minutes, 1)
                    
                    os.remove(file_path)
                    logger.info(f"Recording saved: {original_filename} ({file_size_mb:.2f}MB, {actual_duration_minutes:.1f}min)")
                    
                except Exception as save_error:
                    logger.error(f"Save failed: {str(save_error)}")
                    recording.recording_status = 'failed'
                    recording.error_message = f'File save error: {str(save_error)}'
                    recording.actual_end_time = actual_end_time
                    recording.duration_minutes = round(actual_duration_minutes, 1)
            else:
                logger.warning(f"Recording file missing or empty: {file_path}")
                recording.recording_status = 'failed'
                recording.error_message = 'Recording file not found or empty'
                recording.actual_end_time = actual_end_time
                recording.duration_minutes = round(actual_duration_minutes, 1)
            
            await db.commit()
            logger.info(f"Recording finalized: {recording.recording_status} ({recording.duration_minutes}min)")
            
        except Exception as e:
            logger.error(f"Finalization error: {str(e)}")
            try:
                await db.rollback()
            except:
                pass
    
    async def _save_station_recordings_on_shutdown(self, station_id: str):
        station_recordings = [k for k in self.recording_processes.keys() if k.startswith(station_id)]
        
        for recording_key in station_recordings:
            try:
                logger.info(f"Shutdown save: {recording_key}")
                db = get_database()
                try:
                    db_session = await db.__anext__()
                    await self._stop_session_recording(db_session, recording_key)
                finally:
                    await db.aclose()
            except Exception as e:
                logger.error(f"Shutdown save error {recording_key}: {str(e)}")
    
    def get_service_status(self) -> Dict[str, Any]:
        return {
            "service_running": len(self.station_tasks) > 0,
            "platform": self.platform_system,
            "total_stations": len(self.station_tasks),
            "active_recordings": len(self.recording_processes),
            "stations": {
                station_id: {
                    "task_running": not task.done() if hasattr(task, 'done') else True,
                    "recordings": [k for k in self.recording_processes.keys() if k.startswith(station_id)]
                }
                for station_id, task in self.station_tasks.items()
            }
        }
    
    def get_health_check(self) -> Dict[str, Any]:
        dead_tasks = sum(1 for task in self.station_tasks.values() if hasattr(task, 'done') and task.done())
        return {
            "healthy": len(self.station_tasks) > 0 and dead_tasks == 0,
            "platform": self.platform_system,
            "total_stations": len(self.station_tasks),
            "dead_tasks": dead_tasks,
            "active_recordings": len(self.recording_processes),
            "check_interval": self.check_interval
        }

recording_service = EnhancedStationRecordingService()