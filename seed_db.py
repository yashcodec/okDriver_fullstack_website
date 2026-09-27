import sys
import os

# Add backend directory to sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))

from sqlalchemy.orm import Session
from database import SessionLocal
from models import Camera, DetectionEvent
import datetime

db = SessionLocal()

# Clear existing cameras and events for clean trace
db.query(DetectionEvent).delete()
db.query(Camera).delete()
db.commit()

cams = [
    Camera(id="C001", name="Traffic Junction", department="Traffic Police", latitude=23.0225, longitude=72.5714, camera_type="Fixed", status="Online", zone="Zone 1"),
    Camera(id="C002", name="City Center", department="Traffic Police", latitude=23.0360, longitude=72.5715, camera_type="PTZ", status="Online", zone="Zone 1"),
    Camera(id="C003", name="Navrangpura Cross", department="Traffic Police", latitude=23.0450, longitude=72.5600, camera_type="Fixed", status="Degraded", zone="Zone 2"),
    Camera(id="C004", name="Ashram Road", department="Traffic Police", latitude=23.0550, longitude=72.5750, camera_type="Fixed", status="Offline", zone="Zone 2"),
    Camera(id="C005", name="RTO Checkpoint", department="RTO", latitude=23.0604, longitude=72.5800, camera_type="PTZ", status="Online", zone="Zone 3")
]
db.add_all(cams)
db.commit()

# Add a trace for vehicle GJ01XX0001
now = datetime.datetime.utcnow()
events = [
    DetectionEvent(camera_id="C001", timestamp=now - datetime.timedelta(minutes=40), event_type="ANPR", entity_value="GJ01XX0001", confidence=95.0, is_alert=True),
    DetectionEvent(camera_id="C002", timestamp=now - datetime.timedelta(minutes=30), event_type="ANPR", entity_value="GJ01XX0001", confidence=92.0, is_alert=True),
    DetectionEvent(camera_id="C003", timestamp=now - datetime.timedelta(minutes=20), event_type="ANPR", entity_value="GJ01XX0001", confidence=88.0, is_alert=True),
    DetectionEvent(camera_id="C004", timestamp=now - datetime.timedelta(minutes=10), event_type="ANPR", entity_value="GJ01XX0001", confidence=91.0, is_alert=True),
    DetectionEvent(camera_id="C005", timestamp=now, event_type="ANPR", entity_value="GJ01XX0001", confidence=98.0, is_alert=True)
]
db.add_all(events)
db.commit()

db.close()
print("Database seeded with 5 cameras and a 5-point trace!")
