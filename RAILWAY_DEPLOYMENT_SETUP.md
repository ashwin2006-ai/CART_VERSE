# 🚀 Deploy CartVerse to Railway - Complete Setup

## Step-by-Step Deployment Guide

---

## Step 1: Prepare Your Code for Deployment

### 1.1 Ensure All Code is Committed
```powershell
cd c:\Users\Ashwin\OneDrive\Desktop\e-commerce

# Check git status
git status

# Add all files
git add .

# Commit
git commit -m "CartVerse ready for Railway deployment"

# Push to main branch
git push origin main
```

Expected: All files pushed to GitHub

---

## Step 2: Create Railway Account

### 2.1 Go to Railway
**Website:** https://railway.app

### 2.2 Sign Up
- Click "Start Now" or "Sign Up"
- Use GitHub account (easiest)
- Or email signup
- Verify email

---

## Step 3: Connect GitHub to Railway

### 3.1 Create New Project
1. After login, click "New Project"
2. Select "Deploy from GitHub"
3. Authorize Railway to access your GitHub

### 3.2 Select Repository
1. Find your repository: `e-commerce` or `cartverse`
2. Select it
3. Railway will auto-detect your project

---

## Step 4: Configure Backend Service

### 4.1 Build Command
Railway should auto-detect:
```
npm install && npx prisma generate && npx prisma db push
```

### 4.2 Start Command
Railway should auto-detect:
```
node server/server.js
```

Or if using npm script:
```
npm run server
```

### 4.3 Port
Should be: `5000`

---

## Step 5: Add Environment Variables (CRITICAL!)

### 5.1 Go to Project Settings
1. In Railway dashboard, click your project
2. Click "Backend" service (or your service name)
3. Click "Variables" tab

### 5.2 Add Each Variable

Add these **exactly** as shown:

```
KEY: NODE_ENV
VALUE: production

KEY: PORT
VALUE: 5000

KEY: DATABASE_URL
VALUE: postgresql://postgres.yjzkfwyattiibfgnngiv:Ashunila@2005@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&schema=public

KEY: DIRECT_URL
VALUE: postgresql://postgres.yjzkfwyattiibfgnngiv:Ashunila@2005@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?schema=public

KEY: JWT_SECRET
VALUE: your-super-secret-key-change-this-to-something-random

KEY: CORS_ORIGIN
VALUE: https://your-railway-url.railway.app

KEY: SUPABASE_URL
VALUE: https://yjzkfwyattiibfgnngiv.supabase.co

KEY: SUPABASE_ANON_KEY
VALUE: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlqemtmd3lhdHRpaWJmZ25uZ2l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNTE4NjUsImV4cCI6MjEwMzgyNzg2NX0.AjmaFKcARU0MOJHnUI-0PcLUOkQwtM9xC16AfFjgUJA

KEY: FLIPKART_AFFILIATE_ID
VALUE: cartvers01

KEY: FLIPKART_AFFILIATE_TOKEN
VALUE: fk_aff_tok_998a4e12e345b801a6bc

KEY: FLIPKART_API_BASE_URL
VALUE: https://affiliate-api.flipkart.net/affiliate/1.0
```

### ⚠️ IMPORTANT: JWT_SECRET

Change this to something random and strong:

**Generate a random secret:**
```powershell
# PowerShell command to generate random string
-join ((1..32) | ForEach-Object { [char](Get-Random -InputObject (33..126)) })
```

Or use online generator: https://generate-random.org/encryption-key-generator?count=1&bytes=32

Example: `aB3$mK9@xL2#pQ7!wN5&vZ8%hJ4^rT6*`

---

## Step 6: Deploy

### 6.1 Automatic Deployment
After setting variables, Railway automatically starts deployment.

**Or manually trigger:**
1. Click "Deploy" button
2. Select main branch
3. Start deployment

### 6.2 Wait for Deployment
- Takes 2-5 minutes
- Watch the logs
- Look for: "Successfully deployed"

