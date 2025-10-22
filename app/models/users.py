from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base
from models.items import Item
from pydantic import BaseModel


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, nullable=True)
    phone = Column(String(20), unique=True, nullable=False)
    password = Column(String(200), nullable=False)
    is_admin = Column(Boolean, default=False)

    items = relationship("Item", back_populates="owner")


class TokenUser(BaseModel):
    __allow_unmapped__ = True

    user_id: int
    username: str | None = None
    is_admin: bool = False