from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class Token(BaseModel):
    access_token: str
    token_type: str


class UserCreate(BaseModel):
    username: str
    phone: str
    password: str
    email: Optional[EmailStr] = None


class UserOut(BaseModel):
    user_id: int
    username: str
    phone: str
    email: Optional[EmailStr]

    class Config:
        orm_mode = True
