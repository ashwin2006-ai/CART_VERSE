# 🚀 Deploy CartVerse to Railway with Supabase

## Overview

Railway is a platform that can run your CartVerse app in the cloud and connect to Supabase. This guide shows you how to:

1. Deploy to Railway
2. Connect to Supabase PostgreSQL (via connection pooler)
3. Configure environment variables
4. Run migrations automatically

---

## Why Railway + Supabase?

```
Your Local Machine
├─ Can't reach Supabase (network blocked)
└─ Mock data fallback active

Railway (Cloud Server)
├─ Can reach Supabase ✅
├─ Runs your backend ✅
├─ Stores data permanently ✅
└─ No network restrictions ✅
```

---

## Step 1: Create Railway Account

1. Go to: https://railway.app
2. Click "Start Now" or "Sign Up"
3. Sign up with GitHub or email
4. Verify email

---

## Step 2: Connect GitHub Repository

### If your project is on GitHub:

1. After logging in, click "New Project"
2. Select "Deploy from GitHub"
3. Choose your repository
4. Railway auto-deploys on push

### If NOT on GitHub yet:

```powershell
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit"

# Add remote
git remote add origin https://github.com/YOUR-USERNAME/cartverse.git
git branch -M main
git push -u origin main
```

---

## Step 3: Create Railway Services

Railway needs 2 services:
1. Backend (Node.js/Express)
2. Database (PostgreSQL or MySQL)

### Option A: Quick Setup (Using Railway UI)

1. Go to Railway dashboard: https://railway.app/dashboard
2. Click "New Project"
3. Select "Create New"
4. Add service: "Node.js"
5. Select your GitHub repo

### Option B: Using railway.yaml (Recommended)

Your project already has `railway.yaml`. Check it:

```yaml
[service.backend]
name = "backend"
buildCommand = "npm install && npx prisma generate && npx prisma db push"
startCommand = "node server/server.js"
```

---

## Step 4: Set Environment Variables in Railway

### Go to Railway → Your Project → Backend Service → Variables

Add these exact variables:

```env
NODE_ENV=production
PORT=5000

DATABASE_URL="postgresql://postgres.yjzkfwyattiibfgnngiv:Ashunila@2005@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&schema=public"

DIRECT_URL="postgresql://postgres.yjzkfwyattiibfgnngiv:Ashunila@2005@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?schema=public"

JWT_SECRET="your-super-secret-key-12345"

CORS_ORIGIN="https://YOUR-RAILWAY-URL.railway.app"

SUPABASE_URL="https://yjzkfwyattiibfgnngiv.supabase.co"

SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlqemtmd3lhdHRpaWJmZ25uZ2l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNTE4NjUsImV4cCI6MjEwMzgyNzg2NX0.AjmaFKcARU0MOJHnUI-0PcLUOkQwtM9xC16AfFjgUJA"

FLIPKART_AFFILIATE_ID="cartvers01"
FLIPKART_AFFILIATE_TOKEN="fk_aff_tok_998a4e12e345b801a6bc"
```

**Important:** Replace `YOUR-RAILWAY-URL` with your actual Railway domain (shown in deployment)

---

## Step 5: Deploy Backend

### Using Git Push (Automatic)

```powershell
# Commit changes
git add .
git commit -m "Add Railway deployment config"

# Push to GitHub
git push origin main

# Railway auto-deploys on push
```

### Using Railway CLI (Manual)

```powershell
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Deploy
railway up
```

---

## Step 6: Configure Prisma for Production

Your `prisma/schema.prisma` already has:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

✅ This is correct for Railway + Supabase pooler!

---

## Step 7: Run Migrations on Railway

### Option A: Automatic (Recommended)

In `railway.yaml`:
```yaml
buildCommand = "npm install && npx prisma generate && npx prisma db push"
```

Railway runs this automatically during build.

### Option B: Manual via Railway CLI

```powershell
# Connect to Railway
railway link

# Run migrations
railway run npx prisma db push
```

---

## Step 8: Verify Deployment

### Check Railway Logs

1. Go: https://railway.app/dashboard
2. Click your project
3. Click "Backend" service
4. Check "Logs" tab

**Look for:**
```
✓ Environment: production
✓ Server: http://0.0.0.0:5000
✓ Database: PostgreSQL (Supabase)
✓ PostgreSQL connection successful
```

### Test API

```powershell
# Get deployment URL from Railway
# Visit: https://YOUR-RAILWAY-URL.railway.app/api/health

# Should return:
# {"success": true, "message": "API is healthy"}
```

---

## Step 9: Deploy Frontend

### If using Vercel (Recommended for React)

1. Go to: https://vercel.com
2. Import from GitHub
3. Select your repository
4. Set environment variables:
   ```
   VITE_API_PROXY_TARGET=https://YOUR-RAILWAY-URL.railway.app
   ```
5. Deploy

### If using Railway for Frontend Too

1. In Railway → Add service → Select existing GitHub repo
2. Choose frontend build:
   ```
   Build Command: npm run build
   Start Command: npm run preview
   ```
