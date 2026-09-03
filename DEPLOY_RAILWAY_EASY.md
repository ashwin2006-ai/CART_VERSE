# Deploy to Railway.app - Step by Step (5 minutes)

## Why Railway?
- ✅ **FREE** - No credit card for free tier
- ✅ **Easiest** - Just 5 clicks
- ✅ **Auto-deploys** - Every git push
- ✅ **Already works** - Your code is ready

---

## Step 1: Go to Railway.app

1. Open https://railway.app in your browser
2. Click **"Start a New Project"** (top right)
3. Click **"Deploy from GitHub Repo"**
4. **Authorize Railway** to access your GitHub account

---

## Step 2: Select Your Repository

1. Find your **`e-commerce`** repository in the list
2. Click **"Select Repository"**
3. Railway auto-detects Node.js app

---

## Step 3: Set Environment Variables

Railway shows your project dashboard. Click **"Add Variables"** for each:

### Variable 1: NODE_ENV
```
Name: NODE_ENV
Value: production
```
Click **Add**

### Variable 2: DATABASE_URL
```
Name: DATABASE_URL
Value: postgresql://postgres.yjzkfwyattiibfgnngiv:Ashunila@2005@aws-0-ap-south-1.supabase.co:5432/postgres?schema=public
```
Click **Add**

### Variable 3: DIRECT_URL
```
Name: DIRECT_URL
Value: postgresql://postgres.yjzkfwyattiibfgnngiv:Ashunila@2005@aws-0-ap-south-1.supabase.co:5432/postgres?schema=public
```
Click **Add**

### Variable 4: JWT_SECRET
Generate a strong secret:
```bash
openssl rand -base64 32
```

Paste result:
```
Name: JWT_SECRET
Value: [paste the generated string]
```
Click **Add**

### Variable 5: CORS_ORIGIN
```
Name: CORS_ORIGIN
Value: https://e-commerce-virid-delta.vercel.app
```
Click **Add**

---

## Step 4: Verify Start Command

Railway should auto-detect your `package.json`. Verify in **Project Settings**:

- **Build Command:** `npm install`
- **Start Command:** Should be: `npm run start:prod` or `node server/server.js`

If not set, click **"Add"** and set:
```
Start Command: npm run start:prod
```

---

## Step 5: Deploy!

Click **"Deploy"** button. Railway will:
1. ✅ Install dependencies
2. ✅ Build application
3. ✅ Run migrations (if using Procfile)
4. ✅ Start server

**Wait 2-3 minutes...**

---

## Step 6: Get Your Public API URL

Once deployed (you'll see "Live" status):

1. Click on your project
2. Look for **"Environment"** or **"Deployments"** tab
3. Find **PUBLIC_URL** or **Railway URL**

You'll see something like:
```
https://cartverse-backend-production.up.railway.app
```

**This is your public backend API URL! 🎉**

---

## Step 7: Test Your API

```bash
# Replace with your Railway URL
curl https://your-railway-url/api/health

# You should get:
{
  "status": "healthy",
  "database": "PostgreSQL (Supabase)",
  "environment": "production",
  "version": "2.1.0"
}
```

---

## Step 8: Update Frontend

Your frontend needs to know the backend API URL.

### If using Vercel:

1. Go to **Vercel Dashboard** > Your project
2. Go to **Settings** > **Environment Variables**
3. Add new variable:
   ```
   Name: VITE_API_PROXY_TARGET
   Value: https://your-railway-url
   Environments: Production
   ```
4. **Redeploy** frontend

### Or update in code:

Edit `vite.config.js`:
```javascript
proxy: {
  '/api': {
    target: 'https://your-railway-url',
    changeOrigin: true,
  }
}
```

Then redeploy frontend.

---

## Step 9: Test Full Integration

1. Open https://e-commerce-virid-delta.vercel.app
2. Try these:
   - Search for a product
   - Click on a product
   - Add to cart
   - Try checkout

**Everything working? You're done! 🚀**

---

## Your Final URLs

| Service | URL |
|---------|-----|
| **Frontend** | https://e-commerce-virid-delta.vercel.app |
| **Backend API** | https://your-railway-url (from Step 6) |
| **Database** | Supabase (AWS ap-south-1) |

---

## Troubleshooting

### Issue: Deployment Failed
- Check Railway logs: Click project > **"Logs"** tab
- Common fixes:
  - Verify DATABASE_URL is correct (no extra spaces)
  - Check JWT_SECRET is set
  - Ensure CORS_ORIGIN matches your frontend

### Issue: API returns 502 Bad Gateway
- Check logs in Railway dashboard
- Verify database connection works
- Restart deployment

### Issue: Frontend can't reach backend
- Verify `VITE_API_PROXY_TARGET` matches Railway URL (no trailing slash)
- Check CORS_ORIGIN environment variable
- Clear browser cache (Ctrl+Shift+Delete)

### Issue: Products not showing
- Run migrations: In Railway Shell, run `npx prisma migrate deploy`
- Seed data: `node server/scripts/seed.js`

---

## Continuous Deployment

From now on:
1. Make code changes locally
2. `git add .`
3. `git commit -m "your message"`
4. `git push origin main`
5. Railway **auto-deploys** in ~2 minutes ✅

No manual steps needed!

---

## Success Indicators

✅ Railway shows "Live" status
✅ `/api/health` returns 200 OK
✅ Frontend can fetch products
✅ Cart/checkout works
✅ No CORS errors in browser console

---

**You're done! Your CartVerse backend is now live! 🎉**

Share your Railway URL: `https://your-railway-url`
