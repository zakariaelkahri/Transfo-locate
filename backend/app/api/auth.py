from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import verify_password, create_access_token
from app.core.auth import get_current_active_user
from app.core.config import settings
from app.models.user import User
from app.schemas.auth import LoginRequest, LoginResponse, UserResponse


router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/login", response_model=LoginResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):

    result = db.execute(
        select(User)
        .where(User.username == login_data.username))

    user = result.scalar_one_or_none()

    if not user or not verify_password(login_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "username": user.username},
        expires_delta=access_token_expires
    )

    user_response = UserResponse(
        id=user.id,
        username=user.username,
        role_name=user.role,
        status=user.status,
    )

    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=user_response
    )
