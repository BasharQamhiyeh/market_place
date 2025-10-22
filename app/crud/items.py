from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload, joinedload
from fastapi import HTTPException, BackgroundTasks
from datetime import datetime
import uuid
from utils.elastic import es, ITEM_INDEX, index_item


from schemas.items import ItemCreate, ItemUpdate
from models.items import Item, ItemAttributeValue, Photo
from utils.storage import LocalStorageService

storage_service = LocalStorageService()

# ---------------------
# CREATE
# ---------------------
async def create_item(db: AsyncSession, item_data: ItemCreate, user_id: int, photos: list = None, background_tasks=None):
    new_item = Item(
        title=item_data.title,
        category_id=item_data.category_id,
        description=item_data.description,
        price=item_data.price,
        user_id=user_id,
        created_at=datetime.utcnow()
    )
    db.add(new_item)
    await db.flush()  # populate new_item.id

    # Attribute values
    for attr in item_data.attribute_values:
        db.add(
            ItemAttributeValue(
                item_id=new_item.id,
                attribute_id=attr.attribute_id,
                value=attr.value
            )
        )

    # Save photos if provided
    if photos:
        for file in photos:
            filename = f"{uuid.uuid4()}.{file.filename.split('.')[-1]}"
            file_url = await storage_service.save(file, filename)
            db.add(Photo(url=file_url, item_id=new_item.id))

    await db.commit()

    # Reload with attributes and photos
    result = await db.execute(
        select(Item)
        .options(
            selectinload(Item.owner),
            joinedload(Item.category),
            selectinload(Item.attribute_values).selectinload(ItemAttributeValue.attribute),
            selectinload(Item.photos)  # <--- added photos
        )
        .where(Item.id == new_item.id)
    )
    new_item = result.scalar_one_or_none()
    if not new_item:
        raise HTTPException(status_code=500, detail="Failed to load newly created item")

    doc = {
        "id": new_item.id,
        "title": new_item.title,
        "description": new_item.description,
        "price": new_item.price,
        "category": new_item.category.name if new_item.category else None,
        "user_id": new_item.user_id,
        "created_at": new_item.created_at,
        "attributes": [
            {"name": av.attribute.name, "value": av.value} for av in new_item.attribute_values
        ]
    }

    # Index in background
    background_tasks.add_task(index_item, doc)

    return new_item

# ---------------------
# READ
# ---------------------
async def get_item(db: AsyncSession, item_id: int):
    result = await db.execute(
        select(Item)
        .options(
            selectinload(Item.owner),
            selectinload(Item.attribute_values).selectinload(ItemAttributeValue.attribute),
            selectinload(Item.photos)  # <--- added photos
        )
        .where(Item.id == item_id)
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


async def get_items(db: AsyncSession, skip: int = 0, limit: int = 10, current_user=None):
    result = await db.execute(
        select(Item)
        .options(
            selectinload(Item.owner),
            selectinload(Item.attribute_values).selectinload(ItemAttributeValue.attribute),
            selectinload(Item.photos)  # <--- added photos
        )
        .order_by(Item.created_at.desc(), Item.id.desc())
        .offset(skip)
        .limit(limit)
    )
    items = result.scalars().all()
    if not current_user:
        # Remove owner for unauthenticated users
        for item in items:
            item.owner = None

    return items

# ---------------------
# UPDATE
# ---------------------
async def update_item(db: AsyncSession, item_id: int, item_data: ItemUpdate):
    result = await db.execute(
        select(Item)
        .options(
            selectinload(Item.owner).
            selectinload(Item.attribute_values).selectinload(ItemAttributeValue.attribute),
            selectinload(Item.photos)  # <--- added photos
        )
        .where(Item.id == item_id)
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    # Update main fields
    if item_data.category_id is not None:
        item.category_id = item_data.category_id
    if item_data.description is not None:
        item.description = item_data.description
    if item_data.price is not None:
        item.price = item_data.price

    # Update attribute values
    if item_data.attribute_values is not None:
        await db.execute(
            ItemAttributeValue.__table__.delete().where(ItemAttributeValue.item_id == item.id)
        )
        for attr in item_data.attribute_values:
            db.add(
                ItemAttributeValue(
                    item_id=item.id,
                    attribute_id=attr.attribute_id,
                    value=attr.value
                )
            )

    await db.commit()

    # Reload with attributes and photos
    result = await db.execute(
        select(Item)
        .options(
            selectinload(Item.owner),
            selectinload(Item.attribute_values).selectinload(ItemAttributeValue.attribute),
            selectinload(Item.photos)  # <--- added photos
        )
        .where(Item.id == item.id)
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=500, detail="Failed to load updated item")
    return item

# ---------------------
# DELETE
# ---------------------
async def delete_item(db: AsyncSession, item_id: int, current_user):
    result = await db.execute(
        select(Item)
        .options(
            selectinload(Item.owner),
            selectinload(Item.photos)
        )
        .where(Item.id == item_id)
    )
    item = result.scalar_one_or_none()

    if item.owner.user_id != current_user.user_id:
        raise HTTPException(status_code=401, detail="Operation not allowed! The user is not the owner")
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    for photo in item.photos:
        await storage_service.delete(photo.url)
        await db.delete(photo)

    await db.delete(item)
    await db.commit()
    return {"message": "Item deleted successfully"}
