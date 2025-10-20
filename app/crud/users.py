from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from ..utils import auth

from ..models import users
from ..schemas import auth as schemas

async def create_user(db: AsyncSession, user: schemas.UserCreate):
    hashed = auth.hash_password(user.password)
    new_user = users.User(username=user.username, phone=user.phone, email=user.email, password=hashed)
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


async def get_user_by_phone(db: AsyncSession, phone: str):
    res = await db.execute(select(users.User).where(users.User.phone == phone))
    return res.scalar_one_or_none()


async def get_user_by_name(db: AsyncSession, username: str):
    res = await db.execute(select(users.User).where(users.User.username == username))
    return res.scalar_one_or_none()