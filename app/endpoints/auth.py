from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import timedelta
from fastapi.security import OAuth2PasswordRequestForm

from ..utils import auth
from ..database import get_db
from ..schemas.auth import *
from ..crud.users import *

router = APIRouter()

# Define constants for token expiration and error messages
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # Token validity in minutes
INVALID_CREDENTIALS_ERROR = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Invalid credentials",
    headers={"WWW-Authenticate": "Bearer"},  # Standard WWW-Authenticate header for OAuth2
)

@router.post("/signup", response_model=UserOut)
async def signup(user: UserCreate, db: AsyncSession = Depends(get_db)):
    existing = await get_user_by_name(db, user.username)
    if existing:
        raise HTTPException(status_code=400, detail="Username already used")
    return await create_user(db, user)


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    # Retrieve user by phone (username)
    user = await get_user_by_name(db, form_data.username)

    # Check if the user exists and verify the password
    if not user or not auth.verify_password(form_data.password, user.password):
        raise INVALID_CREDENTIALS_ERROR

    # Create an access token with the user's ID as the "sub" (subject) claim
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={
            "sub": str(user.user_id),
            "username": user.username,
            "is_admin": user.is_admin
        },
        expires_delta=access_token_expires
    )

    # Return the token and token type
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/logout")
async def logout(token: str = Depends(auth.oauth2_scheme)):
    # Check if token is valid
    auth.logout(token)

    return {"message": "Logged out successfully"}