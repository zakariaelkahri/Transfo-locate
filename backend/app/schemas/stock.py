from pydantic import BaseModel


class ItemRequest(BaseModel):
    itmref: str


class LotRequest(BaseModel):
    lot: str


class SloRequest(BaseModel):
    slo: str
