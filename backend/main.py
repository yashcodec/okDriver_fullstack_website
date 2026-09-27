import json
import logging
from fastapi import FastAPI, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

import models
import schemas
from database import SessionLocal, engine, get_db
from websocket_manager import manager
from sqladmin import Admin, ModelView

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="okDriver API")

# --- SQLADMIN SETUP (Django-like Admin) ---
admin = Admin(app, engine)

class UserAdmin(ModelView, model=models.User):
    column_list = [models.User.id, models.User.name, models.User.email, models.User.phone]
    icon = "fa-solid fa-user"

class CameraAdmin(ModelView, model=models.Camera):
    column_list = [models.Camera.id, models.Camera.name, models.Camera.department, models.Camera.status]
    icon = "fa-solid fa-camera"

class WatchlistAdmin(ModelView, model=models.Watchlist):
    column_list = [models.Watchlist.id, models.Watchlist.identifier, models.Watchlist.entity_type, models.Watchlist.reason]
    icon = "fa-solid fa-list"

class EventAdmin(ModelView, model=models.DetectionEvent):
    column_list = [models.DetectionEvent.id, models.DetectionEvent.camera_id, models.DetectionEvent.entity_value, models.DetectionEvent.is_alert, models.DetectionEvent.timestamp]
    icon = "fa-solid fa-bell"
    column_sortable_list = [models.DetectionEvent.timestamp]

admin.add_view(UserAdmin)
admin.add_view(CameraAdmin)
admin.add_view(WatchlistAdmin)
admin.add_view(EventAdmin)
# ------------------------------------------

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- AUTHENTICATION -----------------

