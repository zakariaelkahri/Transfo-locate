from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import health, stock
from app.core.config import settings


app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://172.19.80.1:2003", "http://localhost:2003", "https://localhost"],
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)
app.include_router(health.router)
app.include_router(stock.router)