---

## Step 7: Get Your Railway URL

### 7.1 Find Your Domain
1. In Railway dashboard, go to your Backend service
2. Look for "Domain" or "URL" section
3. Should look like: `https://cartverse-production-abc123.railway.app`

### 7.2 Update CORS_ORIGIN

**Go back to Variables tab:**
- Find `CORS_ORIGIN`
- Update value to: `https://your-actual-railway-url.railway.app`
- Save/redeploy

This allows your frontend to talk to your backend.

---

## Step 8: Test Deployment

### 8.1 Test Backend API
```powershell
# Use your Railway URL
curl https://your-railway-url.railway.app/api/health

# Should return:
# {"status":"healthy",...}
```

### 8.2 Test Products Endpoint
```powershell
curl https://your-railway-url.railway.app/api/products

# Should return products from Supabase
```

### 8.3 Check Logs
In Railway dashboard:
1. Click Backend service
2. Click "Logs" tab
3. Should see:
   - ✅ "PostgreSQL pool with X connections"
   - ✅ "CartVerse Backend Server Started"
   - ❌ No error messages

---

## Step 9: Deploy Frontend (Optional)

### Option A: Deploy to Vercel (Recommended for React)

**1. Go to Vercel:**
https://vercel.com

**2. Import GitHub Repository**
- Click "New Project"
- Select your GitHub repo
- Configure:
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Environment Variables:
    ```
    VITE_API_PROXY_TARGET=https://your-railway-url.railway.app
    ```

**3. Deploy**

**4. Get Frontend URL**
- Example: `https://cartverse.vercel.app`

### Option B: Deploy Frontend to Railway Too

**1. Add Frontend Service in Railway**
- Click "Add Service"
- Select same GitHub repo
- Configure:
  - Build Command: `npm run build`
  - Start Command: `npm run preview`
  - Port: `3000`

**2. Deploy**

---

## Step 10: Test Complete App

### Test Frontend (if deployed)
```
Visit: https://your-vercel-url.vercel.app
or
https://your-railway-url-frontend.railway.app
```

### Test Complete Flow
1. ✅ Homepage loads
2. ✅ Products display from Supabase
3. ✅ Search works
4. ✅ Filters work
5. ✅ Add to cart works
6. ✅ Create account works
7. ✅ Place order works

---

## Environment Variables Reference

| Variable | Example | Purpose |
|----------|---------|---------|
| `NODE_ENV` | `production` | Tell app it's production |
| `PORT` | `5000` | Server port |
| `DATABASE_URL` | `postgresql://...` | Supabase pooler (queries) |
| `DIRECT_URL` | `postgresql://...` | Supabase pooler (migrations) |
| `JWT_SECRET` | `random-key` | Auth token secret |
| `CORS_ORIGIN` | `https://...` | Frontend URL |
| `SUPABASE_URL` | `https://...` | Supabase project |
| `SUPABASE_ANON_KEY` | `eyJ...` | Supabase public key |

---

## Troubleshooting

### Problem 1: Deployment Fails

**Check logs:**
1. Railway dashboard → Backend → Logs
2. Look for error messages
3. Common issues:
   - Missing environment variables
   - Node version mismatch
   - Build script failed

**Solution:**
```powershell
# Verify locally first
npm run build
npm run server

# Then push and retry
git push origin main
```

### Problem 2: Database Connection Failed

**Check variables:**
1. Is `DATABASE_URL` set correctly?
2. Is `DIRECT_URL` set correctly?
3. Do they have pooler URLs (port 6543 and 5432)?

**Solution:**
1. Re-check the exact URLs in `.env.production`
2. Copy-paste exactly (watch for typos)
3. Save and redeploy

### Problem 3: Frontend Can't Talk to Backend

**Check:**
1. Is `CORS_ORIGIN` set to your Railway URL?
2. Is it exactly: `https://your-url.railway.app`?
3. No trailing slash!

