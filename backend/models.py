from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    password = Column(String)

    cameras = relationship("Camera", back_populates="owner")

class Camera(Base):
    __tablename__ = "cameras"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    department = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    camera_type = Column(String)
    source_protocol = Column(String)
    stream_url = Column(String)
    status = Column(String, default="Online") # Online, Offline, Degraded
    last_heartbeat = Column(DateTime, default=func.now())
    zone = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    resolution = Column(String, default="1080p 30fps")

    events = relationship("DetectionEvent", back_populates="camera")
    owner = relationship("User", back_populates="cameras")

class Watchlist(Base):
    __tablename__ = "watchlist"

    id = Column(Integer, primary_key=True, index=True)
    entity_type = Column(String) # e.g., 'Vehicle', 'Person'
    identifier = Column(String, unique=True, index=True) # e.g., License plate number
    reason = Column(String)
    added_at = Column(DateTime, default=func.now())

class DetectionEvent(Base):
    __tablename__ = "detection_events"

    id = Column(Integer, primary_key=True, index=True)
    camera_id = Column(String, ForeignKey("cameras.id"))
    timestamp = Column(DateTime, default=func.now())
    event_type = Column(String) # e.g., 'ANPR', 'Person Detection'
    entity_value = Column(String) # e.g., 'GJ01XX1234'
    confidence = Column(Float)
    bounding_box = Column(String) # Stored as JSON string
    is_alert = Column(Boolean, default=False)
    status = Column(String, default="ACTIVE") # ACTIVE, ACKNOWLEDGED, RESOLVED
    
    camera = relationship("Camera", back_populates="events")