3. Set port: `3000`
4. Deploy

---

## Step 10: Test Complete App

### Test Backend
```powershell
curl https://YOUR-RAILWAY-URL.railway.app/api/products
```

Expected:
```json
{
  "success": true,
  "data": [...],
  "source": "database"
}
```

### Test Frontend
```
Visit: https://YOUR-VERCEL-URL.vercel.app
```

Expected:
- ✅ Products load from backend
- ✅ Can add to cart
- ✅ Search works
- ✅ All features functional

---

## Connection Flow on Railway

```
User Browser (Vercel)
    ↓
HTTPS Request
    ↓
Frontend (Vercel)
    ↓
API Proxy /api → https://YOUR-RAILWAY-URL.railway.app
    ↓
Backend (Railway)
    ↓
Prisma Client
    ↓
Connection Pooler (Port 6543)
    ↓
Supabase PostgreSQL
    ↓
Data returned
    ↓
Frontend displays products ✅
```

---

## Troubleshooting Railway Deployment

### Problem 1: Build Fails

**Check logs:**
```powershell
railway logs
```

**Common issues:**
- Missing environment variables
- Node version mismatch
- Package installation failed

**Solution:**
```powershell
# Verify locally first
npm install
npm run build
npm run server

# Then deploy
git push origin main
```

### Problem 2: Database Connection Fails

**Check:**
1. DATABASE_URL is correct
2. DIRECT_URL is correct
3. Supabase credentials valid
4. Pooler URLs correct

**Try:**
1. Reset Supabase password
2. Get fresh connection strings
3. Update Railway variables

### Problem 3: Prisma Migration Errors

**Check logs:**
```
railway run npx prisma migrate status
```

**Resolve:**
```powershell
railway run npx prisma db push --force-reset
```

⚠️ Warning: This resets database!

### Problem 4: Port Already in Use

Railway auto-manages ports. If error:

```yaml
# In railway.yaml
PORT=5000  # Railway assigns this
```

---

## Environment Variables Reference

| Variable | Example | Purpose |
|----------|---------|---------|
| `NODE_ENV` | `production` | Node environment |
| `PORT` | `5000` | Server port |
| `DATABASE_URL` | `postgresql://...@pooler...` | Pooler connection |
| `DIRECT_URL` | `postgresql://...@pooler...` | Migration connection |
| `JWT_SECRET` | `super-secret-key` | Auth token secret |
| `CORS_ORIGIN` | `https://your-url.app` | Frontend URL |
| `SUPABASE_URL` | `https://xyz.supabase.co` | Supabase project |
| `SUPABASE_ANON_KEY` | `eyJ...` | Supabase public key |

---

## Security Best Practices

### ✅ DO:
- ✅ Use strong JWT_SECRET in production
- ✅ Keep DATABASE_URL secret (Railway handles this)
- ✅ Use HTTPS only (Railway does this)
- ✅ Update CORS_ORIGIN to your domain
- ✅ Enable Supabase RLS policies

### ❌ DON'T:
- ❌ Commit .env to GitHub
- ❌ Use same JWT_SECRET everywhere
- ❌ Share DATABASE_URL publicly
- ❌ Use weak passwords
- ❌ Expose API keys in frontend code

---

## Post-Deployment

### 1. Test Everything
- Visit frontend
- Browse products
- Add to cart
- Create account
- Place order

### 2. Monitor Logs
- Check Railway logs daily
- Look for errors
- Fix issues quickly

### 3. Enable Auto-Scaling
- Railway → Settings → Auto-scaling
- Set memory: 512MB - 2GB
- Set vCPU: 0.5 - 2

### 4. Set Up Alerts
- Railway → Settings → Alerts
- Alert on deployment failure
- Alert on high memory usage

---

## Quick Deployment Checklist

```
☐ GitHub repository ready
☐ railway.yaml configured
☐ .env.production created (optional, but recommended)
☐ Supabase connection pooler URLs ready
☐ Database credentials verified
☐ Railway account created
☐ GitHub connected to Railway
☐ Environment variables set in Railway
☐ Backend deployed
☐ Frontend deployed
☐ API endpoint working
☐ Database connected
☐ Products showing on frontend
☐ All features tested
```

---

## Cost

**Railway (Free Tier):**
- Up to 5 GB storage
- Up to 100 GB egress/month
- Perfect for development

**Supabase (Free Tier):**
- Up to 500MB storage
- Up to 2GB egress/month
- Perfect for testing

**Vercel (Free Tier, if frontend):**
- Unlimited deployments
- 100GB bandwidth/month
- Perfect for React apps

---

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Create Railway account
3. ✅ Deploy backend to Railway
4. ✅ Set environment variables
5. ✅ Test API endpoints
6. ✅ Deploy frontend (Vercel or Railway)
7. ✅ Test complete flow
8. ✅ Share live URL

---

**You're ready to deploy to the cloud! 🚀**
