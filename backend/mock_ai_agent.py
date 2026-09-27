import time
import random
import requests
from datetime import datetime

API_URL = "http://localhost:8000/api"

# Sample data
CAMERAS = [
    {
        "id": "C001",
        "name": "Traffic Junction Alpha",
        "department": "Traffic Police",
        "latitude": 23.0225,
        "longitude": 72.5714, # Ahmedabad coordinates
        "camera_type": "PTZ",
        "source_protocol": "RTSP",
        "stream_url": "http://sample.vodobox.com/skate_phantom_flex_4k/skate_phantom_flex_4k.m3u8",
        "zone": "North"
    },
    {
        "id": "C002",
        "name": "RTO Checkpoint",
        "department": "RTO",
        "latitude": 23.0335,
        "longitude": 72.5814,
        "camera_type": "Fixed",
        "source_protocol": "RTSP",
        "stream_url": "http://sample.vodobox.com/skate_phantom_flex_4k/skate_phantom_flex_4k.m3u8",
        "zone": "South"
    }
]

WATCHLIST = [
    {
        "entity_type": "Vehicle",
        "identifier": "GJ01XX0001",
        "reason": "Stolen Vehicle"
    },
    {
        "entity_type": "Vehicle",
        "identifier": "DL01YY9999",
        "reason": "Wanted for Hit and Run"
    }
]

NORMAL_VEHICLES = ["GJ01AB1234", "MH02CD5678", "KA03EF9012", "TS04GH3456", "GJ27XY7777"]

def setup_db():
    print("Setting up initial data...")
    # Add cameras
    for cam in CAMERAS:
        requests.post(f"{API_URL}/cameras", json=cam)
    
    # Add watchlist
    for wl in WATCHLIST:
        requests.post(f"{API_URL}/watchlist", json=wl)

def simulate_events():
    print("Starting AI Event Simulation...")
    while True:
        # 10% chance to generate an alert (watchlist match)
        is_alert = random.random() < 0.1
        
        if is_alert:
            vehicle = random.choice(WATCHLIST)["identifier"]
        else:
            vehicle = random.choice(NORMAL_VEHICLES)
            
        camera = random.choice(CAMERAS)["id"]
        
        event_payload = {
            "camera_id": camera,
            "event_type": "ANPR",
            "entity_value": vehicle,
            "confidence": round(random.uniform(0.85, 0.99), 2),
            "bounding_box": "[100, 200, 150, 250]"
        }
        
        try:
            res = requests.post(f"{API_URL}/events", json=event_payload)
            print(f"Generated Event: {vehicle} at {camera} - Alert: {is_alert}")
        except Exception as e:
            print("Failed to connect to API:", e)
            
        time.sleep(random.uniform(2, 5))

if __name__ == "__main__":
    time.sleep(2) # Give backend time to start
    setup_db()
    simulate_events()
