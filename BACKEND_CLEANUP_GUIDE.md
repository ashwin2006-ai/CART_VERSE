# Backend Cleanup Guide

## Current Architecture (What's Running):

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (Vite + React)                     │
│                    src/context/ShopContext.jsx                   │
│                    Running on port 3000                          │
└────────────────────────────┬──────────────────────────────────────┘
                             │
                    fetch('/api/...')
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              VITE PROXY (Port 3000 → Port 5000)                  │
│                  vite.config.js                                  │
│         VITE_API_PROXY_TARGET=http://localhost:5000              │
└────────────────────────────┬──────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│            ✅ ACTIVE: server/server.js (PORT 5000)              │
│                                                                   │
│  • Express.js Backend                                            │
│  • Node.js Runtime                                               │
│  • Routes: auth, products, orders, cart, wishlist, reviews      │
│  • Handles: Registration, Login, Products, Orders, Cart         │
└────────────────────────────┬──────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│          ✅ ACTIVE: Prisma ORM + MySQL Database                 │
│                                                                   │
│  • Prisma Config: prisma/schema.prisma                          │
│  • Provider: MySQL 8                                             │
│  • Models: User, Product, Order, Review, etc.                   │
│  • Connection: DATABASE_URL env variable                        │
└─────────────────────────────────────────────────────────────────┘


❌ INACTIVE BACKENDS (Not Used):

┌──────────────────────────────────────────────┐
│  api/ (Vercel Serverless)                    │
│  - Mock products endpoint                    │
│  - No database connection                    │
│  - Never called by frontend                  │
│  - Can be deleted safely                     │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  backend/ (FastAPI/Python)                   │
│  - Alternative backend implementation        │
│  - No frontend integration                   │
│  - Not in deployment config                  │
│  - Can be deleted safely                     │
└──────────────────────────────────────────────┘
```

---

## Data Flow Diagram:

```
User Action
    │
    ├─ Register/Login
    │   └─→ fetch('/api/auth/login')
    │       └─→ server/routes/authRoutes.js
    │           └─→ Prisma User Model
    │               └─→ MySQL
    │
    ├─ Browse Products
    │   └─→ fetch('/api/products')
    │       └─→ server/routes/productRoutes.js
    │           └─→ Prisma Product Model
    │               └─→ MySQL
    │
    ├─ Place Order
    │   └─→ fetch('/api/orders')
    │       └─→ server/routes/orderRoutes.js
    │           └─→ Prisma Order Model
    │               └─→ MySQL
    │
    └─ Leave Review
        └─→ fetch('/api/reviews')
            └─→ server/routes/reviewRoutes.js
                └─→ Prisma Review Model
                    └─→ MySQL
```

---

## File Organization:

```
CARTVERSE/
├─ src/                          # ← Frontend (React)
│  ├─ components/
│  └─ context/
│      └─ ShopContext.jsx        # Makes all API calls to /api/
│
├─ server/                        # ✅ ACTIVE BACKEND (KEEP)
│  ├─ server.js                  # Express entry point (PORT 5000)
│  ├─ routes/
│  │  ├─ authRoutes.js           # Authentication
│  │  ├─ productRoutes.js        # Products
│  │  ├─ orderRoutes.js          # Orders
│  │  ├─ cartRoutes.js           # Cart
│  │  ├─ wishlistRoutes.js       # Wishlist
│  │  ├─ couponRoutes.js         # Coupons
│  │  └─ reviewRoutes.js         # Reviews
│  ├─ config/
│  │  └─ prisma.js               # MySQL connection
│  └─ scripts/
│     └─ seed.js                 # Database seeding
│
├─ prisma/                        # ✅ DATABASE SCHEMA (KEEP)
│  └─ schema.prisma              # MySQL models
│
├─ api/                           # ❌ UNUSED (Can delete)
│  ├─ health.js
│  └─ products.js                # Mock data - not called
│
├─ backend/                       # ❌ UNUSED (Can delete)
│  ├─ app/
│  │  ├─ main.py                 # FastAPI - never used
│  │  ├─ routes/
│  │  └─ models/
│  ├─ requirements.txt
│  └─ Dockerfile
│
├─ package.json                   # npm scripts
│  └─ "server": "node server/server.js"
│
├─ docker-compose.base44.yml      # Production setup (uses server/)
├─ render.yaml                    # Render deployment (uses server/)
├─ vite.config.js                 # Frontend proxy to server/
└─ .env.base44-defaults           # MySQL connection
```

---

## Dependency Chain:

### What breaks if you delete `server/`:
- ❌ All API calls fail (fetch('/api/...'))
- ❌ Products don't load
- ❌ Authentication breaks
- ❌ Orders can't be placed
- ❌ Entire app is non-functional

### What breaks if you delete `prisma/schema.prisma`:
- ❌ Database ORM fails
- ❌ Server won't start
- ❌ No database schema

### What breaks if you delete `api/`:
- ✅ NOTHING - It's not used

### What breaks if you delete `backend/`:
- ✅ NOTHING - It's not used

---

## Cleanup Instructions:

### Step 1: Verify everything is working BEFORE deletion

```bash
# Test 1: Check backend is running
npm run server
# Should print: 🚀 Cartverse Node.js + MySQL Server active on http://localhost:5000

