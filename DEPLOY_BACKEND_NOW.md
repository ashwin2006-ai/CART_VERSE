# Deploy Backend to Railway + Connect to Supabase

## Your Setup Status
```
✅ Supabase PostgreSQL: Connected
   DATABASE_URL: postgresql://postgres.yjzkfwyattiibfgnngiv:Ashunila@2005@aws-0-ap-south-1.supabase.co:5432/postgres?schema=public

✅ Frontend: Live
   URL: https://e-commerce-virid-delta.vercel.app

❌ Backend: Not deployed yet

Goal: Deploy backend → Get public API URL → Connect to frontend
```

---

## 🚀 DEPLOY NOW - 3 Simple Steps

### STEP 1: Commit & Push Code (2 minutes)

```bash
# Navigate to your project
cd c:\Users\Ashwin\OneDrive\Desktop\e-commerce

# Commit all changes
git add .
git commit -m "chore: prepare backend for production deployment with Supabase"
git push origin main
```

**What gets pushed:**
- ✅ Updated server.js (production-ready)
- ✅ Prisma schema (PostgreSQL)
- ✅ All controllers & routes
- ✅ package.json (with start scripts)

---

### STEP 2: Create Railway Project (2 minutes)

1. Open https://railway.app in browser
2. Click **"New Project"**
3. Click **"Deploy from GitHub Repo"**
4. **Authorize Railway** (first time only)
5. Search for **`e-commerce`** repository
6. Click **"Select Repository"**

Railway will auto-detect Node.js app and start building.

---

### STEP 3: Add Environment Variables to Railway (2 minutes)

In Railway Dashboard, click **"Add Variables"** and add these **5 variables**:

#### Variable 1: NODE_ENV
```
NODE_ENV = production
```

#### Variable 2: DATABASE_URL
Copy from your `.env` file:
```
DATABASE_URL = postgresql://postgres.yjzkfwyattiibfgnngiv:Ashunila@2005@aws-0-ap-south-1.supabase.co:5432/postgres?schema=public
```

#### Variable 3: DIRECT_URL
```
DIRECT_URL = postgresql://postgres.yjzkfwyattiibfgnngiv:Ashunila@2005@aws-0-ap-south-1.supabase.co:5432/postgres?schema=public
```

#### Variable 4: JWT_SECRET
Generate a strong secret:
```bash
# In PowerShell on your local machine:
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

Paste result:
```
JWT_SECRET = [paste-generated-string]
```

#### Variable 5: CORS_ORIGIN
```
CORS_ORIGIN = https://e-commerce-virid-delta.vercel.app
```

---

### ✅ DONE! Your Backend is Deployed

Wait 2-3 minutes for deployment to complete.

You'll see:
- ✅ **Status: Live** (green indicator)
- ✅ **Public URL** similar to: `https://cartverse-backend-production.up.railway.app`

**Copy this URL!** You'll need it next.

---

## 🔗 Connect Backend to Frontend

### Update Frontend Environment Variables

#### Option A: Update Vercel (Recommended)

1. Go to Vercel Dashboard: https://vercel.com
2. Select your project: **e-commerce-virid-delta**
3. Go to **Settings** → **Environment Variables**
4. Add new variable:

```
Name: VITE_API_PROXY_TARGET
Value: https://your-railway-url (from Step 3 above)
Environments: Production
```

5. Click **"Save"** → **"Redeploy"**

Vercel will redeploy your frontend with the new backend URL.

#### Option B: Update Code & Push

Edit `vite.config.js`:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'https://your-railway-url',  // ← Your Railway URL
      changeOrigin: true,
      rewrite: (path) => path,
    }
  }
}
```

Then:
```bash
git add vite.config.js
git commit -m "chore: update backend API URL"
git push origin main
```

---

## ✅ Test Everything

### 1. Test Backend API

Replace `your-railway-url` with your actual Railway URL:

```bash
curl https://your-railway-url/api/health

