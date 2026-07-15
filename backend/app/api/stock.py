from fastapi import APIRouter, Depends, HTTPException, status
from fastapi import APIRouter
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.stock import Stock
from app.core.database import get_db
from app.schemas.stock import ItemSearch
router = APIRouter(prefix="/stock")


@router.post("/item_loc")
def item_loc(item_ref:ItemSearch, db:Session = Depends(get_db)):
    itm_loc = db.execute(select(Stock.loc).where(Stock.itmref == item_ref.itmref))
    if itm_loc is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Role '{item_ref}' not found",
        )

    itm_loc = int(itm_loc.scalar_one_or_none())
    return 

