import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))

from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Camera, Base
import datetime

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Clear existing cameras
db.query(Camera).delete()

cameras_data = [
    {"id": "C001", "name": "Traffic Junction (Ahmedabad)", "department": "Traffic Police", "zone": "Central Zone", "status": "Online", "source_protocol": "RTSP", "resolution": "1080p 60fps", "latitude": 23.0225, "longitude": 72.5714, "camera_type": "PTZ"},
    {"id": "C002", "name": "RTO Checkpoint", "department": "RTO", "zone": "North Zone", "status": "Online", "source_protocol": "ONVIF", "resolution": "1080p 30fps", "latitude": 23.0333, "longitude": 72.5833, "camera_type": "Fixed"},
    {"id": "C003", "name": "City Center", "department": "City Police", "zone": "West Zone", "status": "Degraded", "source_protocol": "WebRTC", "resolution": "720p 15fps", "latitude": 23.0111, "longitude": 72.5555, "camera_type": "PTZ"},
    {"id": "C004", "name": "Highway", "department": "Highway Police", "zone": "North-West Zone", "status": "Offline", "source_protocol": "RTSP", "resolution": "1080p (Disconnected)", "latitude": 23.0456, "longitude": 72.5678, "camera_type": "ANPR"},
    {"id": "C005", "name": "Railway Station", "department": "Railways", "zone": "East Zone", "status": "Online", "source_protocol": "HLS", "resolution": "1080p 25fps", "latitude": 23.0234, "longitude": 72.6012, "camera_type": "PTZ"},
    {"id": "C006", "name": "Surveillance Post C006", "department": "City Police", "zone": "South Zone", "status": "Online", "source_protocol": "RTSP", "resolution": "1080p 30fps", "latitude": 22.9999, "longitude": 72.5444, "camera_type": "Fixed"},
    {"id": "C007", "name": "Surveillance Post C007", "department": "RTO", "zone": "East Zone", "status": "Online", "source_protocol": "ONVIF", "resolution": "1080p 30fps", "latitude": 23.0222, "longitude": 72.6111, "camera_type": "Fixed"},
    {"id": "C008", "name": "Surveillance Post C008", "department": "Highway Police", "zone": "West Zone", "status": "Online", "source_protocol": "RTSP", "resolution": "1080p 30fps", "latitude": 23.0555, "longitude": 72.5333, "camera_type": "ANPR"},
    {"id": "C009", "name": "Surveillance Post C009", "department": "Railways", "zone": "Central Zone", "status": "Online", "source_protocol": "ONVIF", "resolution": "1080p 30fps", "latitude": 23.0250, "longitude": 72.5800, "camera_type": "Fixed"},
    {"id": "C010", "name": "Surveillance Post C010", "department": "Traffic Police", "zone": "North Zone", "status": "Online", "source_protocol": "RTSP", "resolution": "1080p 30fps", "latitude": 23.0600, "longitude": 72.5900, "camera_type": "PTZ"},
    {"id": "C011", "name": "Surveillance Post C011", "department": "City Police", "zone": "South Zone", "status": "Online", "source_protocol": "ONVIF", "resolution": "1080p 30fps", "latitude": 22.9800, "longitude": 72.5500, "camera_type": "Fixed"},
    {"id": "C012", "name": "Surveillance Post C012", "department": "RTO", "zone": "East Zone", "status": "Online", "source_protocol": "RTSP", "resolution": "1080p 30fps", "latitude": 23.0100, "longitude": 72.6200, "camera_type": "Fixed"},
]

for cam in cameras_data:
    db.add(Camera(**cam))

db.commit()
db.close()
print("Cameras successfully seeded!")
