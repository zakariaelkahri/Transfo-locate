from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models.user import User, RoleEnum, UserStatus

USERS_DATA = [
    ("admin", "admin@123", RoleEnum.ADMIN, UserStatus.ACTIVE),
    ("john_doe", "password123", RoleEnum.USER, UserStatus.ACTIVE),
    ("jane_smith", "password123", RoleEnum.USER, UserStatus.ACTIVE),
    ("bob_martin", "password123", RoleEnum.USER, UserStatus.INACTIVE),
    ("alice_dupont", "password123", RoleEnum.USER, UserStatus.SUSPENDED),
]


def seed_users():
    db = SessionLocal()
    try:
        for username, password, role, status in USERS_DATA:
            exists = db.query(User).filter(User.username == username).first()
            if not exists:
                db.add(User(
                    username=username,
                    password=get_password_hash(password),
                    role=role,
                    status=status,
                ))
        db.commit()
        print(f"Seeded {len(USERS_DATA)} users.")
    finally:
        db.close()
