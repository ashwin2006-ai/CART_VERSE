# 🚀 Full Stack Deployment Guide - CartVerse

Deploy both backend (Railway) and frontend (Vercel) in one go.

---

## 📋 Overview

| Component | Platform | Time | Status |
|-----------|----------|------|--------|
| **Backend** | Railway | 3-5 min | ⏳ Ready |
| **Frontend** | Vercel | 2-3 min | ⏳ Ready |
| **Database** | Supabase | Auto | ⏳ Ready |

**Total deployment time**: ~10 minutes

---

## 🔐 BEFORE YOU START - Security Check

### 1. Rotate Credentials (CRITICAL)

You must rotate your credentials BEFORE deploying:

**In Supabase Dashboard:**

```
1. Go to https://app.supabase.com
2. Select your project
3. Settings → API → Regenerate Anon Key
   (This invalidates the exposed key you shared)
4. Settings → Database → Reset Password
   (Get new DATABASE_URL)
5. Copy new credentials
```

**Generate JWT_SECRET:**

```bash
# Option 1: Using OpenSSL
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Using Python
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Update DATABASE_URL:**
- If password has `@` character, URL-encode it as `%40`
- Example: `Ashunila@2005` → `Ashunila%402005`

---

## PART 1: Deploy Backend to Railway

### Step 1: Go to Railway

```
1. Open: https://railway.app
2. Login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Search: CART_VERSE
6. Click to select
```

### Step 2: Add Environment Variables

**Copy these EXACTLY** (update with YOUR values):

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your_generated_random_32_char_string_here
DATABASE_URL=postgresql://postgres:YOUR_NEW_PASSWORD@db.yjzkfwyattiibfgnngiv.supabase.co:5432/postgres?schema=public
SUPABASE_URL=https://yjzkfwyattiibfgnngiv.supabase.co
SUPABASE_ANON_KEY=your_new_regenerated_anon_key_here
CORS_ORIGIN=https://your-frontend-domain-vercel.app
FLIPKART_AFFILIATE_ID=cartvers01
FLIPKART_AFFILIATE_TOKEN=fk_aff_tok_xxx
FLIPKART_API_BASE_URL=https://affiliate-api.flipkart.net/affiliate/1.0
```

**In Railway Dashboard:**
1. Click **Variables** tab
2. For each line above, click **Add Variable**
3. Key: `NODE_ENV`, Value: `production`
4. Key: `PORT`, Value: `5000`
5. (Continue for all variables)

**⚠️ IMPORTANT:**
- DATABASE_URL must have `%40` not `@` for the password
- JWT_SECRET should be 32+ characters (use generated string)
- CORS_ORIGIN will be your Vercel URL (get it after frontend deployment)

### Step 3: Deploy

1. Click **Deploy** button
2. Watch build logs (2-3 minutes)
3. When complete, you'll see ✅ **Deployment Successful**

### Step 4: Get Railway URL

After deployment:
1. Go to **Deployments** tab
2. Click active (green) deployment
3. Copy **Public URL**
4. **Save this URL** - looks like: `https://cartverse-xxxxx.railway.app`

### Step 5: Verify Backend

```bash
# Test health endpoint
curl https://your-railway-url.railway.app/api/health

# Should return:
# {
#   "status": "healthy",
#   "service": "CartVerse Node.js/Express Backend",
#   "database": "PostgreSQL (Supabase)",
#   "environment": "production"
# }
```

**Check Railway Logs:**
1. Go to Railway project
2. Click **Logs** tab
3. Look for: `"🐘 PostgreSQL Database (Supabase): CONNECTED & READY"`

✅ **Backend is LIVE!**

---

## PART 2: Deploy Frontend to Vercel

### Step 1: Update Frontend Configuration

Update your frontend to use the Railway URL:

**File: `vite.config.js`**

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // Use Railway URL for production
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

**Or create `.env.production`:**

```env
VITE_API_PROXY_TARGET=https://your-railway-url.railway.app
```

### Step 2: Commit Changes

```bash
git add vite.config.js .env.production
git commit -m "chore: Configure frontend to use deployed backend"
git push origin main
```

### Step 3: Go to Vercel

```
1. Open: https://vercel.com
2. Login with GitHub
3. Click "Add New..." → Project
4. Search: CART_VERSE (your repo)
5. Click Import
```

### Step 4: Configure Vercel Project

**Build Settings (auto-detected):**
- Framework: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Environment Variables:**

Click **Environment Variables** and add:

```
VITE_API_PROXY_TARGET=https://your-railway-url.railway.app
```

Replace `https://your-railway-url.railway.app` with your actual Railway URL.

### Step 5: Deploy

