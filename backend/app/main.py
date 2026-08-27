"""
CartVerse Backend - Main Application Entry Point
FastAPI-based REST API for e-commerce platform
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZIPMiddleware
import logging
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Import routes
from app.routes import products, orders, users, auth, admin

# Lifespan context manager for startup/shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("🚀 CartVerse Backend Starting...")
    logger.info("Environment: %s", os.getenv("ENVIRONMENT", "development"))
    yield
    # Shutdown
    logger.info("🛑 CartVerse Backend Shutting Down...")

# Initialize FastAPI app
app = FastAPI(
    title="CartVerse API",
    description="Professional E-commerce Backend API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware - Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5000",
        "https://e-commerce-virid-delta.vercel.app",
        "https://cartverse.app",
        os.getenv("FRONTEND_URL", "http://localhost:3000")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GZIP Middleware for response compression
app.add_middleware(GZIPMiddleware, minimum_size=1000)

# Health Check Endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "CartVerse Backend",
        "version": "1.0.0"
    }

# Root Endpoint
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint - API information"""
    return {
        "message": "Welcome to CartVerse Backend API",
        "docs": "/docs",
        "openapi": "/openapi.json"
    }

# Include Routes
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])

# Error Handlers
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return {
        "error": "Internal Server Error",
        "message": str(exc),
        "status": 500
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 5000)),
        reload=os.getenv("ENVIRONMENT") == "development"
    )
