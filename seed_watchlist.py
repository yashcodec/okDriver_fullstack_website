import sys
import os

# Add backend directory to sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))

from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Watchlist, Base
import datetime

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# List of new watchlist entities
new_items = [
    Watchlist(entity_type="Vehicle", identifier="MH02AB1234", reason="Stolen Vehicle - FIR 102/2026", added_at=datetime.datetime.utcnow() - datetime.timedelta(days=2)),
    Watchlist(entity_type="Vehicle", identifier="DL14CC9999", reason="Suspicious Activity - Intel Report", added_at=datetime.datetime.utcnow() - datetime.timedelta(days=5)),
    Watchlist(entity_type="Vehicle", identifier="KA05EE5555", reason="Wanted for Hit & Run", added_at=datetime.datetime.utcnow() - datetime.timedelta(days=1)),
    Watchlist(entity_type="Vehicle", identifier="RJ14QW4321", reason="Multiple Unpaid Tolls & Violations", added_at=datetime.datetime.utcnow() - datetime.timedelta(hours=12)),
    Watchlist(entity_type="Vehicle", identifier="GJ01AB9876", reason="Blacklisted by RTO (No Insurance)", added_at=datetime.datetime.utcnow() - datetime.timedelta(days=10)),
    Watchlist(entity_type="Person", identifier="P-98124", reason="Missing Person (Child Alert)", added_at=datetime.datetime.utcnow() - datetime.timedelta(hours=4)),
    Watchlist(entity_type="Person", identifier="P-11234", reason="Wanted Suspect - Bank Robbery", added_at=datetime.datetime.utcnow() - datetime.timedelta(days=7)),
]

# Avoid duplicates
for item in new_items:
    exists = db.query(Watchlist).filter(Watchlist.identifier == item.identifier).first()
    if not exists:
        db.add(item)

db.commit()
db.close()
print("Watchlist successfully populated with more items!")