1. Click **Deploy** button
2. Watch the build (2-3 minutes)
3. When complete, you'll see ✅ **Production Deployed**

### Step 6: Get Vercel URL

After deployment:
1. You'll see your project URL
2. Looks like: `https://cartverse-xxxxx.vercel.app`
3. **Save this URL**

---

## PART 3: Update Backend CORS

Now that you have your Vercel URL, update the backend:

### Step 1: Update Railway Variables

1. Go to Railway dashboard
2. Click your project
3. Go to **Variables** tab
4. Find `CORS_ORIGIN`
5. Change value to: `https://your-vercel-url.vercel.app`
6. Click save

**The backend will auto-restart** with new CORS settings.

### Step 2: Verify CORS

Test from your frontend:

```bash
# In your browser console, on the Vercel URL:
fetch('https://your-railway-url.railway.app/api/products')
  .then(res => res.json())
  .then(data => console.log(data))
```

Should return products without CORS errors.

---

## ✅ Verification Checklist

### Backend (Railway)

- [ ] Deployment shows "Healthy" status
- [ ] Public URL is accessible
- [ ] `/api/health` returns 200 OK
- [ ] Logs show database connected
- [ ] Supabase tables are created
  - [ ] users
  - [ ] products
  - [ ] orders
  - [ ] categories
  - [ ] reviews
  - [ ] etc.

### Frontend (Vercel)

- [ ] Deployment shows "Deployed"
- [ ] Public URL is accessible
- [ ] Page loads without errors
- [ ] Can see products on home page
- [ ] Can click products
- [ ] Can add to cart

### Integration

- [ ] Frontend loads from Vercel
- [ ] Backend loads from Railway
- [ ] Frontend makes API calls to Railway
- [ ] No CORS errors in console
- [ ] Data flows: Frontend → Railway → Supabase
- [ ] User can login/register
- [ ] User can browse products
- [ ] User can add to cart

---

## 🔗 URLs to Save

After deployment, save these:

```
Frontend:    https://your-vercel-url.vercel.app
Backend API: https://your-railway-url.railway.app
Health Check: https://your-railway-url.railway.app/api/health
Products API: https://your-railway-url.railway.app/api/products
```

---

## 🐛 Troubleshooting

### Backend Won't Start

**Error**: Deployment failed or "unhealthy"

**Solution**:
1. Check Railway logs for errors
2. Verify all environment variables are set
3. Check DATABASE_URL has `%40` not `@`
4. Try redeploying

### Frontend Shows Blank

**Error**: Page loads but no content

**Solution**:
1. Check browser console for errors
2. Verify VITE_API_PROXY_TARGET is set
3. Check API calls in Network tab
4. Verify backend is running

### API Returns 502 Bad Gateway

**Error**: `502 Bad Gateway` from backend

**Solution**:
1. Check Railway is running (green status)
2. Check database connection in logs
3. Verify CORS_ORIGIN matches Vercel URL
4. Try restarting deployment

### CORS Error

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
1. Update CORS_ORIGIN in Railway to Vercel URL
2. Wait for backend to restart
3. Clear browser cache
4. Try again

### Tables Not Created

**Error**: No tables in Supabase after deployment

**Solution**:
1. Go to Railway Shell tab
2. Run: `npx prisma db push --skip-generate`
3. Wait for completion
4. Check Supabase for tables

---

## 📊 Deployment Timeline

```
Start
  ↓
Deploy Backend to Railway (3-5 min)
  ↓
Verify Backend (2 min)
  ↓
Deploy Frontend to Vercel (2-3 min)
  ↓
Update Backend CORS (1 min)
  ↓
Verify Integration (2-3 min)
  ↓
Complete! ✅
```

**Total: ~15 minutes**

---

## 🎯 Success Indicators

Your deployment is **SUCCESSFUL** when:

✅ Frontend loads at Vercel URL  
✅ Backend responds at Railway URL  
✅ `/api/health` returns healthy status  
✅ Frontend makes API calls without CORS errors  
✅ Products display on homepage  
✅ Can login/register  
✅ Can add items to cart  
✅ Database tables exist in Supabase  

---

## 📝 Next Steps After Deployment

1. ✅ Monitor logs for errors
2. ✅ Test user flows (login, browse, cart, checkout)
3. ✅ Check database for data
4. ✅ Set up monitoring/alerts
5. ✅ Configure custom domain (optional)
6. ✅ Set up CI/CD for automatic deployments

---

## 🆘 Get Help

If you get stuck:

1. Check **Verification Checklist** above
2. Look at deployment **Logs** in Railway/Vercel
3. Check **Troubleshooting** section
4. Review relevant markdown files in repo

---

**Ready? Let's deploy!** 🚀

Start with **PART 1: Deploy Backend to Railway** above.