@app.post("/api/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # In a real app, hash the password here
    new_user = models.User(
        name=user.name,
        email=user.email,
        phone=user.phone,
        password=user.password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/api/login")
def login_user(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or db_user.password != user.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return {
        "message": "Login successful",
        "user": {
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email,
            "phone": db_user.phone
        }
    }

@app.put("/api/users/{user_id}", response_model=schemas.UserResponse)
def update_user(user_id: int, user_update: schemas.UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user_update.name:
        db_user.name = user_update.name
    if user_update.email:
        db_user.email = user_update.email
    if user_update.phone:
        db_user.phone = user_update.phone
        
    db.commit()
    db.refresh(db_user)
    return db_user

# ----------------- CAMERAS -----------------

@app.post("/api/cameras", response_model=schemas.CameraResponse)
def create_camera(camera: schemas.CameraCreate, db: Session = Depends(get_db)):
    db_camera = db.query(models.Camera).filter(models.Camera.id == camera.id).first()
    if db_camera:
        raise HTTPException(status_code=400, detail="Camera ID already registered")
    
    db_camera = models.Camera(**camera.dict())
    db.add(db_camera)
    db.commit()
    db.refresh(db_camera)
    return db_camera

@app.get("/api/cameras", response_model=List[schemas.CameraResponse])
def get_cameras(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    cameras = db.query(models.Camera).offset(skip).limit(limit).all()
    return cameras

@app.get("/api/cameras/{camera_id}", response_model=schemas.CameraResponse)
def get_camera(camera_id: str, db: Session = Depends(get_db)):
    camera = db.query(models.Camera).filter(models.Camera.id == camera_id).first()
    if camera is None:
        raise HTTPException(status_code=404, detail="Camera not found")
    return camera

@app.delete("/api/cameras/{camera_id}")
def delete_camera(camera_id: str, db: Session = Depends(get_db)):
    camera = db.query(models.Camera).filter(models.Camera.id == camera_id).first()
    if camera is None:
        raise HTTPException(status_code=404, detail="Camera not found")
    db.delete(camera)
    db.commit()
    return {"success": True}

@app.patch("/api/cameras/{camera_id}", response_model=schemas.CameraResponse)
def update_camera(camera_id: str, camera_update: schemas.CameraCreate, db: Session = Depends(get_db)):
    camera = db.query(models.Camera).filter(models.Camera.id == camera_id).first()
    if camera is None:
        raise HTTPException(status_code=404, detail="Camera not found")
    
    update_data = camera_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(camera, key, value)
        
    db.commit()
    db.refresh(camera)
    return camera

# ----------------- WATCHLIST -----------------

@app.post("/api/watchlist", response_model=schemas.WatchlistResponse)
def create_watchlist_item(item: schemas.WatchlistCreate, db: Session = Depends(get_db)):
    db_item = db.query(models.Watchlist).filter(models.Watchlist.identifier == item.identifier).first()
    if db_item:
        raise HTTPException(status_code=400, detail="Identifier already in watchlist")
    
    db_item = models.Watchlist(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.get("/api/watchlist", response_model=List[schemas.WatchlistResponse])
def get_watchlist(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    items = db.query(models.Watchlist).offset(skip).limit(limit).all()
    return items

@app.delete("/api/watchlist/{item_id}")
def delete_watchlist(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.Watchlist).filter(models.Watchlist.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(db_item)
    db.commit()
    return {"success": True}

# ----------------- EVENTS & ANALYTICS -----------------

@app.get("/api/events/trace/{entity_value}")
def trace_entity(entity_value: str, db: Session = Depends(get_db)):
    events = db.query(models.DetectionEvent).filter(
        models.DetectionEvent.entity_value == entity_value
    ).order_by(models.DetectionEvent.timestamp.asc()).all()
    
    trace_data = []
    for e in events:
        cam = db.query(models.Camera).filter(models.Camera.id == e.camera_id).first()
        if cam:
            trace_data.append({
                "timestamp": e.timestamp.isoformat(),
                "camera_name": cam.name,
                "latitude": cam.latitude,
                "longitude": cam.longitude,
                "confidence": e.confidence
            })
    return trace_data

@app.post("/api/events", response_model=schemas.DetectionEventResponse)
async def create_event(event: schemas.DetectionEventCreate, db: Session = Depends(get_db)):
    # Validate Camera
    camera = db.query(models.Camera).filter(models.Camera.id == event.camera_id).first()
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")

    # Check Watchlist for Match
    watchlist_match = db.query(models.Watchlist).filter(
        models.Watchlist.identifier == event.entity_value
    ).first()

    is_alert = watchlist_match is not None

    db_event = models.DetectionEvent(
        **event.dict(),
        is_alert=is_alert
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)

    # Broadcast real-time if it's an alert or just generic event stream
    event_data = {
        "id": db_event.id,
        "camera_id": db_event.camera_id,
        "camera_name": camera.name,
        "timestamp": db_event.timestamp.isoformat(),
        "event_type": db_event.event_type,
        "entity_value": db_event.entity_value,
        "confidence": db_event.confidence,
        "is_alert": is_alert
    }
    
    if is_alert:
        event_data["watchlist_reason"] = watchlist_match.reason
        await manager.broadcast({"type": "ALERT", "data": event_data})
    else:
        await manager.broadcast({"type": "EVENT", "data": event_data})

    return db_event

@app.get("/api/events", response_model=List[schemas.DetectionEventResponse])
def get_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    events = db.query(models.DetectionEvent).order_by(models.DetectionEvent.timestamp.desc()).offset(skip).limit(limit).all()
    return events


# ----------------- WEBSOCKET -----------------

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # We don't necessarily expect data from clients, but we need to keep connection open
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.delete('/api/events/{event_id}')
def delete_event(event_id: int, db: Session = Depends(get_db)):
    db_event = db.query(models.DetectionEvent).filter(models.DetectionEvent.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail='Event not found')
    db.delete(db_event)
    db.commit()
    return {'success': True}

from pydantic import BaseModel
class StatusUpdate(BaseModel):
    status: str

@app.patch('/api/events/{event_id}/status')
async def update_event_status(event_id: int, status_update: StatusUpdate, db: Session = Depends(get_db)):
    db_event = db.query(models.DetectionEvent).filter(models.DetectionEvent.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail='Event not found')
    db_event.status = status_update.status
    db.commit()
    await manager.broadcast({"type": "ALERT_UPDATE", "data": {"id": event_id, "status": db_event.status}})
    return {"success": True, "status": db_event.status}

