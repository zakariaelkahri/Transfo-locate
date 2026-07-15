from decimal import Decimal

from sqlalchemy import Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Stock(Base):
    __tablename__ = "STOCK"

    stofcy: Mapped[str] = mapped_column(
        "STOFCY_0",
        String(5),
        primary_key=True,
        comment="Site stockage",
    )
    itmref: Mapped[str] = mapped_column(
        "ITMREF_0",
        String(20),
        primary_key=True,
        comment="Article",
    )
    loctyp: Mapped[str] = mapped_column(
        "LOCTYP_0",
        String(5),
        primary_key=True,
        comment="Type emplacement",
    )
    loc: Mapped[str] = mapped_column(
        "LOC_0",
        String(10),
        primary_key=True,
        comment="Emplacement",
    )
    qtystu: Mapped[Decimal] = mapped_column(
        "QTYSTU_0",
        Numeric(28, 13),
        nullable=False,
        comment="Quantite US",
    )
    sta: Mapped[str] = mapped_column(
        "STA_0",
        String(3),
        primary_key=True,
        comment="Statut",
    )
