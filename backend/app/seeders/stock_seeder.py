from decimal import Decimal
from app.core.database import SessionLocal
from app.models.stock import Stock

STOCK_DATA = [
    ("SIEGE", "2319423836B1", "ZONE1", "0101010210", Decimal("1"), "A"),
    ("SIEGE", "231764283212", "ZONE1", "0104071110", Decimal("1"), "A"),
    ("SIEGE", "230174272211", "ZONE1", "0105080610", Decimal("1"), "A"),
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

# if __name__ == "__main__":
#     seed_stock()
