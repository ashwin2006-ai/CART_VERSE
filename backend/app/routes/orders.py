"""Orders routes"""

from fastapi import APIRouter, HTTPException, status, Query
from typing import Optional
import uuid
from datetime import datetime

router = APIRouter()

# Mock data storage (replace with database)
orders_db = {}

@router.get("")
async def get_orders(
    user_id: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100)
):
    """Get orders with optional user filter"""
    orders_list = list(orders_db.values())
    
    if user_id:
        orders_list = [o for o in orders_list if o["user_id"] == user_id]
    
    total = len(orders_list)
    items = orders_list[skip:skip + limit]
    
    return {
        "items": items,
        "total": total,
        "page": skip // limit,
        "page_size": limit
    }

@router.get("/{order_id}")
async def get_order(order_id: str):
    """Get order by ID"""
    if order_id not in orders_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order {order_id} not found"
        )
    return orders_db[order_id]

@router.post("")
async def create_order(order_data: dict):
    """Create a new order"""
    order_id = f"ord-{uuid.uuid4().hex[:8]}"
    now = datetime.now().isoformat()
    
    new_order = {
        "id": order_id,
        "status": "pending",
        "tracking_number": None,
        **order_data,
        "created_at": now,
        "updated_at": now,
    }
    
    orders_db[order_id] = new_order
    return new_order

@router.put("/{order_id}")
async def update_order(order_id: str, order_update: dict):
    """Update order status"""
    if order_id not in orders_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order {order_id} not found"
        )
    
    existing = orders_db[order_id]
    orders_db[order_id] = {
        **existing,
        **order_update,
        "updated_at": datetime.now().isoformat(),
    }
    
    return orders_db[order_id]

@router.delete("/{order_id}")
async def cancel_order(order_id: str):
    """Cancel an order"""
    if order_id not in orders_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order {order_id} not found"
        )
    
    orders_db[order_id]["status"] = "cancelled"
    orders_db[order_id]["updated_at"] = datetime.now().isoformat()
    
    return {"message": f"Order {order_id} cancelled"}
