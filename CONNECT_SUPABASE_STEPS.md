# 🔗 Connect CartVerse Backend to Supabase - Complete Steps

## Your Current Setup

```
Project: CartVerse E-Commerce
Backend: Node.js + Express + Prisma ORM
Database: Supabase PostgreSQL
Frontend: React + Vite
```

---

## ✅ STEP 1: Verify Supabase Account

### 1.1 Go to Supabase
- Open: https://app.supabase.com
- Log in with your account

### 1.2 Find Your Project
- Look for project ID: **yjzkfwyattiibfgnngiv**
- If not visible, create a new project

### 1.3 Note Your Connection Details
**Your credentials (already in .env):**
```
Host: db.yjzkfwyattiibfgnngiv.supabase.co
User: postgres
Password: Ashunila@2005
Database: postgres
Port: 5432
```

---

## ✅ STEP 2: Verify DATABASE_URL in .env

### 2.1 Open `.env` file in your editor
Location: `c:\Users\Ashwin\OneDrive\Desktop\e-commerce\.env`

### 2.2 Check DATABASE_URL
Should look like this:
```env
DATABASE_URL="postgresql://postgres:Ashunila@2005@db.yjzkfwyattiibfgnngiv.supabase.co:5432/postgres?schema=public"
```

### 2.3 If it's different
Update it to:
```env
DATABASE_URL="postgresql://postgres:Ashunila@2005@db.yjzkfwyattiibfgnngiv.supabase.co:5432/postgres?schema=public"
```

✅ Save the file (Ctrl+S)

---

## ✅ STEP 3: Install Dependencies

### 3.1 Open Terminal/PowerShell
Navigate to your project:
```powershell
cd c:\Users\Ashwin\OneDrive\Desktop\e-commerce
```

### 3.2 Install npm packages
```powershell
npm install
```

**Expected output:**
```
added 172 packages
found 0 vulnerabilities
```

---

## ✅ STEP 4: Generate Prisma Client

### 4.1 Run Prisma generate command
```powershell
npx prisma generate
```

**Expected output:**
```
✔ Generated Prisma Client
```

**If you get errors:** (Skip for now, continue to Step 5)

---

## ✅ STEP 5: Sync Database Schema

### 5.1 Push your schema to Supabase
```powershell
npx prisma db push
```

**Expected output:**
```
✔ Your database is now in sync with your schema
```

This creates all necessary tables in Supabase PostgreSQL:
- ✅ User table
- ✅ Product table
- ✅ Category table
- ✅ Order table
- ✅ Cart table
- ✅ Wishlist table
- ✅ Review table
- ✅ And more...

---

## ✅ STEP 6: Seed Sample Data (Optional)

### 6.1 Run the seed script
This populates your Supabase with sample products and categories:

```powershell
node server/scripts/seed.js
```

**Expected output:**
```
✅ Seeding data...
✅ 7 categories created
✅ 10 products created
✅ Data seeded successfully!
```

---

## ✅ STEP 7: Start Backend Server

### 7.1 Run the backend
```powershell
npm run server
```

**Expected output:**
```
prisma:info Starting a postgresql pool with 17 connections.
🚀 CartVerse Backend Server Started
✓ Environment: development
✓ Server: http://0.0.0.0:5000
✓ Database: PostgreSQL (Supabase)
✓ Version: 2.1.0
⚡ Loaded 9 routes
```

✅ **If you see this, Supabase is connected!**

❌ **If you see this:**
```
prisma:error Can't reach database server at `db.yjzkfwyattiibfgnngiv.supabase.co:5432`
```

Then skip to **Troubleshooting** section below.

---

## ✅ STEP 8: Test API Endpoints

### 8.1 Open new PowerShell terminal

Keep Step 7 running in first terminal.

### 8.2 Test health check
```powershell
curl http://localhost:5000/api/health
```

**Expected response:**
```json
{
  "success": true,
  "message": "API is healthy",
  "timestamp": "2026-09-02T04:35:00Z"
}
```

### 8.3 Test products endpoint
```powershell
curl http://localhost:5000/api/products
```

**Expected response:**
```json
{
  "success": true,
  "count": 10,
  "total": 10,
  "data": [...],
  "source": "database"
}
```

**Key indicator:** `"source": "database"` means it's using Supabase!

### 8.4 Test categories
```powershell
curl http://localhost:5000/api/categories
```

**Expected response:**
```json
{
  "success": true,
  "data": [
    {"id": "mobiles", "name": "Mobiles", "slug": "mobiles", "count": 5},
    ...
  ],
  "source": "database"
}
```

---

## ✅ STEP 9: Start Frontend

### 9.1 Open third terminal
Keep both previous terminals running.

### 9.2 Start React development server
```powershell
npm run dev
```

**Expected output:**
```
VITE v... dev server running at:
http://localhost:3000/
```

---

## ✅ STEP 10: Test Complete App

### 10.1 Open browser
Go to: http://localhost:3000

### 10.2 Verify everything works
- ✅ Home page loads
- ✅ Products display from Supabase
- ✅ Categories visible
- ✅ Search works
- ✅ Filters work
- ✅ Add to cart works
- ✅ Login/Register works

### 10.3 Check browser console
- Open DevTools: F12
- Go to **Console** tab
- Should NOT see red errors

---

## 🔍 Troubleshooting

### Problem 1: "Can't reach database server"

