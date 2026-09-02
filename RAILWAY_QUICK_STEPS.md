# 🚀 Railway Deployment - Quick Steps (10 minutes)

## Prerequisites ✅
- Code committed to GitHub
- Railway account (https://railway.app)
- GitHub connected to Railway

---

## The 7 Steps

### Step 1: Create Railway Project
```
1. Go: https://railway.app/dashboard
2. Click: "New Project"
3. Select: "Deploy from GitHub"
4. Choose: Your repository
5. Wait: Railway detects your config
```

**Result:** Project created, services auto-configured

---

### Step 2: Add Environment Variables

In Railway Dashboard → Backend Service → Variables:

**Copy-paste these exactly:**

```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://postgres.yjzkfwyattiibfgnngiv:Ashunila@2005@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&schema=public
DIRECT_URL=postgresql://postgres.yjzkfwyattiibfgnngiv:Ashunila@2005@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?schema=public
JWT_SECRET=change-me-to-random-secret-32-chars-minimum
CORS_ORIGIN=https://your-railway-url.railway.app
SUPABASE_URL=https://yjzkfwyattiibfgnngiv.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlqemtmd3lhdHRpaWJmZ25uZ2l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNTE4NjUsImV4cCI6MjEwMzgyNzg2NX0.AjmaFKcARU0MOJHnUI-0PcLUOkQwtM9xC16AfFjgUJA
FLIPKART_AFFILIATE_ID=cartvers01
FLIPKART_AFFILIATE_TOKEN=fk_aff_tok_998a4e12e345b801a6bc
FLIPKART_API_BASE_URL=https://affiliate-api.flipkart.net/affiliate/1.0
```

**⚠️ Important:** Change `JWT_SECRET` to random string!

---

### Step 3: Generate JWT_SECRET

Use this to generate random secret:

```powershell
# PowerShell command
-join ((1..32) | ForEach-Object { [char](Get-Random -InputObject (33..126)) })
```

**Or use online:** https://generate-random.org/encryption-key-generator

**Result:** Random 32-char secret like: `aB3$mK9@xL2#pQ7!wN5&vZ8%hJ4^rT6*`

---

### Step 4: Wait for Deployment

In Railway dashboard:
1. Watch the Logs tab
2. Look for: "Successfully deployed"
3. Takes 2-5 minutes

**Result:** Backend deployed and running ✅

---

### Step 5: Get Your Railway URL

In Railway dashboard:
1. Backend service
2. Look for "Domain" section
3. Copy URL: `https://cartverse-abc123.railway.app`

**Result:** You have your backend URL

---

### Step 6: Update CORS_ORIGIN

Back in Railway Variables:
1. Find: `CORS_ORIGIN`
2. Change to: `https://your-actual-railway-url.railway.app`
3. Save
4. Railway auto-redeploys

**Result:** Frontend can now talk to backend ✅

---

### Step 7: Test It Works!

```powershell
# Test API
curl https://your-railway-url.railway.app/api/health

# Should see:
# {"status":"healthy",...}

# Test products
curl https://your-railway-url.railway.app/api/products

# Should see products from Supabase!
```

**Result:** Production app is LIVE! 🎉

---

## 🎯 That's It!

Your CartVerse is now deployed to Railway with real Supabase database!

---

## Optional: Deploy Frontend

### To Vercel:
```
1. Go: https://vercel.com
2. Import GitHub repo
3. Add: VITE_API_PROXY_TARGET=https://your-railway-url.railway.app
4. Deploy
5. Visit: https://cartverse.vercel.app
```

### To Railway:
```
1. Add Frontend service to Railway
2. Build: npm run build
3. Start: npm run preview
4. Deploy
5. Visit: https://your-railway-url.railway.app
```

---

## URLs After Deployment

| Service | URL |
|---------|-----|
| **Backend** | `https://your-railway-url.railway.app` |
| **Frontend** (optional) | `https://your-vercel-url.vercel.app` |
| **Database** | Supabase (hidden, automatic) |

---

## Troubleshooting in 30 Seconds

**Backend not starting?**
→ Check logs for errors
→ Verify all environment variables set
→ Check DATABASE_URL and DIRECT_URL

**Can't reach database?**
→ Verify DATABASE_URL is exact copy
→ Verify DIRECT_URL is exact copy
→ Check Supabase project is active

**Frontend can't reach backend?**
→ Update CORS_ORIGIN to your Railway URL
→ Clear browser cache (Ctrl+F5)
→ Check network tab in browser (F12)

---

## What's Running

```
Railway Cloud Server
├─ Node.js Backend (port 5000)
│  └─ Connected to Supabase via pooler
│
├─ Running: npm install && npx prisma db push && node server/server.js
│
└─ Accessible at: https://your-railway-url.railway.app

Supabase Cloud
├─ PostgreSQL Database
├─ Real data stored here
└─ Pooler endpoints: ports 6543 & 5432
```

---

## You're Done! 🚀

**Your CartVerse is live and accessible worldwide!**

Share your Railway URL:
```
https://your-railway-url.railway.app/api/products
```

That's your API. Your frontend can call it from anywhere!

---

**Read RAILWAY_DEPLOYMENT_SETUP.md for detailed guide if you hit issues**
