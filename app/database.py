from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

user = os.environ.get('DB_USER', 'admin')
password = os.environ.get('DB_PASSWORD', 'postgres')
name = os.environ.get('DP_NAME','marketplace_db')
host = os.environ.get('DB_HOST', 'localhost:5432')


DATABASE_URL = f"postgresql+asyncpg://{password}:{user}@{host}/{name}"

engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
