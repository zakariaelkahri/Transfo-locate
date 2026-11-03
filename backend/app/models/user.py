from sqlalchemy import String, Enum as SQLEnum
from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy.dialects.postgresql import UUID as PGUUID
import enum
import uuid
from uuid import UUID
from typing import TYPE_CHECKING

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.item import Item


class RoleEnum(str, enum.Enum):
    ADMIN = "admin"
    USER = "user"
    RESP = "responsible"


class UserStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"


class User(Base):
    __tablename__ = "users"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    role: Mapped[RoleEnum] = mapped_column(
        SQLEnum(RoleEnum),
        nullable=False,
        default=RoleEnum.USER,
    )

    status: Mapped[UserStatus] = mapped_column(
        SQLEnum(UserStatus), default=UserStatus.ACTIVE, nullable=False
    )

    username: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
    )

    password: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    items: Mapped[list["Item"]] = relationship(back_populates="user")