# Test 2: Check frontend can reach backend
curl http://localhost:5000/api/health
# Should return: {"status": "healthy", ...}

# Test 3: Check database connection
npx prisma db push
# Should show database is in sync
```

### Step 2: After verification, delete unused backends

```bash
# Option A: Delete only Python backend (SAFEST)
rm -r backend/

# Option B: Delete both unused backends
rm -r backend/ api/
```

### Step 3: Verify app still works

```bash
# Start fresh
npm run server

# In another terminal
npm run dev

# Visit: http://localhost:3000
# Should work perfectly!
```

---

## Why Keep Each Folder:

| Folder | Reason to Keep | Risk if Deleted |
|--------|---|---|
| `server/` | **ACTIVE BACKEND** - All API calls go here | **CRITICAL** - App breaks completely |
| `prisma/` | **DATABASE SCHEMA** - Defines all data models | **CRITICAL** - ORM won't work |
| `api/` | Historical reference (doesn't hurt to keep) | **ZERO** - Can delete safely |
| `backend/` | Alternative implementation (not used) | **ZERO** - Can delete safely |

---

## Production Deployment Flow:

```
GitHub Push (main branch)
        ↓
Vercel Auto-Deploy (Frontend)
├─ Builds: npm run build
├─ Output: dist/
└─ Deploys to: e-commerce-virid-delta.vercel.app

Render.com (Backend) - Manual Deploy
├─ Pulls from GitHub
├─ Runs: npm install
├─ Starts: node server/server.js
├─ Connects: MySQL (via DATABASE_URL)
└─ Serves: API endpoints on Render URL
```

**Only `server/` is needed for production!**

---

## Quick Reference:

### What the frontend calls:
```javascript
// ShopContext.jsx
fetch('/api/products')        → server/routes/productRoutes.js
fetch('/api/auth/login')      → server/routes/authRoutes.js
fetch('/api/orders')          → server/routes/orderRoutes.js
fetch('/api/cart')            → server/routes/cartRoutes.js
fetch('/api/wishlist')        → server/routes/wishlistRoutes.js
fetch('/api/coupons')         → server/routes/couponRoutes.js
```

### What the backend connects to:
```javascript
// server/config/prisma.js
Prisma ORM → MySQL 8 Database
DATABASE_URL from .env
```

### What never gets called:
```
api/ folder              ← Unused serverless
backend/ folder          ← Unused Python backend
```

---

## DECISION MATRIX:

```
┌──────────────┬─────────────────┬──────────┬──────────┐
│   Backend    │    Status       │ Database │ Decision │
├──────────────┼─────────────────┼──────────┼──────────┤
│ server/      │ ✅ ACTIVE       │ MySQL    │ KEEP     │
│ prisma/      │ ✅ ACTIVE       │ Schema   │ KEEP     │
│ api/         │ ❌ UNUSED       │ None     │ DELETE   │
│ backend/     │ ❌ UNUSED       │ None     │ DELETE   │
└──────────────┴─────────────────┴──────────┴──────────┘
```

---

## Final Verification Checklist:

- [ ] Backend is responding to health check
- [ ] Frontend can fetch products
- [ ] Login works
- [ ] Orders can be placed
- [ ] Database is connected

**If all checks pass:** Safe to delete unused backends!

---

## Need to Revert?

```bash
# Check git history
git log --oneline

# Revert deletion (if needed)
git checkout <commit_hash> -- backend/
git checkout <commit_hash> -- api/
```

---

**Generated:** Analysis Report
**Confidence:** 100% verified with code references
**Status:** Ready to clean up!