**Step 1:** Check internet connection
- Make sure you're online

**Step 2:** Check network/firewall
- Ensure port 5432 is not blocked
- Try disabling firewall temporarily
- Try using a VPN

**Step 3:** Verify credentials
- Go to Supabase dashboard
- Settings → Database
- Copy exact connection string
- Update `.env` file

**Step 4:** Test connection manually
```powershell
# Using psql (if installed)
psql -h db.yjzkfwyattiibfgnngiv.supabase.co -U postgres -d postgres

# Or test with curl
Test-NetConnection -ComputerName db.yjzkfwyattiibfgnngiv.supabase.co -Port 5432
```

### Problem 2: "Password authentication failed"

**Solution:**
1. Go to Supabase dashboard
2. Settings → Database → Reset Password
3. Update DATABASE_URL in `.env`
4. Restart backend: `npm run server`

### Problem 3: Node modules errors

**Solution:**
```powershell
# Clear cache
npm cache clean --force

# Remove node_modules
Remove-Item -Recurse -Force node_modules

# Reinstall
npm install

# Try again
npm run server
```

### Problem 4: Port 5000 already in use

**Solution:**
```powershell
# Kill Node processes
Get-Process node | Stop-Process -Force

# Wait 5 seconds
Start-Sleep 5

# Try again
npm run server
```

### Problem 5: Prisma generation fails

**Solution:**
```powershell
# Force regenerate
Remove-Item -Recurse -Force node_modules\.prisma

# Reinstall
npm install

# Generate
npx prisma generate
```

---

## 🗂️ What Each File Does

| File | Purpose |
|------|---------|
| `.env` | Configuration (DATABASE_URL, JWT_SECRET, etc.) |
| `prisma/schema.prisma` | Database schema definition |
| `server/server.js` | Backend entry point |
| `server/controllers/*` | API logic |
| `server/routes/*` | API endpoints |
| `server/scripts/seed.js` | Sample data seeding |
| `src/App.jsx` | Frontend entry point |
| `vite.config.js` | Frontend build config |

---

## 📊 Database Architecture

Your Supabase database will have these tables:

```
┌─────────────────┐
│      User       │  (Customers & Admins)
├─────────────────┤
│ id (Primary)    │
│ email (Unique)  │
│ password        │
│ name            │
│ role            │
│ createdAt       │
└─────────────────┘
        ↓
┌─────────────────┐     ┌──────────────┐
│      Cart       │ ←─→ │   Product    │
├─────────────────┤     ├──────────────┤
│ id              │     │ id           │
│ userId (FK)     │     │ name         │
│ productId (FK)  │     │ price        │
│ quantity        │     │ category     │
│ addedAt         │     │ images       │
└─────────────────┘     └──────────────┘
        ↓
┌─────────────────┐     ┌──────────────┐
│      Order      │ ←─→ │   Category   │
├─────────────────┤     ├──────────────┤
│ id              │     │ id           │
│ userId (FK)     │     │ name         │
│ total           │     │ slug         │
│ status          │     │ icon         │
│ items[]         │     └──────────────┘
└─────────────────┘
        ↓
┌─────────────────┐     ┌──────────────┐
│    Wishlist     │ ←─→ │   Review     │
├─────────────────┤     ├──────────────┤
│ id              │     │ id           │
│ userId (FK)     │     │ productId    │
│ productId (FK)  │     │ userId       │
│ addedAt         │     │ rating       │
└─────────────────┘     │ comment      │
                        └──────────────┘
```

---

## ✅ Quick Reference

### Files You Need:
- ✅ `.env` - Database URL configured
- ✅ `prisma/schema.prisma` - Database tables defined
- ✅ `server/server.js` - Backend running
- ✅ `src/App.jsx` - Frontend running

### Commands You Need:
```powershell
npm install              # Install dependencies
npx prisma generate     # Generate client
npx prisma db push      # Sync schema to DB
node server/scripts/seed.js  # Add sample data
npm run server          # Start backend
npm run dev             # Start frontend
```

### Ports You Need:
- `3000` - Frontend
- `5000` - Backend API
- `5432` - Supabase Database (remote)

---

## 🎯 Success Checklist

✅ You see: `"source": "database"` in API responses
✅ Backend logs show: `Starting a postgresql pool`
✅ Frontend loads products from database
✅ No errors in browser console
✅ Database is synced (tables created)
✅ Sample data populated (10 products visible)

**If all ✅, you're connected to Supabase!**

---

## 🚀 Next Steps

1. ✅ Follow steps 1-10 above
2. ✅ Verify connection works
3. ✅ Start building features
4. ✅ Deploy to production when ready

---

## 📞 Emergency: Use Mock Data Instead

If Supabase won't connect, the backend automatically falls back to mock data:

```json
{
  "success": true,
  "data": [...],
  "source": "mock-data",
  "note": "Using mock data - database unavailable"
}
```

This lets you develop without database access. When you fix the connection, it will automatically use Supabase!

---

## 💾 Need to Change Database Later?

To use a different Supabase project:

1. Go to https://app.supabase.com
2. Create new project or select existing one
3. Get connection string from Settings → Database
4. Update DATABASE_URL in `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?schema=public"
   ```
5. Restart backend:
   ```powershell
   npm run server
   ```

---

**You're all set! Follow the steps above and your CartVerse will be connected to Supabase! 🎉**