**Solution:**
1. Update `CORS_ORIGIN` in Railway variables
2. Redeploy backend
3. Clear browser cache (Ctrl+F5)

### Problem 4: No Products Showing

**Check:**
1. Is backend running? (check logs)
2. Is database connected? (look for connection message)
3. Test: `https://your-url.railway.app/api/products`

**Solution:**
1. Check backend logs for errors
2. Verify Supabase credentials
3. Verify pooler URLs

### Problem 5: "Can't reach database server"

**This might mean:**
1. Supabase connection pooler is blocked (unlikely from Railway)
2. Credentials are wrong
3. Network issue

**Solution:**
1. Verify DATABASE_URL and DIRECT_URL are exactly correct
2. Check Supabase dashboard for active project
3. Try resetting Supabase password

---

## Deployment Checklist

```
☐ Code committed to GitHub
☐ Railway account created
☐ GitHub connected to Railway
☐ Backend service configured
☐ Build command correct
☐ Start command correct
☐ All environment variables set:
  ☐ NODE_ENV
  ☐ PORT
  ☐ DATABASE_URL
  ☐ DIRECT_URL
  ☐ JWT_SECRET (changed to random)
  ☐ CORS_ORIGIN (updated)
  ☐ SUPABASE_URL
  ☐ SUPABASE_ANON_KEY
  ☐ FLIPKART_*
☐ Deployment started
☐ Logs show success
☐ Backend API responds
☐ Database connected
☐ Products endpoint works
☐ Frontend deployed (optional)
☐ Frontend can reach backend
☐ Complete app tested
```

---

## Quick Recap: What You're Doing

```
Your Local Code
    ↓ (push to GitHub)
GitHub Repository
    ↓ (Railway sees changes)
Railway Platform
    ↓ (installs deps, builds, deploys)
Railway Server (Cloud)
    ├─ Backend on Railway
    ├─ Connected to Supabase via pooler
    ├─ Accessible at: https://your-railway-url.railway.app
    └─ Running production Node.js app ✅

Supabase (Cloud)
    ├─ PostgreSQL Database
    ├─ Your real data stored here
    └─ Accessible from Railway ✅

Frontend (Optional - Vercel or Railway)
    ├─ React app on Vercel (or Railway)
    ├─ Points to Railway backend
    └─ Accessible at: https://your-frontend-url.app ✅
```

---

## Production Architecture

```
User's Browser
    ↓
https://cartverse.vercel.app (Frontend - Vercel)
    ↓ (API calls to backend)
https://your-railway-url.railway.app (Backend - Railway)
    ↓ (Database queries via pooler)
Supabase PostgreSQL
    └─ Data stored and retrieved
```

---

## What Happens After Deployment

✅ **Your app is live!**
- Users can visit your frontend URL
- Frontend talks to backend on Railway
- Backend talks to Supabase database
- Data persists permanently
- Multi-user support works
- Scales automatically

---

## Cost

**Railway (Free Tier):**
- Up to 5GB storage
- Up to 100GB egress
- Perfect for testing
- Upgrade anytime

**Supabase (Free Tier):**
- Up to 500MB storage
- Enough for 1000+ products
- Perfect for indie projects

**Vercel (Free Tier, if using):**
- Unlimited deployments
- 100GB bandwidth/month
- Perfect for React apps

**Total Cost: FREE!** 🎉

---

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Create Railway account
3. ✅ Connect GitHub to Railway
4. ✅ Set environment variables
5. ✅ Deploy!
6. ✅ Test API endpoints
7. ✅ Deploy frontend (optional)
8. ✅ Share your live URL!

---

## Support

**Railway Docs:** https://docs.railway.app
**Supabase Docs:** https://supabase.com/docs
**Prisma Docs:** https://www.prisma.io/docs

---

**You're ready! Start your deployment! 🚀**
