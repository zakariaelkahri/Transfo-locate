import json

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi import APIRouter
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.stock import Stock
from app.core.database import get_db
from app.schemas.stock import ItemRequest
from app.services.item_loc import get_item_loc
import requests
router = APIRouter(prefix="/api/stock")


# # @router.post("/item_loc")
# # def item_loc(item_ref:ItemSearch, db:Session = Depends(get_db)):
# #     itm_loc = db.execute(select(Stock.loc).where(Stock.itmref == item_ref.itmref))
# #     itm_loc_num = itm_loc.first()

# #     if itm_loc_num is None:
# #         raise HTTPException(
# #             status_code=status.HTTP_404_NOT_FOUND,
# #             detail=f"Item '{item_ref.itmref}' not found",
# #         )

# #     return get_item_loc(itm_loc_num) 


@router.post("/item_loc")
def item_loc(item_ref: ItemRequest):
    
    # print(item_ref.itmref)
    response = requests.get(
        f"http://192.168.10.100:8124/api1/x3/erp/ENERGY/STOCK"
        f"?representation=STOCK.$lookup&where=ITMREF%20eq%20%27{item_ref.itmref}%27",
        auth=("API", "Energy@2026")
    )

    test = response.json()
    print(test["$resources"])
    items = []
    for res in test["$resources"]:
        if res["LOCTYP"] == "ZONE1" :

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
        else :
            continue

    return items