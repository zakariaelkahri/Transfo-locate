from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

class LoginRequest(BaseModel):
    username: str = Field(..., min_length=5, max_length=50)
    password: str = Field(..., min_length=8)


class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=5, max_length=50)
    password: str = Field(..., min_length=8)


class UserResponse(BaseModel):

    id: uuid.UUID
    username: str
    role_name: str
    status: str

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):

    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse