import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import UserProfile

# List of profiles to add
profiles = [
    {"name": "Yash Chauhan", "email": "admin@okdriver.in", "phone": "+91-9876543210", "password": "admin"},
    {"name": "Rajesh Kumar", "email": "rajesh.rto@gujarat.gov.in", "phone": "+91-8888888888", "password": "admin"},
    {"name": "Meera Patel", "email": "meera.police@ahmedabad.gov.in", "phone": "+91-7777777777", "password": "admin"},
    {"name": "Surya Dev", "email": "surya.highway@nhai.org", "phone": "+91-9999999999", "password": "admin"}
]

for p in profiles:
    if not UserProfile.objects.filter(email=p["email"]).exists():
        UserProfile.objects.create(
            name=p["name"],
            email=p["email"],
            phone=p["phone"],
            password=p["password"]
        )
        print(f"Created Django UserProfile: {p['name']}")
    else:
        print(f"UserProfile {p['name']} already exists.")

print("Django UserProfiles added successfully!")
