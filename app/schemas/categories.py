from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# ---------------------
# Attribute Option schemas
# ---------------------
class AttributeOptionBase(BaseModel):
    value: str

class AttributeOptionCreate(AttributeOptionBase):
    pass

class AttributeOptionRead(AttributeOptionBase):
    id: int

    class Config:
        orm_mode = True


# ---------------------
# Attribute schemas
# ---------------------
class AttributeBase(BaseModel):
    name: str
    input_type: Optional[str] = None  # text, select, number, etc.
    is_required: bool = True

class AttributeCreate(AttributeBase):
    options: Optional[List[AttributeOptionCreate]] = []

class AttributeRead(AttributeBase):
    id: int
    options: List[AttributeOptionRead] = []

    class Config:
        orm_mode = True


# ---------------------
# Category schemas
# ---------------------
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryRead(CategoryBase):
    id: int
    attributes: List[AttributeRead] = []

    class Config:
        orm_mode = True


