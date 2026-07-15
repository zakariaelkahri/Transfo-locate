from fastapi import FastAPI
from app.api import health
from contextlib import asynccontextmanager
from app.core.database import init_db
from app.core.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Initializing database...")
    init_db()
    print("Database initialized successfully!")

    yield

    print("Shutting down application...")


app = FastAPI(
    title=settings.app_name,
    lifespan=lifespan,
)

app.include_router(health.router)
