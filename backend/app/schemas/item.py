from datetime import date
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, computed_field, model_validator

from app.services.item_loc import get_item_loc


class ItemFields(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    description: str | None = Field(default=None, max_length=50)
    mp: str | None = Field(default=None, max_length=100)
    serie_number: str | None = Field(default=None, max_length=50)
    kv: int | None = Field(default=None, ge=-2147483648, le=2147483647)
    location: str = Field(min_length=10, max_length=10, pattern=r"^[0-9]{10}$")
    insertion_date: date
    availlable: bool = True


class ItemCreate(ItemFields):
    @model_validator(mode="after")
    def require_one_identifier(self):
        for name in ("serie_number", "description", "mp"):
            setattr(self, name, getattr(self, name) or None)
        if sum(value is not None for value in (self.serie_number, self.mp)) != 1:
            raise ValueError("Provide exactly one identifier: serie_number or mp")
        if self.kv is not None and self.serie_number is None:
            raise ValueError("kv is only allowed with serie_number")
        return self


class ItemUpdate(ItemCreate):
    availlable: bool = Field(...)


class ItemResponse(ItemFields):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID

    @computed_field
    @property
    def location_details(self) -> dict[str, str]:
        return get_item_loc(self.location)


class ItemListResponse(BaseModel):
    items: list[ItemResponse]
    total: int
    page: int
    page_size: int
