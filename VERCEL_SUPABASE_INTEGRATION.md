# 🔗 Connect Vercel & Supabase Integration Guide

Link your Vercel frontend to Supabase database for a complete full-stack application.

---

## 📋 Overview

This guide connects:
- **Frontend**: React app on Vercel
- **Backend API**: Express server (Railway or Vercel)
- **Database**: PostgreSQL on Supabase

```
Vercel (Frontend)
      ↓
Railway API (Backend) or Vercel API Routes
      ↓
Supabase PostgreSQL (Database)
```

---

## 🚀 Step-by-Step Integration

### STEP 1: Get Your Supabase Connection Details

**Go to Supabase Dashboard:**

```
1. https://app.supabase.com
2. Select your project
3. Settings → Database → Connection String
4. Select "Prisma" from dropdown
5. Copy the connection string
```

You should have:
```
postgresql://postgres:YOUR_PASSWORD@db.yjzkfwyattiibfgnngiv.supabase.co:5432/postgres?schema=public
```

**⚠️ Important**: 
- If password has `@`, replace with `%40`
- Example: `Ashunila@2005` → `Ashunila%402005`

---

### STEP 2: Deploy Backend (Choose One)

#### Option A: Using Railway (Recommended)

**Go to**: https://railway.app

```
1. Login with GitHub
2. New Project → Deploy from GitHub
3. Select: CART_VERSE repository
4. Add Variables:
   - DATABASE_URL = [your Supabase connection string]
   - SUPABASE_URL = https://yjzkfwyattiibfgnngiv.supabase.co
   - SUPABASE_ANON_KEY = [your Supabase Anon Key]
   - JWT_SECRET = [generate random string]
   - NODE_ENV = production
   - PORT = 5000
   - CORS_ORIGIN = https://your-vercel-domain.vercel.app
5. Deploy
6. Copy Public URL: https://cartverse-xxxxx.railway.app
```

#### Option B: Using Vercel Functions (Advanced)

```
1. Deploy to Vercel with backend code
2. Set environment variables in Vercel
3. Configure API routes
```

**For this guide, we'll use Railway (Option A)**

---

### STEP 3: Update Frontend Configuration

**File: `vite.config.js`**

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // Use Railway backend URL
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

**File: `.env.production` (new file)**

```env
VITE_API_PROXY_TARGET=https://your-railway-url.railway.app
```

**Commit and push:**

```bash
git add vite.config.js .env.production
git commit -m "chore: Configure Vercel frontend to use Railway backend"
git push origin main
```

---

### STEP 4: Deploy Frontend to Vercel

**Go to**: https://vercel.com

#### Method 1: Direct Import (Easiest)

```
1. Login with GitHub
2. Dashboard → Add New → Project
3. Search and select: CART_VERSE
4. Click "Import"
```

#### Method 2: Connect Repo

```
1. Go to https://vercel.com/new
2. Select GitHub
3. Select: ashwin2006-ai/CART_VERSE
4. Click "Import"
```

#### Configure Environment Variables

In Vercel deployment settings:

```
1. Click "Environment Variables"
2. Add:
   Key: VITE_API_PROXY_TARGET
   Value: https://your-railway-url.railway.app
   Scope: Production
3. Click "Add"
```

#### Deploy

```
1. Click "Deploy" button
2. Wait for build (2-3 minutes)
3. When done, see "Production Deployed ✓"
4. Copy the URL: https://cartverse-xxxxx.vercel.app
```

---

### STEP 5: Verify Connections

#### Test 1: Frontend Loads

```
1. Open: https://cartverse-xxxxx.vercel.app
2. Should see homepage with products
3. No blank page or errors
```

#### Test 2: Backend is Reachable

```bash
curl https://your-railway-url.railway.app/api/health

# Should return:
# {"status":"healthy","database":"PostgreSQL (Supabase)",...}
```

#### Test 3: Frontend → Backend Communication

Open browser console (F12) and run:

```javascript
fetch('https://your-railway-url.railway.app/api/products')
  .then(r => r.json())
  .then(d => console.log(d))
```

Should return product data without CORS errors.

#### Test 4: Database Connection

Check Supabase for tables:

```
1. Go to https://app.supabase.com
2. Select your project
3. Click "SQL Editor" or "Tables"
4. Should see: users, products, orders, categories, reviews, etc.
```

#### Test 5: End-to-End Flow

In browser console on Vercel URL:

```javascript
// 1. Get products from backend (which connects to Supabase)
fetch('https://your-railway-url.railway.app/api/products')
  .then(r => r.json())
  .then(data => {
    console.log('✅ Got products from database:', data.length)
  })

// 2. Try to register a user
fetch('https://your-railway-url.railway.app/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'TestPassword123'
  })
})
  .then(r => r.json())
  .then(data => console.log('✅ User created:', data))
```

---

## 🔧 Environment Variables Reference

### Frontend (Vercel)

| Variable | Value | Where |
|----------|-------|-------|
| `VITE_API_PROXY_TARGET` | `https://your-railway-url.railway.app` | Vercel Settings |

