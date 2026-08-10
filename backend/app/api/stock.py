from fastapi import APIRouter
from app.schemas.stock import ItemRequest, LotRequest, SerieNumRequest, OFRequest
from app.services.item_loc import get_item_loc
from app.services.pagination import pagination_check
from app.core.config import settings
import requests

router = APIRouter(prefix="/api/stock")


@router.post("/itemLoc/itemRef")
def item_loc(item_ref: ItemRequest):
    response = requests.get(
        f"{settings.SAGE_API_URL_STOCK}"
        f"?representation=STOCK.$lookup&count=1000&where=ITMREF%20eq%20%27{item_ref.itmref}%27",
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
                "SERNUM": res["SERNUM"],
                "LOC": loc,

            }
            items.append(item)

    out_of_range_items = pagination_check(len(items))

    return items, {"pagination_existance": out_of_range_items}


@router.post("/itemLoc/lot")
def item_loc_by_lot(lot: LotRequest):
    response = requests.get(
        f"{settings.SAGE_API_URL_STOCK}"
        f"?representation=STOCK.$lookup&count=1000&where=LOT%20eq%20%27{lot.lot}%27",
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
                "SERNUM": res["SERNUM"],
                "LOC": loc,

            }
            items.append(item)

    out_of_range_items = pagination_check(len(items))

    return items, {"pagination_existance": out_of_range_items}


@router.post("/itemLoc/serieNum")
def item_loc_by_serie_num(serie_num: SerieNumRequest):
    response = requests.get(
        f"{settings.SAGE_API_URL_STOCK}"
        f"?representation=STOCK.$lookup&count=1000&where=SERNUM%20eq%20%27{serie_num.sernum}%27",
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
                "SERNUM": res["SERNUM"],
                "LOC": loc,

            }
            items.append(item)

    out_of_range_items = pagination_check(len(items))

    return items, {"pagination_existance": out_of_range_items}


@router.post("/matloc/OF")
def get_of_mat(OF: OFRequest):
    response_mat = requests.get(
        f"{settings.SAGE_API_URL_MAT}"
        f"?representation=MFGMAT.$lookup&count=1000&where=MFGNUM%20eq%20%27{OF.OF}%27",
        auth=(settings.SAGE_API_USER, settings.SAGE_API_PASSWORD)
    )
    mat_items = []
    resources_mfgmat = response_mat.json()

    for i in resources_mfgmat["$resources"]:
        if i["ALLQTY"] > 0:
            mfglin = i["MFGLIN"]
            itmref = i["ITMREF"]
            response_stoall = requests.get(
                f"{settings.SAGE_API_URL_STOALL}"
                f"?representation=STOALL.$lookup&count=1000&where=VCRNUM%20eq%20%27{OF.OF}%27"
                f" and VCRLIN eq {mfglin} and VCRTYP eq 10 and ITMREF eq %27{itmref}%27",
                auth=(settings.SAGE_API_USER, settings.SAGE_API_PASSWORD)
            )

            resources_stoall = response_stoall.json()

            for j in resources_stoall["$resources"]:
                stock_item = {}
                stocou = j["STOCOU"]
                response_stock = requests.get(
                    f"{settings.SAGE_API_URL_STOCK}"
                    f"?representation=STOCK.$lookup&count=1000&where=STOFCY%20eq%20%27SIEGE%27 and STOCOU eq {stocou}",
                    auth=(settings.SAGE_API_USER, settings.SAGE_API_PASSWORD)
                )

                if j["STOCOU"] > 0:
                    stock = response_stock.json()
                    res = stock["$resources"]
                    if res[0]["LOCTYP"] == "ZONE1":
                        loc = get_item_loc(res[0]["LOC"])
                        stock_item = {
                            "LOT": res[0]["LOT"],
                            "SLO": res[0]["SLO"],
                            "LOCTYP": res[0]["LOCTYP"],
                            "QTYSTU": res[0]["QTYSTU"],
                            "STOFCY": res[0]["STOFCY"],
                            "ITMREF": res[0]["ITMREF"],
                            "STA": res[0]["STA"],
                            "LOC": loc,
                        }
                    else:
                        continue

                item_final = {
                    "No ordre": i["MFGNUM"],
                    "No ligne": i["MFGLIN"],
                    "Article": i["ITMREF"],
                    "Quantité allouée": i["ALLQTY"],
                    "stock infos": stock_item,
                }
                mat_items.append(item_final)

    return mat_items
