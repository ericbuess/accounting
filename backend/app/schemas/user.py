from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from ..models.user import UserRole

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: UserRole = UserRole.VIEWER

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[int] = None