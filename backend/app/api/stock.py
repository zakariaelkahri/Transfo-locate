from fastapi import APIRouter
from app.schemas.stock import ItemRequest
from app.services.item_loc import get_item_loc
import requests

router = APIRouter(prefix="/api/stock")


@router.post("/item_loc")
def item_loc(item_ref: ItemRequest):
    response = requests.get(
        f"http://192.168.10.100:8124/api1/x3/erp/ENERGY/STOCK"
        f"?representation=STOCK.$lookup&where=ITMREF%20eq%20%27{item_ref.itmref}%27",
        auth=("API", "Energy@2026")
    )

    test = response.json()

    items = []
    for res in test["$resources"]:
        if res["LOCTYP"] == "ZONE1":
            loc = get_item_loc(res["LOC"])
            item = {
                "LOT": res["LOT"],
                "SLO": res["SLO"],
                "LOCTYP": res["LOCTYP"],
                "QTYSTU": res["QTYSTU"],
                "STOFCY": res["STOFCY"],
                "ITMREF": res["ITMREF"],
                "LOC": loc,
            }
            items.append(item)

    return items
