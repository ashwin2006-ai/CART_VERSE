"""Product models for CartVerse"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ProductBase(BaseModel):
    """Base product model"""
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    category: str
    stock: int = Field(default=0, ge=0)
    rating: float = Field(default=0, ge=0, le=5)
    discount: float = Field(default=0, ge=0, le=100)
    image_url: Optional[str] = None
    featured: bool = False
    best_seller: bool = False
    is_new: bool = False
    deal_of_the_day: bool = False

class ProductCreate(ProductBase):
    """Create product request"""
    pass

class ProductUpdate(BaseModel):
    """Update product request"""
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    stock: Optional[int] = None
    rating: Optional[float] = None
    discount: Optional[float] = None
    image_url: Optional[str] = None
    featured: Optional[bool] = None
    best_seller: Optional[bool] = None
    is_new: Optional[bool] = None
    deal_of_the_day: Optional[bool] = None

class Product(ProductBase):
    """Product response model"""
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ProductPage(BaseModel):
    """Paginated products response"""
    items: List[Product]
    total: int
    page: int
    page_size: int
    has_more: bool
