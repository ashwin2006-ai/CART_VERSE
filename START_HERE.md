# 🚀 CartVerse - Start Here!

## Quick Start (5 Minutes)

### Terminal 1: Install & Start Backend
```powershell
cd c:\Users\Ashwin\OneDrive\Desktop\e-commerce
npm install
npm run server
```

**Wait for:** `postgresql pool with X connections`

---

### Terminal 2: Start Frontend
```powershell
npm run dev
```

**Wait for:** `dev server running at http://localhost:3000`

---

### Terminal 3: (Optional) Seed Data
```powershell
npx prisma db push
node server/scripts/seed.js
```

---

## Open in Browser

### Visit: http://localhost:3000

You should see:
- ✅ Products on home page
- ✅ Categories
- ✅ Search bar
- ✅ Add to cart

---

## What If It Doesn't Work?

### ❌ "Can't reach database server"
**Solution:** Using mock data (fallback mode). Products will still work!

### ❌ "Port 5000 already in use"
```powershell
Get-Process node | Stop-Process -Force
npm run server
```

### ❌ No products showing
1. Check browser console (F12)
2. Check backend logs
3. Verify `.env` file exists

---

## Full Documentation

- **CONNECT_SUPABASE_STEPS.md** - Complete connection guide (Step by step)
- **SUPABASE_VISUAL_GUIDE.md** - Visual diagrams and flowcharts
- **DATABASE_FALLBACK_GUIDE.md** - How mock data works
- **QUICK_START.md** - Quick reference

---

## File Overview

| File | Purpose |
|------|---------|
| `.env` | Configuration (Database URL) |
| `server/server.js` | Backend entry point |
| `src/App.jsx` | Frontend entry point |
| `prisma/schema.prisma` | Database schema |
| `package.json` | Dependencies & scripts |

---

## Key Ports

- **3000** - Frontend (http://localhost:3000)
- **5000** - Backend API (http://localhost:5000)
- **5432** - Database (Supabase, remote)

---

## Ready? 

```powershell
npm install
npm run server    # Terminal 1
npm run dev       # Terminal 2
```

Visit: http://localhost:3000 🎉

---

## Need Help?

1. Read: CONNECT_SUPABASE_STEPS.md
2. Check: Browser console (F12)
3. Check: Backend logs (Terminal 1)

---

**That's it! You're ready to develop! 🚀**
