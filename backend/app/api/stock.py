from fastapi import APIRouter
from app.schemas.stock import ItemRequest, LotRequest, SerieNumRequest
from app.services.item_loc import get_item_loc
from app.services.pagination import pagination_check
from app.core.config import settings
import requests

router = APIRouter(prefix="/api/stock")


@router.post("/itemLoc/itemRef")
def item_loc(item_ref: ItemRequest):
    response = requests.get(
        f"{settings.SAGE_API_URL}"
        f"?representation=STOCK.$lookup&count=1000&where=ITMREF%20eq%20%27{item_ref.itmref}%27",
        auth=(settings.SAGE_API_USER, settings.SAGE_API_PASSWORD)
    )

    final_response = response.json()
    link_exist = final_response["$links"].get("$next", None)    
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
                "SERNUM": res["SERNUM"],
                "LOC": loc,

            }
            items.append(item)

    out_of_range_items = pagination_check(len(items))

    return items,{"pagination_existance": out_of_range_items}


@router.post("/itemLoc/lot")
def item_loc_by_lot(lot: LotRequest):
    response = requests.get(
        f"{settings.SAGE_API_URL}"
        f"?representation=STOCK.$lookup&count=1000&where=LOT%20eq%20%27{lot.lot}%27",
        auth=(settings.SAGE_API_USER, settings.SAGE_API_PASSWORD)
    )

    final_response = response.json()
    link_exist = final_response["$links"].get("$next", None)
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
                "SERNUM": res["SERNUM"],
                "LOC": loc,

            }
            items.append(item)

    out_of_range_items = pagination_check(len(items))

    return items,{"pagination_existance": out_of_range_items}


@router.post("/itemLoc/serieNum")
def item_loc_by_serie_num(serie_num: SerieNumRequest):
    response = requests.get(
        f"{settings.SAGE_API_URL}"
        f"?representation=STOCK.$lookup&count=1000&where=SERNUM%20eq%20%27{serie_num.sernum}%27",
        auth=(settings.SAGE_API_USER, settings.SAGE_API_PASSWORD)
    )

    final_response = response.json()
    link_exist = final_response["$links"].get("$next", None)
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
                "SERNUM": res["SERNUM"],
                "LOC": loc,

            }
            items.append(item)

    out_of_range_items = pagination_check(int(len(items)))

    return items,{"pagination_existance": out_of_range_items}
