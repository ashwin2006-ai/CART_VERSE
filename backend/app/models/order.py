"""Order models for CartVerse"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class OrderStatus(str, Enum):
    """Order status enumeration"""
    PENDING = "pending"
    CONFIRMED = "confirmed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class CartItem(BaseModel):
    """Cart item model"""
    product_id: str
    quantity: int = Field(..., gt=0)
    price: float = Field(..., gt=0)

class OrderItemBase(BaseModel):
    """Base order item model"""
    product_id: str
    quantity: int
    price: float

class OrderCreate(BaseModel):
    """Create order request"""
    user_id: str
    items: List[CartItem]
    shipping_address: dict
    total_amount: float = Field(..., gt=0)
    coupon_code: Optional[str] = None

class OrderUpdate(BaseModel):
    """Update order request"""
    status: Optional[OrderStatus] = None
    tracking_number: Optional[str] = None
    notes: Optional[str] = None

class Order(BaseModel):
    """Order response model"""
    id: str
    user_id: str
    status: OrderStatus
    total_amount: float
    items: List[OrderItemBase]
    shipping_address: dict
    tracking_number: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class OrderPage(BaseModel):
    """Paginated orders response"""
    items: List[Order]
    total: int
    page: int
    page_size: int
