"""Routes package for CartVerse"""

from app.routes import products
from app.routes import orders
from app.routes import users
from app.routes import auth
from app.routes import admin

__all__ = ["products", "orders", "users", "auth", "admin"]