### Backend (Railway)

| Variable | Value | Where |
|----------|-------|-------|
| `DATABASE_URL` | PostgreSQL connection string | Railway Variables |
| `SUPABASE_URL` | `https://yjzkfwyattiibfgnngiv.supabase.co` | Railway Variables |
| `SUPABASE_ANON_KEY` | Your Supabase Anon Key | Railway Variables |
| `JWT_SECRET` | Random 32+ char string | Railway Variables |
| `CORS_ORIGIN` | `https://your-vercel-domain.vercel.app` | Railway Variables |
| `NODE_ENV` | `production` | Railway Variables |
| `PORT` | `5000` | Railway Variables |

### Database (Supabase)

No environment variables needed - it's cloud-hosted.

---

## 🔍 Troubleshooting

### Frontend shows blank page

**Problem**: Page loads but no content

**Solution**:
1. Check browser console for errors
2. Verify `VITE_API_PROXY_TARGET` is set in Vercel
3. Check Network tab to see if API calls succeed
4. Verify backend URL is correct

### CORS Error

**Problem**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
1. Check `CORS_ORIGIN` in Railway matches Vercel URL exactly
2. Include `https://` at start
3. Don't include trailing slash
4. Wait for backend to restart (auto-reloads)

### 502 Bad Gateway

**Problem**: API returns 502 error

**Solution**:
1. Check Railway logs for errors
2. Verify all environment variables are set
3. Check database connection in logs
4. Try redeploying on Railway

### Database Connection Failed

**Problem**: `Error: Can't reach database server`

**Solution**:
1. Verify DATABASE_URL is correct
2. Check password is URL-encoded (`@` → `%40`)
3. Verify Supabase project is active
4. Try resetting password in Supabase

### Products don't load

**Problem**: Frontend shows empty product list

**Solution**:
1. Check backend is running (test `/api/health`)
2. Check database tables exist in Supabase
3. Verify CORS is configured
4. Check backend logs for errors

---

## 📊 Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                      Internet Users                           │
└──────────────────────────────────────────────────────────────┘
                            ↓
                ┌───────────────────────┐
                │  Vercel Frontend      │
                │ cartverse-xxx.        │
                │ vercel.app            │
                │ (React + Vite)        │
                └───────────────────────┘
                            ↓ (HTTPS)
            ┌───────────────────────────────┐
            │  Railway Backend              │
            │ cartverse-xxx.                │
            │ railway.app                   │
            │ (Express.js API)              │
            └───────────────────────────────┘
                            ↓ (TCP)
                ┌───────────────────────┐
                │  Supabase PostgreSQL  │
                │  db.yjzkfwyatti...    │
                │  supabase.co          │
                │  (Database)           │
                └───────────────────────┘
```

---

## ✅ Success Checklist

Your integration is complete when:

- [x] Vercel frontend loads
- [x] Backend is running on Railway
- [x] Database is on Supabase
- [x] Frontend → Backend API calls work
- [x] Backend → Database queries work
- [x] No CORS errors
- [x] Products display
- [x] Can login/register
- [x] Can add to cart
- [x] Can place orders
- [x] Database records are created

---

## 🚀 Next Steps

### 1. Test User Flows

- [ ] Open Vercel URL
- [ ] Browse products
- [ ] Register new account
- [ ] Login
- [ ] Add items to cart
- [ ] Proceed to checkout

### 2. Verify Data Persistence

- [ ] Check Supabase for created users
- [ ] Check Supabase for orders
- [ ] Verify data in database

### 3. Monitor Performance

- [ ] Watch Vercel Analytics
- [ ] Monitor Railway logs
- [ ] Track Supabase usage
- [ ] Set up alerts

### 4. Optimize

- [ ] Enable caching on Vercel
- [ ] Optimize database queries
- [ ] Add CDN for static assets
- [ ] Monitor costs

---

## 📞 Getting Help

If something doesn't work:

1. **Check logs**: 
   - Vercel: Deployments → Logs
   - Railway: Logs tab
   - Supabase: Query logs

2. **Verify URLs**:
   - Frontend URL matches CORS_ORIGIN
   - Backend URL matches VITE_API_PROXY_TARGET
   - Database URL is correct

3. **Test endpoints**:
   ```bash
   # Test backend
   curl https://your-railway-url.railway.app/api/health
   
   # Test database
   curl https://your-railway-url.railway.app/api/products
   ```

4. **Check environment variables**:
   - All variables set in Vercel
   - All variables set in Railway
   - Restart after setting

---

## 🎉 Congratulations!

You now have a complete full-stack application:

```
✅ Frontend: Vercel (scalable, global CDN)
✅ Backend: Railway (auto-scaling, logs)
✅ Database: Supabase (managed PostgreSQL)
```

**Your CartVerse e-commerce platform is LIVE!** 🚀

---

## 📚 Resources

- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Prisma Docs](https://www.prisma.io/docs)
- [Your GitHub](https://github.com/ashwin2006-ai/CART_VERSE)
