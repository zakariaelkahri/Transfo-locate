from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import health, stock
from contextlib import asynccontextmanager
from app.core.database import init_db
from app.core.config import settings
from app.seeders.stock_seeder import seed_stock
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Initializing database...")
    init_db()
    seed_stock()
    print("Database initialized successfully!")

    yield

    print("Shutting down application...")


app = FastAPI(
    title=settings.app_name,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://172.19.80.1:2003", "http://localhost:2003",],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(health.router)
app.include_router(stock.router)
