from fastapi import APIRouter, Depends, Form, File, UploadFile, BackgroundTasks, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import json

from ..database import get_db
from .. import schemas
from ..crud import items as crud_items
from ..utils.auth import get_current_user_from_token, get_optional_current_user
from ..schemas.items import *
from ..models.users import User, TokenUser
from ..utils.elastic import search_items


router = APIRouter()

# ---------------------
# CREATE ITEM + PHOTOS
# ---------------------
@router.post("/items", response_model=ItemRead)
async def create_item(
    title: str = Form(...),
    category_id: int = Form(...),
    description: str = Form(None),
    price: float = Form(None),
    attribute_values: str = Form("[]"),  # JSON string
    photos: list[UploadFile] = File([]),  # optional
    background_tasks: BackgroundTasks = None,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user_from_token)
):
    """
    Create a new item with optional photos.
    Frontend should send multipart/form-data.
    `attribute_values` must be a JSON string of ItemAttributeValueCreate list.
    """
    item_data = ItemCreate(
        title=title,
        category_id=category_id,
        description=description,
        price=price,
        attribute_values=json.loads(attribute_values)
    )

    return await crud_items.create_item(
        db, item_data, user_id=current_user.user_id, photos=photos, background_tasks=background_tasks
    )

# ---------------------
# GET SINGLE ITEM
# ---------------------
@router.get("/items/{item_id}", response_model=ItemRead)
async def get_item(item_id: int, db: AsyncSession = Depends(get_db)):
    """
    Get an item by ID, including attribute values and photos.
    """
    return await crud_items.get_item(db, item_id)

# ---------------------
# GET ITEMS LIST
# ---------------------
@router.get("/items", response_model=List[ItemRead])
async def get_items(skip: int = 0, limit: int = 10, db: AsyncSession = Depends(get_db),
                    current_user: Optional[TokenUser] = Depends(get_optional_current_user)):
    """
    Get a paginated list of items, including attributes and photos.
    """
    return await crud_items.get_items(db, skip=skip, limit=limit, current_user=current_user)

# ---------------------
# UPDATE ITEM
# ---------------------
@router.put("/items/{item_id}", response_model=ItemRead)
async def update_item(
    item_id: int,
    payload: ItemUpdate,
    db: AsyncSession = Depends(get_db)
):
    """
    Update an item and its attributes. Photos are not handled here.
    """
    return await crud_items.update_item(db, item_id, payload)

# ---------------------
# DELETE ITEM
# ---------------------
@router.delete("/items/{item_id}")
async def delete_item(item_id: int, db: AsyncSession = Depends(get_db),
                      current_user=Depends(get_current_user_from_token)):
    """
    Delete an item by ID.
    """
    return await crud_items.delete_item(db, item_id, current_user)



@router.get("/search")
async def search_items_api(q: str = Query(None, description="Search text")):
    results = search_items(q)
    return {"results": results, "count": len(results)}