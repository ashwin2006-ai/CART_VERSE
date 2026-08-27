# CartVerse Backend API

Professional e-commerce backend built with FastAPI and Python.

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- pip (Python package manager)

### Installation

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Run development server:**
```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Server will start at: `http://localhost:8000`

## 📚 API Documentation

Once running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **OpenAPI JSON:** http://localhost:8000/openapi.json

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app entry point
│   ├── models/              # Pydantic models
│   │   ├── product.py
│   │   ├── order.py
│   │   ├── user.py
│   │   └── __init__.py
│   └── routes/              # API routes
│       ├── products.py      # Product endpoints
│       ├── orders.py        # Order endpoints
│       ├── users.py         # User endpoints
│       ├── auth.py          # Auth endpoints
│       ├── admin.py         # Admin endpoints
│       └── __init__.py
├── requirements.txt         # Python dependencies
├── .env                     # Environment variables
└── README.md               # This file
```

## 🔌 API Endpoints

### Products
- `GET /api/products` - Get all products (with pagination & filtering)
- `GET /api/products/{id}` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/{id}` - Update product (admin)
- `DELETE /api/products/{id}` - Delete product (admin)

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/{id}` - Get order details
- `POST /api/orders` - Create order
- `PUT /api/orders/{id}` - Update order
- `DELETE /api/orders/{id}` - Cancel order

### Users
- `GET /api/users` - Get all users (admin)
- `GET /api/users/{id}` - Get user profile
- `POST /api/users` - Create user
- `PUT /api/users/{id}` - Update profile
- `DELETE /api/users/{id}` - Delete account

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/verify-token` - Verify JWT

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/system-status` - System health
- `GET /api/admin/analytics` - Analytics data
- `POST /api/admin/backup` - Create backup

## 🔐 Admin Credentials

**Development:**
- Email: `admin@cartverse.io`
- Password: `Admin@2026!`

**Alternative:**
- Email: `ashwin@cartverse.io`
- Password: `Ashwin@123!`

## 📦 Dependencies

- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI web server
- **Pydantic** - Data validation
- **PyJWT** - JWT authentication
- **SQLAlchemy** - ORM (for database)
- **PyMongo** - MongoDB driver
- **pytest** - Testing framework

## 🧪 Testing

Run tests:
```bash
pytest
```

Run with coverage:
```bash
pytest --cov=app
```

## 📝 Environment Variables

Create `.env` file:
```env
ENVIRONMENT=development
PORT=8000
JWT_SECRET=your-secret-key
DATABASE_URL=sqlite:///cartverse.db
```

## 🚀 Deployment

### Production Build
```bash
pip install gunicorn
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Docker
```bash
docker build -t cartverse-backend .
docker run -p 8000:8000 cartverse-backend
```

## 📝 Development Tips

1. **Hot Reload**: Use `--reload` flag during development
2. **Debug Mode**: Set `DEBUG=True` in `.env`
3. **CORS**: Configured for frontend on port 3000
4. **Logging**: Check console for detailed logs

## 🤝 Integration with Frontend

Frontend is configured to proxy API calls to backend:
- Frontend runs on: `http://localhost:3000`
- Backend runs on: `http://localhost:8000`
- Proxy target: `http://localhost:8000`

## 📞 Support

For issues or questions, check the logs in console or refer to FastAPI docs.

## 📄 License

CartVerse - All Rights Reserved
