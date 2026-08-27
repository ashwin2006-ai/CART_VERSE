"""Admin routes"""

from fastapi import APIRouter, HTTPException, status
from datetime import datetime

router = APIRouter()

@router.get("/dashboard")
async def get_dashboard():
    """Get admin dashboard statistics"""
    return {
        "stats": {
            "total_users": 1250,
            "total_products": 450,
            "total_orders": 3420,
            "revenue": 1250000.50,
            "pending_orders": 45
        },
        "recent_orders": [],
        "top_products": [],
        "generated_at": datetime.now().isoformat()
    }

@router.get("/system-status")
async def get_system_status():
    """Get system status and health"""
    return {
        "status": "healthy",
        "database": {
            "connected": True,
            "latency_ms": 2.5
        },
        "cache": {
            "connected": True,
            "items": 1024
        },
        "api": {
            "requests_per_second": 125,
            "error_rate": 0.02
        },
        "collections": {
            "products": 450,
            "users": 1250,
            "orders": 3420,
            "reviews": 5680
        },
        "uptime_hours": 720,
        "last_backup": datetime.now().isoformat()
    }

@router.get("/analytics")
async def get_analytics():
    """Get analytics data"""
    return {
        "sales": {
            "today": 45000,
            "this_week": 280000,
            "this_month": 1200000
        },
        "customers": {
            "active": 850,
            "new_this_month": 120,
            "retention_rate": 0.92
        },
        "products": {
            "total": 450,
            "low_stock": 12,
            "out_of_stock": 3
        }
    }

@router.post("/backup")
async def create_backup():
    """Create system backup"""
    return {
        "message": "Backup initiated",
        "backup_id": "bak-123456",
        "status": "in_progress",
        "estimated_time": "5 minutes"
    }
