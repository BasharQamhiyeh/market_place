# app/crud/categories.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException
from typing import List

from models.categories import *
from schemas.categories import *


# -----------------------------
# CATEGORY CRUD
# -----------------------------
async def get_categories(db: AsyncSession) -> List[Category]:
    result = await db.execute(select(Category))
    return result.scalars().all()


async def get_category(db: AsyncSession, category_id: int):
    result = await db.execute(select(Category).where(Category.id == category_id))
    return result.scalar_one_or_none()


async def create_category(db: AsyncSession, payload: CategoryCreate):
    category = Category(**payload.dict())
    db.add(category)
    await db.commit()
    await db.refresh(category)
    return category


async def update_category(db: AsyncSession, category_id: int, payload: CategoryCreate):
    category = await get_category(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    category.name = payload.name
    category.description = payload.description
    await db.commit()
    await db.refresh(category)
    return category


async def delete_category(db: AsyncSession, category_id: int):
    category = await get_category(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    await db.delete(category)
    await db.commit()
    return {"ok": True}


# -----------------------------
# ATTRIBUTE CRUD
# -----------------------------
async def get_attributes(db: AsyncSession, category_id: int) -> List[Attribute]:
    result = await db.execute(
        select(Attribute)
        .options(selectinload(Attribute.options))
        .where(Attribute.category_id == category_id)
    )
    return result.scalars().all()


async def create_attribute(db: AsyncSession, category_id: int, payload: AttributeCreate):
    attribute = Attribute(category_id=category_id, **payload.dict())
    db.add(attribute)
    await db.commit()
    await db.refresh(attribute)
    return attribute


async def update_attribute(db: AsyncSession, attribute_id: int, payload: AttributeCreate):
    result = await db.execute(select(Attribute).where(Attribute.id == attribute_id))
    attribute = result.scalar_one_or_none()
    if not attribute:
        raise HTTPException(status_code=404, detail="Attribute not found")
    attribute.name = payload.name
    attribute.input_type = payload.input_type
    attribute.is_required = payload.is_required
    await db.commit()
    await db.refresh(attribute)
    return attribute


async def delete_attribute(db: AsyncSession, attribute_id: int):
    result = await db.execute(select(Attribute).where(Attribute.id == attribute_id))
    attribute = result.scalar_one_or_none()
    if not attribute:
        raise HTTPException(status_code=404, detail="Attribute not found")
    await db.delete(attribute)
    await db.commit()
    return {"ok": True}


# -----------------------------
# ATTRIBUTE OPTION CRUD
# -----------------------------
async def get_options(db: AsyncSession, attribute_id: int) -> List[AttributeOption]:
    result = await db.execute(
        select(AttributeOption).where(AttributeOption.attribute_id == attribute_id)
    )
    return result.scalars().all()


async def create_option(db: AsyncSession, attribute_id: int, payload: AttributeOptionCreate):
    option = AttributeOption(attribute_id=attribute_id, **payload.dict())
    db.add(option)
    await db.commit()
    await db.refresh(option)
    return option


async def update_option(db: AsyncSession, option_id: int, payload: AttributeOptionCreate):
    result = await db.execute(select(AttributeOption).where(AttributeOption.id == option_id))
    option = result.scalar_one_or_none()
    if not option:
        raise HTTPException(status_code=404, detail="Option not found")
    option.value = payload.value
    await db.commit()
    await db.refresh(option)
    return option


async def delete_option(db: AsyncSession, option_id: int):
    result = await db.execute(select(AttributeOption).where(AttributeOption.id == option_id))
    option = result.scalar_one_or_none()
    if not option:
        raise HTTPException(status_code=404, detail="Option not found")
    await db.delete(option)
    await db.commit()
    return {"ok": True}
