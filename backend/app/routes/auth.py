"""Authentication routes"""

from fastapi import APIRouter, HTTPException, status
from typing import Optional
import jwt
import os
from datetime import datetime, timedelta

router = APIRouter()

# Mock credentials
DEMO_CREDENTIALS = {
    "admin@cartverse.io": "Admin@2026!",
    "ashwin@cartverse.io": "Ashwin@123!"
}

SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
ALGORITHM = "HS256"

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=24)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/login")
async def login(credentials: dict):
    """Admin login endpoint"""
    email = credentials.get("email")
    password = credentials.get("password")
    
    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email and password required"
        )
    
    # Check credentials
    if email not in DEMO_CREDENTIALS or DEMO_CREDENTIALS[email] != password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create token
    access_token = create_access_token(
        data={"sub": email, "type": "admin"}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "email": email,
        "user": {
            "email": email,
            "role": "admin"
        }
    }

@router.post("/logout")
async def logout():
    """Logout endpoint"""
    return {"message": "Logged out successfully"}

@router.post("/verify-token")
async def verify_token(token: dict):
    """Verify JWT token"""
    try:
        token_str = token.get("token")
        if not token_str:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Token required"
            )
        
        payload = jwt.decode(token_str, SECRET_KEY, algorithms=[ALGORITHM])
        return {
            "valid": True,
            "payload": payload
        }
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
