"""User models for CartVerse"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class Address(BaseModel):
    """Address model"""
    street: str
    city: str
    state: str
    postal_code: str
    country: str = "India"
    is_default: bool = False

class UserBase(BaseModel):
    """Base user model"""
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    phone: Optional[str] = None

class UserCreate(UserBase):
    """Create user request"""
    password: str = Field(..., min_length=8)

class UserUpdate(BaseModel):
    """Update user request"""
    name: Optional[str] = None
    phone: Optional[str] = None
    addresses: Optional[List[Address]] = None

class User(UserBase):
    """User response model"""
    id: str
    addresses: List[Address] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UserProfile(User):
    """User profile with statistics"""
    total_orders: int = 0
    total_spent: float = 0
    wishlist_count: int = 0
