import sys
import os
import sqlite3

# Using raw sqlite to ensure we don't need to mess with SQLAlchemy setup just for users
db_path = os.path.join(os.path.dirname(__file__), "backend", "okdriver.db")

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Ensure users table exists just in case
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR,
    email VARCHAR UNIQUE,
    phone VARCHAR,
    password VARCHAR
)
''')

# Clear old ones (optional) to keep it clean, but let's just add new ones
users_data = [
    ("Yash Chauhan", "admin@okdriver.in", "+91-9876543210", "admin123"),
    ("Rajesh Kumar", "rajesh.rto@gujarat.gov.in", "+91-8888888888", "pass123"),
    ("Meera Patel", "meera.police@ahmedabad.gov.in", "+91-7777777777", "police123"),
    ("Surya Dev", "surya.highway@nhai.org", "+91-9999999999", "highway123")
]

for u in users_data:
    try:
        cursor.execute('INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)', u)
    except sqlite3.IntegrityError:
        print(f"User {u[1]} already exists, skipping.")

conn.commit()
conn.close()

print("Profiles added successfully!")
