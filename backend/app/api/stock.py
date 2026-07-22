from fastapi import APIRouter
from app.schemas.stock import ItemRequest, LotRequest
from app.services.item_loc import get_item_loc
from app.core.config import settings
import requests

router = APIRouter(prefix="/api/stock")


@router.post("/item_loc/itemref")
def item_loc(item_ref: ItemRequest):
    response = requests.get(
        f"{settings.SAGE_API_URL}"
        f"?representation=STOCK.$lookup&where=ITMREF%20eq%20%27{item_ref.itmref}%27",
        auth=(settings.SAGE_API_USER, settings.SAGE_API_PASSWORD)
    )

    final_response = response.json()

    items = []
    for res in final_response["$resources"]:
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


@router.post("/item_loc/lot")
def item_loc_by_lot(lot: LotRequest):
    response = requests.get(
        f"{settings.SAGE_API_URL}"
        f"?representation=STOCK.$lookup&where=LOT%20eq%20%27{lot.lot}%27",
        auth=(settings.SAGE_API_USER, settings.SAGE_API_PASSWORD)
    )

    final_response = response.json()

    items = []
    for res in final_response["$resources"]:
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