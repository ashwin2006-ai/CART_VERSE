"""Products routes"""

from fastapi import APIRouter, Query, HTTPException, status
from typing import Optional
import uuid
from datetime import datetime

router = APIRouter()

# Mock data storage (replace with database)
products_db = {
    "prod-1": {
        "id": "prod-1",
        "name": "Premium Wireless Headphones",
        "description": "High-quality wireless headphones with noise cancellation",
        "price": 4999,
        "category": "Electronics",
        "stock": 50,
        "rating": 4.5,
        "discount": 20,
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=60",
        "featured": True,
        "best_seller": True,
        "is_new": False,
        "deal_of_the_day": False,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
    }
}

@router.get("")
async def get_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort_by: Optional[str] = Query("featured", regex="^(featured|price|rating|newest)$")
):
    """Get all products with filtering and pagination"""
    products_list = list(products_db.values())
    
    # Filter by category
    if category:
        products_list = [p for p in products_list if p["category"].lower() == category.lower()]
    
    # Filter by price range
    if min_price is not None:
        products_list = [p for p in products_list if p["price"] >= min_price]
    if max_price is not None:
        products_list = [p for p in products_list if p["price"] <= max_price]
    
    # Sort
    if sort_by == "price":
        products_list.sort(key=lambda x: x["price"])
    elif sort_by == "rating":
        products_list.sort(key=lambda x: x["rating"], reverse=True)
    elif sort_by == "newest":
        products_list.sort(key=lambda x: x["created_at"], reverse=True)
    
    total = len(products_list)
    items = products_list[skip:skip + limit]
    
    return {
        "items": items,
        "total": total,
        "page": skip // limit,
        "page_size": limit,
        "has_more": (skip + limit) < total
    }

@router.get("/{product_id}")
async def get_product(product_id: str):
    """Get a single product by ID"""
    if product_id not in products_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product {product_id} not found"
        )
    return products_db[product_id]

@router.post("")
async def create_product(product: dict):
    """Create a new product (admin only)"""
    product_id = f"prod-{uuid.uuid4().hex[:8]}"
    now = datetime.now().isoformat()
    
    new_product = {
        "id": product_id,
        **product,
        "created_at": now,
        "updated_at": now,
    }
    
    products_db[product_id] = new_product
    return new_product

@router.put("/{product_id}")
async def update_product(product_id: str, product: dict):
    """Update a product (admin only)"""
    if product_id not in products_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product {product_id} not found"
        )
    
    existing = products_db[product_id]
    products_db[product_id] = {
        **existing,
        **product,
        "id": product_id,
        "created_at": existing["created_at"],
        "updated_at": datetime.now().isoformat(),
    }
    
    return products_db[product_id]

@router.delete("/{product_id}")
async def delete_product(product_id: str):
    """Delete a product (admin only)"""
    if product_id not in products_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product {product_id} not found"
        )
    
    del products_db[product_id]
    return {"message": f"Product {product_id} deleted"}
