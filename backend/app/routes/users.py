"""Users routes"""

from fastapi import APIRouter, HTTPException, status
import uuid
from datetime import datetime

router = APIRouter()

# Mock data storage (replace with database)
users_db = {}

@router.get("")
async def get_users():
    """Get all users (admin only)"""
    return list(users_db.values())

@router.get("/{user_id}")
async def get_user(user_id: str):
    """Get user profile"""
    if user_id not in users_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User {user_id} not found"
        )
    return users_db[user_id]

@router.post("")
async def create_user(user_data: dict):
    """Create a new user"""
    user_id = f"usr-{uuid.uuid4().hex[:8]}"
    now = datetime.now().isoformat()
    
    new_user = {
        "id": user_id,
        "addresses": [],
        **user_data,
        "created_at": now,
        "updated_at": now,
    }
    
    users_db[user_id] = new_user
    return new_user

@router.put("/{user_id}")
async def update_user(user_id: str, user_update: dict):
    """Update user profile"""
    if user_id not in users_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User {user_id} not found"
        )
    
    existing = users_db[user_id]
    users_db[user_id] = {
        **existing,
        **user_update,
        "updated_at": datetime.now().isoformat(),
    }
    
    return users_db[user_id]

@router.delete("/{user_id}")
async def delete_user(user_id: str):
    """Delete user account"""
    if user_id not in users_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User {user_id} not found"
        )
    
    del users_db[user_id]
    return {"message": f"User {user_id} deleted"}
