from pydantic import BaseModel

# Create a schema for the incoming request body
class ItemRequest(BaseModel):
    itmref: str