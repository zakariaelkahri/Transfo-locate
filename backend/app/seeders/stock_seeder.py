from decimal import Decimal
from app.core.database import SessionLocal
from app.models.stock import Stock

STOCK_DATA = [
    ("SIEGE", "CN-000655", "SOLAR", "SOLMPE", Decimal("65"), "A"),
    ("SIEGE", "CN-000656", "SOLAR", "SOLMPE", Decimal("100"), "A"),
    ("SIEGE", "CN-000657", "SOLAR", "SOLMPE", Decimal("100"), "A"),
    ("SIEGE", "EQ-000017", "SOLAR", "SOLMPE", Decimal("2"), "A"),
    ("SIEGE", "MPE900000947", "SOLAR", "SOLMPE", Decimal("56"), "A"),
    ("SIEGE", "MPE900000951", "SOLAR", "SOLMPE", Decimal("142"), "A"),
    ("SIEGE", "MPS90000159", "SOLAR", "SOLMPE", Decimal("319"), "A"),
    ("SIEGE", "MPS90000199", "SOLAR", "SOLMPE", Decimal("171"), "A"),
    ("SIEGE", "MPS90000200", "SOLAR", "SOLMPE", Decimal("66"), "A"),
    ("SIEGE", "MPS90000203", "SOLAR", "SOLMPE", Decimal("7"), "A"),
    ("SIEGE", "MPE500000205", "SAV", "TRSPUC", Decimal("780"), "A"),
    ("SIEGE", "IN-001137", "ADM", "CONSOM", Decimal("1"), "A"),
    ("SIEGE", "MODULES", "EXTRN", "MARDERBSEL", Decimal("1"), "A"),
    ("SIEGE", "MOUNTING-STRUCTURE", "EXTRN", "MARDERBSEL", Decimal("1"), "A"),
    ("SIEGE", "INVERTERS", "EXTRN", "MARDERBSEL", Decimal("1"), "A"),
    ("SIEGE", "MONITORING", "EXTRN", "MARDERBSEL", Decimal("1"), "A"),
    ("SIEGE", "MET-STATION", "EXTRN", "MARDERBSEL", Decimal("1"), "A"),
    ("SIEGE", "OTHER", "EXTRN", "MARDERBSEL", Decimal("1"), "A"),
    ("SIEGE", "DC-INSTALLATION", "EXTRN", "MARDERBSEL", Decimal("1"), "A"),
    ("SIEGE", "AC-INSTALLATION", "EXTRN", "MARDERBSEL", Decimal("1"), "A"),
]


def seed_stock():
    db = SessionLocal()
    try:
        for stofcy, itmref, loctyp, loc, qtystu, sta in STOCK_DATA:
            exists = db.get(Stock, (stofcy, itmref, loctyp, loc, sta))
            if not exists:
                db.add(Stock(stofcy=stofcy, itmref=itmref, loctyp=loctyp, loc=loc, qtystu=qtystu, sta=sta))
        db.commit()
        print(f"Seeded {len(STOCK_DATA)} stock records.")
    finally:
        db.close()
