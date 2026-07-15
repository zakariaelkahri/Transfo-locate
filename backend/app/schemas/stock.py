from pydantic import BaseModel

# Create a schema for the incoming request body
class ItemSearch(BaseModel):
    itmref: str