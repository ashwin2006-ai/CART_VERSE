# ⚡ Deploy Now - Quick Checklist

Complete deployment in 15 minutes. Follow this checklist step-by-step.

---

## 🔐 SECURITY - DO THIS FIRST

**⚠️ CRITICAL: Rotate your credentials before deploying**

### Step 1: Get New Credentials

Go to https://app.supabase.com:

```
1. Select your project
2. Settings → API → Click "Regenerate" next to Anon Key
   (Copy the NEW key)
3. Settings → Database → Click "Reset Password"
   (Copy new DATABASE_URL)
4. Generate JWT_SECRET:
   Command: openssl rand -base64 32
   (Copy the output)
```

**You now have:**
- New SUPABASE_ANON_KEY
- New DATABASE_URL
- New JWT_SECRET

---

## 🚀 PART 1: Deploy Backend (5 min)

### Railway Deployment Steps

```
[ ] 1. Go to https://railway.app
[ ] 2. Click "Login" → "GitHub"
[ ] 3. Click "New Project"
[ ] 4. Select "Deploy from GitHub repo"
[ ] 5. Search and select: CART_VERSE
[ ] 6. Railway detects railway.json ✓
```

### Add Variables in Railway

Click **Variables** tab and add these:

```
[ ] NODE_ENV = production
[ ] PORT = 5000
[ ] JWT_SECRET = [your generated string from step above]
[ ] DATABASE_URL = [your new URL from Supabase]
[ ] SUPABASE_URL = https://yjzkfwyattiibfgnngiv.supabase.co
[ ] SUPABASE_ANON_KEY = [your new key from Supabase]
[ ] CORS_ORIGIN = http://localhost:3000 (temp, will update)
[ ] FLIPKART_AFFILIATE_ID = cartvers01
[ ] FLIPKART_AFFILIATE_TOKEN = fk_aff_tok_xxx
[ ] FLIPKART_API_BASE_URL = https://affiliate-api.flipkart.net/affiliate/1.0
```

**⚠️ IMPORTANT:**
- If DATABASE_URL has `@` in password, change to `%40`
- Example: `Ashunila@2005` becomes `Ashunila%402005`

### Deploy

```
[ ] Click "Deploy" button
[ ] Wait 2-3 minutes for build
[ ] Look for ✅ "Deployment Successful"
```

### Save Your Railway URL

After deployment:
```
[ ] Go to "Deployments" tab
[ ] Click active (green) deployment
[ ] Copy the "Public URL"
[ ] Save it: https://cartverse-xxxxx.railway.app
```

### Verify Backend Works

```bash
curl https://your-railway-url.railway.app/api/health
```

```
[ ] Response shows "status": "healthy"
[ ] No errors in response
```

**BACKEND IS LIVE ✅**

---

## 🎨 PART 2: Deploy Frontend (3 min)

### Update Frontend Code

**File: `vite.config.js` - Find the proxy section and update:**

```javascript
server: {
  proxy: {
    '/api': {
      target: 'https://your-railway-url.railway.app', // UPDATE THIS
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

Replace `https://your-railway-url.railway.app` with your actual Railway URL.

### Commit & Push

```bash
git add vite.config.js
git commit -m "chore: Configure frontend to use deployed backend"
git push origin main
```

```
[ ] Changes pushed to GitHub
```

### Deploy to Vercel

```
[ ] 1. Go to https://vercel.com
[ ] 2. Click "Login" → "GitHub"
[ ] 3. Click "Add New..." → "Project"
[ ] 4. Search: CART_VERSE
[ ] 5. Click "Import"
```

### Vercel Settings

Vercel will auto-detect settings. Just verify:

```
[ ] Framework: Vite
[ ] Build Command: npm run build
[ ] Output Directory: dist
[ ] Install Command: npm install
```

### Add Environment Variable

```
[ ] Click "Environment Variables"
[ ] Add: VITE_API_PROXY_TARGET = https://your-railway-url.railway.app
[ ] Click "Add"
```

### Deploy

```
[ ] Click "Deploy" button
[ ] Wait 2-3 minutes
[ ] Look for ✅ "Production Deployed"
```

### Save Your Vercel URL

After deployment:
```
[ ] Copy the URL from Vercel dashboard
[ ] Save it: https://cartverse-xxxxx.vercel.app
```

**FRONTEND IS LIVE ✅**

---

## 🔄 PART 3: Update Backend CORS (1 min)

Now update the backend to accept requests from your frontend:

```
[ ] 1. Go to https://railway.app
[ ] 2. Click your CartVerse project
[ ] 3. Go to "Variables" tab
[ ] 4. Find CORS_ORIGIN
[ ] 5. Change value to: https://your-vercel-url.vercel.app
[ ] 6. Click save
```

**Backend will auto-restart with new CORS ✓**

---

## ✅ VERIFICATION (2 min)

### Test Backend

```bash
# Test from terminal
curl https://your-railway-url.railway.app/api/health

# Should return:
# {"status":"healthy","service":"CartVerse Node.js/Express Backend",...}
```

```
[ ] Backend responds with 200 OK
[ ] Status shows "healthy"
```

### Test Frontend

```
[ ] 1. Open: https://your-vercel-url.vercel.app
[ ] 2. Should see CartVerse homepage
[ ] 3. Should see products loaded
[ ] 4. No errors in browser console
```

### Test API Call from Frontend

Open browser console and run:

```javascript
fetch('https://your-railway-url.railway.app/api/products')
  .then(r => r.json())
  .then(d => console.log(d))
```

```
[ ] Returns product data
[ ] No CORS errors
[ ] Data loads in < 2 seconds
```

### Verify Database

```
[ ] 1. Go to https://app.supabase.com
[ ] 2. Select your project
[ ] 3. Click "SQL Editor" or "Tables"
[ ] 4. See all tables: users, products, orders, categories, reviews, etc.
```

---

## 🎉 SUCCESS CRITERIA

Your deployment is complete when:

```
[ ] Frontend URL works in browser
[ ] Backend API responds to health check
[ ] No CORS errors in console
[ ] Products display on homepage
[ ] Can click on products
[ ] Can add to cart
[ ] Backend logs show "Database connected"
[ ] Supabase has all tables created
```

**If all checked ✅ → YOU'RE DONE! 🎉**

---

## 🆘 COMMON ISSUES

### Backend won't start
- Check Railway variables are all set
- Verify DATABASE_URL has `%40` not `@`
- Check logs in Railway dashboard

### Frontend blank page
- Check browser console for errors
- Verify VITE_API_PROXY_TARGET in Vercel settings
- Check vite.config.js has correct URL

### CORS error
- Update CORS_ORIGIN in Railway to Vercel URL
- Wait 1 minute for restart
- Clear browser cache

### Tables not in Supabase
- In Railway Shell, run: `npx prisma db push`

---

## 📱 Final URLs

Save these for reference:

```
Frontend:  https://[your-vercel-url].vercel.app
Backend:   https://[your-railway-url].railway.app
Supabase:  https://app.supabase.com
```

---

## 🚀 Ready?

1. Start with **SECURITY** section
2. Follow **PART 1** (Backend)
3. Follow **PART 2** (Frontend)
4. Follow **PART 3** (CORS update)
5. Run **VERIFICATION** checks
6. Celebrate! 🎉

**Estimated time: 15 minutes**

---

**Go to FULL_STACK_DEPLOYMENT.md for detailed instructions if needed.**
