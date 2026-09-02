# 🚀 QUICK DEPLOY - CartVerse Full Stack

Everything is ready. Deploy in 3 steps!

## Step 1: Deploy Frontend to Vercel

```bash
# Code is already pushed to GitHub
# Just go to: https://vercel.com

1. Login with GitHub
2. Click "Add New" → "Project"  
3. Select: CART_VERSE
4. Settings:
   - Framework: Vite (auto-detected)
   - Build: npm run build
   - Output: dist
5. Environment Variable:
   - VITE_API_PROXY_TARGET = https://your-railway-url.railway.app
6. Click "Deploy"
```

**You'll get**: `https://cartverse-xxxxx.vercel.app`

---

## Step 2: Deploy Backend to Railway

```bash
# Code is already pushed to GitHub
# Just go to: https://railway.app

1. Login with GitHub
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose: CART_VERSE
5. Add Environment Variables:

   NODE_ENV=production
   PORT=5000
   JWT_SECRET=[generate: openssl rand -base64 32]
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.yjzkfwyattiibfgnngiv.supabase.co:5432/postgres?schema=public
   SUPABASE_URL=https://yjzkfwyattiibfgnngiv.supabase.co
   SUPABASE_ANON_KEY=[your anon key]
   CORS_ORIGIN=https://your-vercel-url.vercel.app
   FLIPKART_AFFILIATE_ID=cartvers01
   FLIPKART_AFFILIATE_TOKEN=fk_aff_tok_xxx
   FLIPKART_API_BASE_URL=https://affiliate-api.flipkart.net/affiliate/1.0

6. Click "Deploy"
```

**You'll get**: `https://cartverse-xxxxx.railway.app`

---

## Step 3: Connect Everything

### Update Backend CORS
```bash
Railway Dashboard → Variables → CORS_ORIGIN = [your vercel URL]
```

### Update Frontend Config
```bash
.env.production:
VITE_API_PROXY_TARGET=[your railway URL]
```

---

## ✅ Test Production

```bash
# Test frontend
curl https://your-vercel-url.vercel.app

# Test backend  
curl https://your-railway-url.railway.app/api/health

# Test integration
# Open frontend in browser, check console for API calls
```

---

## 🎉 LIVE!

When all tests pass, your app is production-ready!

**Your Users Can Access:**
- Frontend: `https://your-cartverse.vercel.app`
- Products: From Supabase database
- Orders: Saved to database
- Everything: Working end-to-end!
