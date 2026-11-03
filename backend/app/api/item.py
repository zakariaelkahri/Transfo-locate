from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.core.auth import get_current_active_user, get_current_responsible_user
from app.core.database import get_db
from app.models.item import Item
from app.models.user import User
from app.schemas.item import ItemCreate, ItemListResponse, ItemResponse, ItemUpdate

router = APIRouter(prefix="/api/items", tags=["Items"])


@router.post("/{item_id}/edit", response_model=ItemResponse)
def edit_item(
    item_id: UUID,
    data: ItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_responsible_user),
):
    item = db.get(Item, item_id)
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    for name, value in data.model_dump().items():
        setattr(item, name, value)
    try:
        db.commit()
    except Exception:
        db.rollback()
        raise
    db.refresh(item)
    return item


@router.get("", response_model=ItemListResponse)
def list_items(
    q: str = Query(default="", max_length=100),
    available: bool | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    filters = []
    if q.strip():
        filters.append(or_(
            Item.description.icontains(q.strip(), autoescape=True),
            Item.mp.icontains(q.strip(), autoescape=True),
            Item.serie_number.icontains(q.strip(), autoescape=True),
            Item.location.icontains(q.strip(), autoescape=True),
        ))
    if available is not None:
        filters.append(Item.availlable == available)
    total = db.scalar(select(func.count()).select_from(Item).where(*filters))
    items = db.scalars(
        select(Item).where(*filters)
        .order_by(Item.insertion_date.desc(), Item.id.desc())
        .offset((page - 1) * page_size).limit(page_size)
    ).all()
    return ItemListResponse(items=items, total=total, page=page, page_size=page_size)


@router.post("", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
def create_item(
    data: ItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_responsible_user),
):
    item = Item(**data.model_dump(), user_id=current_user.id)
    db.add(item)
    try:
        db.commit()
    except Exception:
        db.rollback()
        raise
    db.refresh(item)
    return item
