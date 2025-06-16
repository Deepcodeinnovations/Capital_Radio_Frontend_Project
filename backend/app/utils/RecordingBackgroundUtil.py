import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, Any
from app.database import get_database
from app.apiv1.services.admin.AdminRecordingBackgroundService import recording_scheduler
logger = logging.getLogger(__name__)


class RecordingBackgroundService:
    def __init__(self):
        self.is_running = False
        self.task = None
        self.check_interval = 30  # Check every 30 seconds
        self.daily_generation_hour = 1  # Generate daily recordings at 1 AM
        self.last_daily_generation = None
        self.cleanup_interval = 300  # Clean up every 5 minutes
        self.last_cleanup = None
        self.stats = {
            'total_recordings_started': 0,
            'total_recordings_stopped': 0,
            'total_recordings_failed': 0,
            'total_recordings_generated': 0,
            'service_start_time': None,
            'last_activity': None
        }
        
    async def start(self):
        if self.is_running:
            logger.warning("Recording service is already running")
            return
        
        self.is_running = True
        self.stats['service_start_time'] = datetime.now()
        self.task = asyncio.create_task(self._recording_loop())
        logger.info("Recording background service started")
    
    async def stop(self):
        if not self.is_running:
            return
        
        self.is_running = False
        if self.task:
            self.task.cancel()
            try:
                await self.task
            except asyncio.CancelledError:
                pass
        
        # Stop any active recordings gracefully
        try:
            async with get_database() as db:
                for recording_id in list(recording_scheduler.recording_processes.keys()):
                    logger.info(f"Stopping active recording {recording_id} during shutdown")
                    await recording_scheduler.stop_recording(db, recording_id)
        except Exception as e:
            logger.error(f"Error stopping active recordings during shutdown: {str(e)}")
        
        logger.info("Recording background service stopped")
    



    def get_stats(self):
        return self.stats
    
    async def _recording_loop(self):
        logger.info("Starting recording management loop")
        
        while self.is_running:
            try:
                async with get_database() as db:
                    # Check if we need to generate daily recordings
                    await self._check_daily_generation(db)
                    
                    # Manage active recordings (start/stop)
                    stats = await recording_scheduler.check_and_manage_recordings(db)
                    
                    # Update service stats
                    self.stats['total_recordings_started'] += stats['started']
                    self.stats['total_recordings_stopped'] += stats['stopped']
                    self.stats['total_recordings_failed'] += stats['failed']
                    
                    if stats['started'] > 0 or stats['stopped'] > 0 or stats['failed'] > 0:
                        self.stats['last_activity'] = datetime.now()
                        logger.info(f"Recording cycle stats: started={stats['started']}, stopped={stats['stopped']}, failed={stats['failed']}")
                    
                    # Periodic cleanup
                    await self._check_cleanup(db)
                
                # Wait before next check
                await asyncio.sleep(self.check_interval)
                
            except asyncio.CancelledError:
                logger.info("Recording loop cancelled")
                break
            except Exception as e:
                logger.error(f"Error in recording loop: {str(e)}")
                await asyncio.sleep(self.check_interval)
    


    async def _check_daily_generation(self, db):
        now = datetime.now()
        
        should_generate = (
            self.last_daily_generation is None or 
            (now.hour >= self.daily_generation_hour and 
             (self.last_daily_generation is None or 
              self.last_daily_generation.date() < now.date()))
        )
        
        if should_generate:
            try:
                logger.info("Starting daily recording generation")
                
                # Generate recordings for today
                today_recordings = await recording_scheduler.generate_daily_recordings(db, now)
                
                # Generate recordings for tomorrow
                tomorrow = now + timedelta(days=1)
                tomorrow_recordings = await recording_scheduler.generate_daily_recordings(db, tomorrow)
                
                total_generated = len(today_recordings) + len(tomorrow_recordings)
                self.stats['total_recordings_generated'] += total_generated
                
                if total_generated > 0:
                    logger.info(f"Generated {total_generated} recordings (today: {len(today_recordings)}, tomorrow: {len(tomorrow_recordings)})")
                    self.stats['last_activity'] = datetime.now()
                else:
                    logger.info("No new recordings generated - all sessions already scheduled")
                
                self.last_daily_generation = now
                
            except Exception as e:
                logger.error(f"Error generating daily recordings: {str(e)}")
    



    async def _check_cleanup(self, db):
        now = datetime.now()
        
        should_cleanup = (
            self.last_cleanup is None or 
            (now - self.last_cleanup).total_seconds() >= self.cleanup_interval
        )
        
        if should_cleanup:
            try:
                # Clean up failed recordings
                cleaned = await recording_scheduler.cleanup_failed_recordings(db)
                if cleaned > 0:
                    logger.info(f"Cleaned up {cleaned} failed recordings")
                    self.stats['last_activity'] = datetime.now()
                
                # Additional cleanup tasks
                await self._cleanup_old_files()
                await self._check_disk_space()
                
                self.last_cleanup = now
                
            except Exception as e:
                logger.error(f"Error during cleanup: {str(e)}")
    



    async def _cleanup_old_files(self):
        try:
            import os
            from pathlib import Path
            
            cleanup_days = int(os.getenv("RECORDING_CLEANUP_DAYS", "30"))
            if cleanup_days <= 0:
                return  # Cleanup disabled
            
            base_path = Path(recording_scheduler.base_recording_path)
            if not base_path.exists():
                return
            
            cutoff_date = datetime.now() - timedelta(days=cleanup_days)
            cleaned_files = 0
            
            for file_path in base_path.rglob("*.mp3"):
                if file_path.is_file():
                    file_modified = datetime.fromtimestamp(file_path.stat().st_mtime)
                    if file_modified < cutoff_date:
                        try:
                            file_path.unlink()
                            cleaned_files += 1
                        except Exception as e:
                            logger.warning(f"Failed to delete old file {file_path}: {str(e)}")
            
            if cleaned_files > 0:
                logger.info(f"Cleaned up {cleaned_files} old recording files")
                
        except Exception as e:
            logger.error(f"Error cleaning up old files: {str(e)}")
    




    async def _check_disk_space(self):
        try:
            import shutil
            
            total, used, free = shutil.disk_usage(recording_scheduler.base_recording_path)
            free_gb = free // (1024**3)
            total_gb = total // (1024**3)
            
            free_percentage = (free / total) * 100
            
            # Warn if less than 10% free space or less than 5GB
            if free_percentage < 10 or free_gb < 5:
                logger.warning(f"Low disk space: {free_gb}GB free ({free_percentage:.1f}%) on recording drive")
            
        except Exception as e:
            logger.warning(f"Could not check disk space: {str(e)}")
    

    
    def get_status(self) -> Dict[str, Any]:
        uptime_seconds = 0
        if self.stats['service_start_time']:
            uptime_seconds = (datetime.now() - self.stats['service_start_time']).total_seconds()
        
        return {
            "is_running": self.is_running,
            "check_interval": self.check_interval,
            "daily_generation_hour": self.daily_generation_hour,
            "last_daily_generation": self.last_daily_generation.isoformat() if self.last_daily_generation else None,
            "last_cleanup": self.last_cleanup.isoformat() if self.last_cleanup else None,
            "last_activity": self.stats['last_activity'].isoformat() if self.stats['last_activity'] else None,
            "active_recordings": len(recording_scheduler.recording_processes),
            "active_recording_ids": list(recording_scheduler.recording_processes.keys()),
            "uptime_seconds": int(uptime_seconds),
            "uptime_formatted": self._format_uptime(uptime_seconds),
            "stats": {
                "total_recordings_started": self.stats['total_recordings_started'],
                "total_recordings_stopped": self.stats['total_recordings_stopped'],
                "total_recordings_failed": self.stats['total_recordings_failed'],
                "total_recordings_generated": self.stats['total_recordings_generated'],
                "success_rate": self._calculate_success_rate()
            }
        }
    


    def _format_uptime(self, seconds: float) -> str:
        if seconds < 60:
            return f"{int(seconds)} seconds"
        elif seconds < 3600:
            return f"{int(seconds / 60)} minutes"
        elif seconds < 86400:
            hours = int(seconds / 3600)
            minutes = int((seconds % 3600) / 60)
            return f"{hours}h {minutes}m"
        else:
            days = int(seconds / 86400)
            hours = int((seconds % 86400) / 3600)
            return f"{days}d {hours}h"
    


    def _calculate_success_rate(self) -> float:
        total = self.stats['total_recordings_started']
        if total == 0:
            return 0.0
        
        successful = self.stats['total_recordings_stopped']
        return round((successful / total) * 100, 1)
    




    async def force_daily_generation(self, db):
        try:
            now = datetime.now()
            today_recordings = await recording_scheduler.generate_daily_recordings(db, now)
            tomorrow = now + timedelta(days=1)
            tomorrow_recordings = await recording_scheduler.generate_daily_recordings(db, tomorrow)
            
            total_generated = len(today_recordings) + len(tomorrow_recordings)
            self.stats['total_recordings_generated'] += total_generated
            
            self.last_daily_generation = now
            
            logger.info(f"Forced generation: {total_generated} recordings created")
            return total_generated
            
        except Exception as e:
            logger.error(f"Error in forced daily generation: {str(e)}")
            raise
    

    

    async def emergency_stop_all_recordings(self, db):
        try:
            stopped_count = 0
            for recording_id in list(recording_scheduler.recording_processes.keys()):
                if await recording_scheduler.stop_recording(db, recording_id):
                    stopped_count += 1
            
            logger.warning(f"Emergency stop: {stopped_count} recordings stopped")
            return stopped_count
            
        except Exception as e:
            logger.error(f"Error in emergency stop: {str(e)}")
            raise



recording_service = RecordingBackgroundService()

