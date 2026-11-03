from datetime import date
from typing import TYPE_CHECKING
import uuid
from uuid import UUID

from sqlalchemy import Boolean, CheckConstraint, Date, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.user import User


class Item(Base):
    __tablename__ = "items"
    __table_args__ = (
        CheckConstraint("location ~ '^[0-9]{10}$'", name="ck_items_location_ten_digits"),
    )

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    description: Mapped[str | None] = mapped_column(String(100), nullable=True)
    mp: Mapped[str | None] = mapped_column(String(50), nullable=True)
    serie_number: Mapped[str | None] = mapped_column(String(50), nullable=True)
    kv: Mapped[int | None] = mapped_column(Integer, nullable=True)
    location: Mapped[str] = mapped_column(String(10), nullable=False)
    insertion_date: Mapped[date] = mapped_column(Date, nullable=False)
    availlable: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    user_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )

    user: Mapped["User"] = relationship(back_populates="items")
