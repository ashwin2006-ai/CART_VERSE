# 🚀 CartVerse - Quick Start Guide

## Current Situation
- ❌ Docker is NOT installed on your system
- ✅ You have Supabase PostgreSQL already configured
- ✅ Backend is ready to connect to Supabase

## Two Options to Get Running

---

## ✅ OPTION 1: Use Supabase (Faster - Recommended)

**No Docker installation needed! Your `.env` file is already configured with Supabase.**

### Step 1: Start Frontend
```powershell
npm run dev
```
Opens at: http://localhost:3000

### Step 2: Start Backend (in new terminal)
```powershell
npm run server
```
Backend running at: http://localhost:5000

### Step 3: Verify It Works
- Frontend: http://localhost:3000
- API Health: http://localhost:5000/api/health
- Products API: http://localhost:5000/api/products

**That's it! You're done.** 🎉

---

## 🐳 OPTION 2: Install Docker (For Full Local Stack)

If you prefer a complete local development environment with everything containerized:

1. **Download Docker Desktop:**
   https://www.docker.com/products/docker-desktop

2. **Install it** and restart your computer

3. **Run services:**
   ```powershell
   docker-compose -f docker-compose.base44.yml up -d
   ```

4. **Access:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - Database: MySQL on port 3306

---

## Current Setup (Supabase)

### What's Configured:
- ✅ **Database:** Supabase PostgreSQL
  - Host: db.yjzkfwyattiibfgnngiv.supabase.co
  - User: postgres
  - Database: postgres

- ✅ **Backend:** Node.js/Express
  - Port: 5000
  - Environment: Development

- ✅ **Frontend:** React/Vite
  - Port: 3000
  - Auto-refresh: Yes (HMR)

- ✅ **API Proxy:** Vite → Backend
  - Route: /api → http://localhost:5000

---

## 🎯 Start Working Now

### Frontend Development:
```powershell
npm run dev
# or
npm start
```

### Backend Development:
```powershell
npm run server
# or
node --watch server/server.js
```

### Build for Production:
```powershell
npm run build
```

---

## Common Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start frontend dev server |
| `npm run server` | Start backend server |
| `npm run build` | Build frontend for production |
| `npm run lint` | Run linter |
| `npx prisma studio` | View Supabase database GUI |
| `npx prisma generate` | Regenerate Prisma client |
| `npx prisma db push` | Sync schema to database |

---

## Troubleshooting

### Frontend Won't Connect to Backend?
1. Make sure backend is running: `npm run server`
2. Check backend is on port 5000
3. Verify Vite proxy in `vite.config.js`

### Database Connection Error?
1. Check `.env` has correct DATABASE_URL
2. Verify Supabase credentials are correct
3. Ensure you have internet connection

### Port Already in Use?
```powershell
# Find process on port 5000
netstat -ano | findstr :5000

# Kill it
taskkill /PID <PID> /F
```

---

## Next Steps

1. ✅ Start the backend: `npm run server`
2. ✅ Start the frontend: `npm run dev`  
3. ✅ Visit http://localhost:3000
4. ✅ Test the API: http://localhost:3000/api/products

You're ready to build! 🚀

---

## Questions?

- **Backend issues?** Check logs: `npm run server`
- **Frontend issues?** Check browser console (F12)
- **Database issues?** Visit Supabase dashboard: https://app.supabase.com
