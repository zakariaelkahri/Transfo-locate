from fastapi import APIRouter, Depends, HTTPException, status
from fastapi import APIRouter
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.stock import Stock
from app.core.database import get_db
from app.schemas.stock import ItemSearch
from app.services.item_loc import get_item_loc

router = APIRouter(prefix="/api/stock")


@router.post("/item_loc")
def item_loc(item_ref:ItemSearch, db:Session = Depends(get_db)):
    itm_loc = db.execute(select(Stock.loc).where(Stock.itmref == item_ref.itmref))
    itm_loc_num = itm_loc.scalar_one_or_none()

    if itm_loc_num is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item '{item_ref.itmref}' not found",
        )

    return get_item_loc(itm_loc_num) 

