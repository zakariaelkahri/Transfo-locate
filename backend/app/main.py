from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import health, stock, auth
from app.core.config import settings
from contextlib import asynccontextmanager
from app.core.database import init_db
from app.seeders.user_seeder import seed_users


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Initializing database...")
    init_db()
    seed_users()
    print("Database initialized successfully!")

    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://localhost"],
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
)


app.include_router(health.router)
app.include_router(stock.router)
app.include_router(auth.router)
