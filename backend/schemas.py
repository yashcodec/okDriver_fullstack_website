from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: str
    phone: str
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    class Config:
        orm_mode = True

class CameraBase(BaseModel):
    id: str
    name: str
    department: str
    latitude: float
    longitude: float
    camera_type: str
    source_protocol: Optional[str] = None
    stream_url: Optional[str] = None
    status: Optional[str] = "Online"
    zone: str
    owner_id: Optional[int] = None
    resolution: Optional[str] = "1080p 30fps"

class CameraCreate(CameraBase):
    pass

class CameraResponse(CameraBase):
    last_heartbeat: Optional[datetime] = None

    class Config:
        orm_mode = True

class WatchlistBase(BaseModel):
    entity_type: str
    identifier: str
    reason: str

class WatchlistCreate(WatchlistBase):
    pass

class WatchlistResponse(WatchlistBase):
    id: int
    added_at: datetime

    class Config:
        orm_mode = True

class DetectionEventBase(BaseModel):
    camera_id: str
    event_type: str
    entity_value: str
    confidence: float
    bounding_box: Optional[str] = None
    status: Optional[str] = "ACTIVE"

class DetectionEventCreate(DetectionEventBase):
    pass

class DetectionEventResponse(DetectionEventBase):
    id: int
    timestamp: datetime
    is_alert: bool
    
    class Config:
        orm_mode = True
