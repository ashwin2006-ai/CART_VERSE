# CartVerse Backend Setup Guide

## 🚀 Quick Setup (Windows)

### Step 1: Navigate to Backend
```powershell
cd backend
```

### Step 2: Run Setup Script
```powershell
.\run.bat
```

This will:
- ✅ Create Python virtual environment (if needed)
- ✅ Activate virtual environment
- ✅ Install all dependencies from `requirements.txt`
- ✅ Start FastAPI server on `http://localhost:8000`

### That's it! 🎉

---

## 🐧 Linux/Mac Setup

```bash
cd backend
chmod +x run.sh
./run.sh
```

---

## 📋 Manual Setup (if scripts don't work)

### 1. Create Virtual Environment
```powershell
python -m venv venv
.\venv\Scripts\activate
```

### 2. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 3. Start Server
```powershell
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

## 🔍 Verify Setup

Open these URLs:

1. **API Health**: http://localhost:8000/health
2. **Interactive Docs**: http://localhost:8000/docs
3. **API Schema**: http://localhost:8000/openapi.json

### Expected Response (Health Check):
```json
{
  "status": "healthy",
  "service": "CartVerse Backend",
  "version": "1.0.0"
}
```

---

## 📚 Available API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `PUT /api/orders/{id}` - Update order
- `DELETE /api/orders/{id}` - Cancel order

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user
- `POST /api/users` - Create user
- `PUT /api/users/{id}` - Update user

### Auth
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/verify-token` - Verify JWT

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/system-status` - System health
- `GET /api/admin/analytics` - Analytics data
- `POST /api/admin/backup` - Create backup

---

## 🔐 Test Admin Login

Use Swagger UI at http://localhost:8000/docs

1. Click on `POST /api/auth/login`
2. Click "Try it out"
3. Enter credentials:
```json
{
  "email": "admin@cartverse.io",
  "password": "Admin@2026!"
}
```
4. Click "Execute"

---

## 🛠 Directory Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app
│   ├── models/                 # Pydantic models
│   │   ├── __init__.py
│   │   ├── product.py         # Product models
│   │   ├── order.py           # Order models
│   │   └── user.py            # User models
│   └── routes/                # API routes
│       ├── __init__.py
│       ├── auth.py            # Auth endpoints
│       ├── products.py        # Product endpoints
│       ├── orders.py          # Order endpoints
│       ├── users.py           # User endpoints
│       └── admin.py           # Admin endpoints
├── requirements.txt           # Python dependencies
├── .env                       # Environment variables
├── .gitignore                # Git ignore rules
├── run.bat                    # Windows run script
├── run.sh                     # Linux/Mac run script
├── Dockerfile                 # Docker configuration
└── README.md                  # Backend documentation
```

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| **fastapi** | Web framework |
| **uvicorn** | ASGI server |
| **pydantic** | Data validation |
| **PyJWT** | JWT authentication |
| **python-dotenv** | Environment variables |
| **sqlalchemy** | Database ORM |
| **pytest** | Testing framework |

---

## 🚀 Running in Production

### Using Gunicorn
```bash
pip install gunicorn
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Using Docker
```bash
docker build -t cartverse-backend .
docker run -p 8000:8000 cartverse-backend
```

---

## 🔗 Frontend Integration

Frontend is configured to proxy `/api` calls to backend:

- **Frontend Port**: 3000
- **Backend Port**: 8000
- **Proxy Target**: `http://localhost:8000`

### Vite Proxy Configuration (src/vite.config.js):
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true
  }
}
```

---

## 📝 Environment Variables

Check `.env` file for configuration:

```env
ENVIRONMENT=development
HOST=0.0.0.0
PORT=8000
JWT_SECRET=your-super-secret-key
DATABASE_URL=sqlite:///./cartverse.db
```

---

## 🧪 Testing

Run tests:
```bash
pytest
```

Run with coverage:
```bash
pytest --cov=app
```

---

## 📞 Troubleshooting

### Issue: "Module not found" errors
**Solution**: Make sure virtual environment is activated
```powershell
.\venv\Scripts\activate
```

### Issue: Port 8000 already in use
**Solution**: Use different port
```powershell
python -m uvicorn app.main:app --reload --port 8001
```

### Issue: Virtual environment won't activate
**Solution**: Create fresh environment
```powershell
rm -r venv
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

---

## 📖 API Documentation

Once server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

---

## ✅ Checklist

- [ ] Python 3.9+ installed
- [ ] Backend directory created with all files
- [ ] Virtual environment created and activated
- [ ] Dependencies installed (`requirements.txt`)
- [ ] `.env` file configured
- [ ] Server running on port 8000
- [ ] Health check passes
- [ ] Can access API docs at `/docs`
- [ ] Frontend can proxy to backend
- [ ] Admin login works with test credentials

---

**🎉 Backend is ready! Start coding!**
