import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))

from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Watchlist, Base

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# Delete existing to prevent duplicates if any, or just add new ones
db.query(Watchlist).delete()

watchlist_data = [
    # Vehicles
    {"entity_type": "Vehicle", "identifier": "GJ01XX0001", "reason": "Armed Robbery Suspect Vehicle"},
    {"entity_type": "Vehicle", "identifier": "MH02CD9999", "reason": "Stolen Vehicle - Interpol Alert"},
    {"entity_type": "Vehicle", "identifier": "DL04EF1234", "reason": "Unpaid Challans > 50,000"},
    {"entity_type": "Vehicle", "identifier": "RJ14XY7777", "reason": "Fleeing from Accident Scene"},
    {"entity_type": "Vehicle", "identifier": "KA01AB8888", "reason": "Suspected Smuggling Operations"},
    {"entity_type": "Vehicle", "identifier": "UP16KL5555", "reason": "Amber Alert - Kidnapping"},
    
    # Persons
    {"entity_type": "Person", "identifier": "John Doe - ID:8392", "reason": "Wanted for Questioning - Case #402"},
    {"entity_type": "Person", "identifier": "Jane Smith - ID:1192", "reason": "Missing Person Alert"},
    {"entity_type": "Person", "identifier": "Unknown Male - Red Cap", "reason": "Vandalism near Station"},
    {"entity_type": "Person", "identifier": "Suspect Beta", "reason": "Pickpocketing Ring Leader"}
]

for item in watchlist_data:
    db.add(Watchlist(**item))

db.commit()
db.close()
print("Watchlist beautifully populated!")
