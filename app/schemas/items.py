from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .auth import UserOut

# ---------------------
# Item Attribute schemas
# ---------------------
class ItemAttributeValueBase(BaseModel):
    attribute_id: int
    item_id: Optional[int] = None
    value: str

class ItemAttributeValueCreate(ItemAttributeValueBase):
    pass

class ItemAttributeValueRead(ItemAttributeValueBase):
    id: int
    value: Optional[str]  # We can populate this from the joined attribute
    attribute_name: Optional[str]

    class Config:
        orm_mode = True

# ---------------------
# Item schemas
# ---------------------
class ItemBase(BaseModel):
    title: str
    category_id: int
    description: Optional[str]
    price: Optional[float]

class ItemCreate(ItemBase):
    attribute_values: List[ItemAttributeValueCreate] = []

class ItemUpdate(BaseModel):
    category_id: Optional[int] = None
    description: Optional[str] = None
    price: Optional[float] = None
    attribute_values: Optional[List[ItemAttributeValueCreate]] = None

class PhotoRead(BaseModel):
    photo_id: int
    url: str

    class Config:
        orm_mode = True

class ItemRead(ItemBase):
    id: int
    created_at: datetime
    description: str = ""
    price: float = None
    attribute_values: List[ItemAttributeValueRead] = []
    photos: List[PhotoRead] = []  # ✅ add this
    owner: Optional[UserOut] = None

    class Config:
        orm_mode = True
