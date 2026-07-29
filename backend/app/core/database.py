from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker, DeclarativeBase
from app.core.config import settings

DATABASE_URL = settings.DATABASE_URL

engine = create_engine(
    DATABASE_URL,
    echo=True,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

SessionLocal = sessionmaker(
    bind=engine,
    class_=Session,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    from app.models.user import User  # noqa: F401

    Base.metadata.create_all(bind=engine)
