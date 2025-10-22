from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import timedelta
from starlette.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer

from utils import auth
from endpoints.auth import router as auth_router
from endpoints.items import router as items_router
from endpoints.categories import router as categories_router
from models import categories, items, users
from database import engine, Base, get_db
from fastapi.staticfiles import StaticFiles
from utils.elastic import create_item_index

app = FastAPI()

app.mount("/static", StaticFiles(directory="uploads"), name="static")


# run once
@app.on_event("startup")
async def startup():
    # async with engine.begin() as conn:
    #     await conn.run_sync(Base.metadata.create_all)

    create_item_index()

origins = [
    "http://localhost:4200",
    "https://localhost:4200",
    "http://127.0.0.1:4200",
    "https://127.0.0.1:4200",
    # Angular dev server
    # add more origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow POST, GET, OPTIONS
    allow_headers=["*"],  # Allow custom headers
)

@app.middleware("http")
async def debug_middleware(request, call_next):
    print("DEBUG:", request.method, request.url)
    response = await call_next(request)
    return response

app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(items_router, prefix="/items", tags=["Items"])
app.include_router(categories_router, prefix="/categories", tags=["Categories"])






# Include auth routes
# app.include_router(auth.router, prefix="/auth")  # e.g., /auth/login

