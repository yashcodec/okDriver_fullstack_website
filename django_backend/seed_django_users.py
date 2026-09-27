import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User

# List of profiles to add
profiles = [
    {"username": "aryanjain", "email": "admin@okdriver.in", "first_name": "Aryan", "last_name": "Jain", "password": "admin"},
    {"username": "rajesh_rto", "email": "rajesh.rto@gujarat.gov.in", "first_name": "Rajesh", "last_name": "Kumar", "password": "admin"},
    {"username": "meera_police", "email": "meera.police@ahmedabad.gov.in", "first_name": "Meera", "last_name": "Patel", "password": "admin"},
    {"username": "surya_highway", "email": "surya.highway@nhai.org", "first_name": "Surya", "last_name": "Dev", "password": "admin"}
]

for p in profiles:
    if not User.objects.filter(username=p["username"]).exists():
        user = User.objects.create_user(
            username=p["username"],
            email=p["email"],
            password=p["password"],
            first_name=p["first_name"],
            last_name=p["last_name"]
        )
        # Make them staff so they can log into admin panel
        user.is_staff = True
        user.save()
        print(f"Created Django User: {p['username']}")
    else:
        print(f"User {p['username']} already exists.")

print("Django Profiles added successfully!")
