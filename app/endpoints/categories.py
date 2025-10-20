from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from ..utils.auth import require_admin
from ..database import get_db
from ..crud import categories as crud_categories
from ..schemas.categories import (
    CategoryCreate,
    CategoryRead,
    AttributeCreate,
    AttributeRead,
    AttributeOptionCreate,
    AttributeOptionRead,
)

router = APIRouter()

# -----------------------------
# Category Endpoints
# -----------------------------
@router.get("/categories", response_model=List[CategoryRead])
async def get_categories(db: AsyncSession = Depends(get_db)):
    return await crud_categories.get_categories(db)


@router.get("/categories/{category_id}", response_model=CategoryRead)
async def get_category(category_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(require_admin)):
    category = await crud_categories.get_category(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.post("/categories", response_model=CategoryRead)
async def create_category(payload: CategoryCreate, db: AsyncSession = Depends(get_db), admin=Depends(require_admin)):
    return await crud_categories.create_category(db, payload)


@router.put("/categories/{category_id}", response_model=CategoryRead)
async def update_category(category_id: int, payload: CategoryCreate, db: AsyncSession = Depends(get_db), admin=Depends(require_admin)):
    return await crud_categories.update_category(db, category_id, payload)


@router.delete("/categories/{category_id}")
async def delete_category(category_id: int, db: AsyncSession = Depends(get_db), admin=Depends(require_admin)):
    return await crud_categories.delete_category(db, category_id)


# -----------------------------
# Attribute Endpoints
# -----------------------------
@router.get("/categories/{category_id}/attributes", response_model=List[AttributeRead])
async def get_attributes(category_id: int, db: AsyncSession = Depends(get_db)):
    return await crud_categories.get_attributes(db, category_id)


@router.post("/categories/{category_id}/attributes", response_model=AttributeRead)
async def create_attribute(category_id: int, payload: AttributeCreate, db: AsyncSession = Depends(get_db), admin=Depends(require_admin)):
    return await crud_categories.create_attribute(db, category_id, payload)


@router.put("/attributes/{attribute_id}", response_model=AttributeRead)
async def update_attribute(attribute_id: int, payload: AttributeCreate, db: AsyncSession = Depends(get_db), admin=Depends(require_admin)):
    return await crud_categories.update_attribute(db, attribute_id, payload)


@router.delete("/attributes/{attribute_id}")
async def delete_attribute(attribute_id: int, db: AsyncSession = Depends(get_db), admin=Depends(require_admin)):
    return await crud_categories.delete_attribute(db, attribute_id)


# -----------------------------
# Attribute Option Endpoints
# -----------------------------
@router.get("/attributes/{attribute_id}/options", response_model=List[AttributeOptionRead])
async def get_options(attribute_id: int, db: AsyncSession = Depends(get_db)):
    return await crud_categories.get_options(db, attribute_id)


@router.post("/attributes/{attribute_id}/options", response_model=AttributeOptionRead)
async def create_option(attribute_id: int, payload: AttributeOptionCreate, db: AsyncSession = Depends(get_db), admin=Depends(require_admin)):
    return await crud_categories.create_option(db, attribute_id, payload)


@router.put("/options/{option_id}", response_model=AttributeOptionRead)
async def update_option(option_id: int, payload: AttributeOptionCreate, db: AsyncSession = Depends(get_db), admin=Depends(require_admin)):
    return await crud_categories.update_option(db, option_id, payload)


@router.delete("/options/{option_id}")
async def delete_option(option_id: int, db: AsyncSession = Depends(get_db), admin=Depends(require_admin)):
    return await crud_categories.delete_option(db, option_id)
