import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine, Base
from app.models import User
from app.auth import hash_password

Base.metadata.create_all(bind=engine)

db = SessionLocal()
try:
    if len(sys.argv) >= 3:
        email = sys.argv[1].strip()
        password = sys.argv[2].strip()
    else:
        email = input("Admin email: ").strip()
        password = input("Admin password: ").strip()

    if not email or not password:
        print("Email and password are required.")
        sys.exit(1)

    existing = db.query(User).filter(User.email == email).first()
    if existing:
        print(f"User with email {email} already exists.")
        sys.exit(1)

    user = User(
        email=email,
        password_hash=hash_password(password),
        role="admin",
        is_active=True,
    )
    db.add(user)
    db.commit()
    print(f"Admin created: {email}")
finally:
    db.close()