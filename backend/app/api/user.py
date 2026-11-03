from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.user import AdminCreateUserRequest, AdminCreatedUserResponse, UserStatsResponse, UserListItem, DeleteUserRequest
from app.models.user import User, RoleEnum, UserStatus
from app.core.database import get_db
from app.core.auth import get_current_admin_user
from app.core.security import get_password_hash
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from typing import List


router = APIRouter(
    prefix="/api/user", tags=["Authentication"],
    dependencies=[Depends(get_current_admin_user)],
)


@router.get("/stats", response_model=UserStatsResponse)
def get_user_stats(db: Session = Depends(get_db)):
    total = db.scalar(select(func.count()).select_from(User))
    active = db.scalar(select(func.count()).select_from(User).where(User.status == UserStatus.ACTIVE))
    admins = db.scalar(select(func.count()).select_from(User).where(User.role == RoleEnum.ADMIN))
    return UserStatsResponse(total=total, active=active, admins=admins)


@router.get("/list", response_model=List[UserListItem])
def list_users(db: Session = Depends(get_db)):
    return db.execute(select(User).order_by(User.username)).scalars().all()


@router.post(
    "/create_user",
    status_code=status.HTTP_201_CREATED,
    response_model=AdminCreatedUserResponse,
)
def create_user(
    user_data: AdminCreateUserRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):

    existing_user_resault = db.execute(select(User).where(User.username == user_data.username))

    if existing_user_resault.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already exists",
        )

    user = User(
        username=user_data.username,
        password=get_password_hash(user_data.password),
        role=RoleEnum(user_data.role),
        status=UserStatus(user_data.status),
    )

    db.add(user)
    db.flush()
    if user.id is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Something went wrong, Please try again",
        )
    db.commit()

    return AdminCreatedUserResponse(
        id=user.id,
        username=user.username,
        role=user.role,
        status=user.status,
    )


@router.post("/delete", status_code=status.HTTP_200_OK)
def delete_user(user_to_delete: DeleteUserRequest, db: Session = Depends(get_db)):
    user = db.execute(select(User).where(User.username == user_to_delete.username)).scalar_one_or_none()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    db.delete(user)
    db.commit()
    return {"detail": f"{user_to_delete.username} deleted successfully"}