# Expected response:
{
  "status": "healthy",
  "database": "PostgreSQL (Supabase)",
  "environment": "production",
  "version": "2.1.0"
}
```

### 2. Test Frontend

Open https://e-commerce-virid-delta.vercel.app and:
- ✅ Search for a product (should load from backend)
- ✅ Click on a product (details from backend)
- ✅ Add to cart (saves to backend)
- ✅ Try checkout (uses backend API)

### 3. Check Browser Console

Open browser DevTools (F12) → Console tab:
- ✅ No CORS errors
- ✅ No 404 errors
- ✅ API responses showing

---

## 📊 Your Final Setup

```
┌─────────────────────────────────────────────────────────┐
│           CartVerse - Full Stack Live                    │
├─────────────────────────────────────────────────────────┤
│                                                           │
│ Frontend:                                                │
│ 🌐 https://e-commerce-virid-delta.vercel.app           │
│    (Vite + React, hosted on Vercel)                     │
│                                                           │
│ Backend API:                                             │
│ ⚙️  https://cartverse-backend-xxx.up.railway.app       │
│    (Express.js, hosted on Railway)                      │
│                                                           │
│ Database:                                                │
│ 🗄️  PostgreSQL (Supabase)                              │
│    (AWS ap-south-1 region)                              │
│                                                           │
│ Connection:                                              │
│ ↔️  Frontend ← HTTPS → Backend ← PostgreSQL            │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Troubleshooting

### Issue: Backend not connecting to Supabase
**Error:** `Error: connect ECONNREFUSED`

**Fix:**
1. Verify DATABASE_URL in Railway environment variables
2. Check no extra spaces in URL
3. Verify password is correct (`Ashunila@2005`)
4. Restart Railway deployment

### Issue: CORS errors in browser
**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Fix:**
1. Verify CORS_ORIGIN matches frontend URL exactly
2. No trailing slash: `https://e-commerce-virid-delta.vercel.app` (not `/`)
3. Restart Railway deployment after fixing

### Issue: API returns 502 Bad Gateway
**Error:** `502 Bad Gateway`

**Fix:**
1. Check Railway logs (click project → Logs tab)
2. Verify all environment variables are set
3. Wait 30 seconds and try again (might be restarting)
4. Restart deployment in Railway dashboard

### Issue: Frontend still calling localhost
**Error:** `Failed to fetch from http://localhost:5000`

**Fix:**
1. Verify VITE_API_PROXY_TARGET in Vercel environment variables
2. Redeploy frontend in Vercel after updating
3. Clear browser cache (Ctrl+Shift+Delete)

---

## 📈 What Happens Now

✅ **Auto-Deployment**
- Every time you push code: `git push origin main`
- Railway auto-deploys (2-3 minutes)
- Your frontend and backend update automatically

✅ **Live Monitoring**
- Check Railway logs anytime
- Monitor database connections
- See error logs in real-time

✅ **Production Ready**
- 99.9% uptime SLA
- Automatic backups (Supabase)
- HTTPS/SSL certificate (automatic)
- Database connection pooling

---

## ✨ Your Public API URL

**Once deployed on Railway, you'll have:**

```
https://cartverse-backend-production.up.railway.app/api/*
```

**Use this URL for:**
- Frontend API calls
- Mobile app integration
- Third-party integrations
- Documentation

---

## 🎯 Deployment Checklist

- [ ] Pushed code to GitHub (git push)
- [ ] Created Railway project
- [ ] Added 5 environment variables
- [ ] Railway shows "Live" status
- [ ] Copied Railway public URL
- [ ] Updated Vercel with API URL
- [ ] Frontend redeployed
- [ ] `/api/health` returns 200
- [ ] Frontend loads products
- [ ] No errors in browser console
- [ ] Full-stack integration works

---

## 📞 Need Help?

**Detailed guides available:**
- `DEPLOYMENT_GUIDE.md` - Comprehensive guide
- `VERIFICATION_GUIDE.md` - Testing all endpoints
- `SUPABASE_SETUP.md` - Database configuration

---

**🎉 Your CartVerse backend is about to go LIVE!**

**Timeline:**
- Step 1 (Git push): 2 minutes
- Step 2 (Railway setup): 2 minutes  
- Step 3 (Environment vars): 2 minutes
- Deployment: 2-3 minutes
- **TOTAL: ~10 minutes**

**Status after deployment:**
```
✅ Backend: LIVE on Railway
✅ Database: Connected to Supabase
✅ Frontend: Connected to backend
✅ Full-stack: OPERATIONAL
```

**Your public backend API URL: Ready in 10 minutes! 🚀**
