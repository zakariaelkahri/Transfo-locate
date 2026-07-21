from pydantic import BaseModel


class ItemRequest(BaseModel):
    itmref: str
