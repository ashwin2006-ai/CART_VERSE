# 🚀 Railway Deployment - Quick Start Guide

Follow these exact steps to deploy your backend to Railway in 5 minutes.

---

## STEP 1: Go to Railway

1. Open browser: **https://railway.app**
2. Click **Login** (top right)
3. Choose **GitHub** option
4. Authorize Railway to access your GitHub account
5. You'll land on Railway dashboard

---

## STEP 2: Create New Project

1. Click **New Project** (big button in center)
2. Select **Deploy from GitHub repo**
3. Search for: `CART_VERSE` (or your repo name)
4. Click to select your repository
5. Railway will analyze your code

---

## STEP 3: Wait for Auto-Detection

Railway will:
- Read `railway.json` from your repo ✅
- Auto-detect Node.js/Express
- Set up build command: `npm install && npx prisma generate`
- Set up start command: `node server/server.js`

When done, you'll see a **Variables** form.

---

## STEP 4: Add Environment Variables

**IMPORTANT:** Copy and paste EXACTLY these variables:

### Required Variables:

```
NODE_ENV=production
PORT=5000
JWT_SECRET=use_a_random_string_here_minimum_32_chars
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.yjzkfwyattiibfgnngiv.supabase.co:5432/postgres?schema=public
SUPABASE_URL=https://yjzkfwyattiibfgnngiv.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_from_settings
CORS_ORIGIN=http://localhost:3000
FLIPKART_AFFILIATE_ID=cartvers01
FLIPKART_AFFILIATE_TOKEN=fk_aff_tok_xxx
FLIPKART_API_BASE_URL=https://affiliate-api.flipkart.net/affiliate/1.0
```

### How to Add in Railway:

1. In Railway dashboard, find **Variables** section
2. Click **Add Variable** button
3. For each line above:
   - **Key**: `NODE_ENV`, **Value**: `production`
   - **Key**: `PORT`, **Value**: `5000`
   - **Key**: `JWT_SECRET`, **Value**: `generate_a_random_string_here`
   - etc.

**⚠️ IMPORTANT for DATABASE_URL:**

Your password has an `@` symbol. It MUST be URL-encoded:

```
Before (WRONG):   postgresql://postgres:Ashunila@2005@db....
After (CORRECT):  postgresql://postgres:Ashunila%402005@db....
```

The `@` becomes `%40` in the URL.

---

## STEP 5: Deploy

1. After adding all variables, click **Deploy** button
2. Railway will:
   - Pull your code from GitHub
   - Install npm packages
   - Generate Prisma client
   - Start your server
3. Watch the build logs (takes 2-3 minutes)
4. When done, you'll see ✅ **Deployment Successful**

---

## STEP 6: Get Your Public URL

After deployment:

1. Go to **Deployments** tab
2. Click the active (green) deployment
3. Look for **Public URL** on the right panel
4. It looks like: `https://cartverse-production-xxxxx.railway.app`
5. **Copy this URL** - you'll need it!

---

## STEP 7: Test Your Backend

Open a terminal and test your API:

```bash
# Replace with your actual Railway URL
curl https://your-railway-url.railway.app/api/health

# Should return:
# {
#   "status": "healthy",
#   "service": "CartVerse Node.js/Express Backend",
#   "database": "PostgreSQL (Supabase)",
#   "environment": "production"
# }
```

---

## STEP 8: Verify Database Connection

1. Go to Railway dashboard
2. Click **Logs** tab
3. Look for: **"🐘 PostgreSQL Database (Supabase): CONNECTED & READY"**

If you see this message ✅ - Your backend is connected to Supabase!

---

## STEP 9: Check Supabase for Tables

1. Go to **https://app.supabase.com**
2. Select your project
3. Click **SQL Editor** or **Tables**
4. You should see these tables created:
   - ✅ `users`
   - ✅ `products`
   - ✅ `categories`
   - ✅ `orders`
   - ✅ `cart_items`
   - ✅ `wishlist_items`
   - ✅ `reviews`
   - ✅ `coupons`
   - ✅ `addresses`
   - ✅ `order_items`
   - ✅ `flipkart_products`

If you see all these tables, **Prisma migrations ran successfully!** 🎉

---

## TROUBLESHOOTING

### Build Failed

**Error**: "npm install failed" or "Build error"

**Solution**:
1. Go to Railway project Settings
2. Find **Build & Deploy** section
3. Set Node.js version to `20.x` or higher
4. Click **Rebuild**

### Database Connection Error

**Error**: "Can't reach database server"

**Solution**:
- Check DATABASE_URL has correct password
- Verify `@` is encoded as `%40`
- Make sure Supabase project is active

### No Tables in Supabase

**Error**: Tables not created after deployment

**Solution**:
1. Go to Railway dashboard
2. Click **Shell** tab
3. Run: `npx prisma db push --skip-generate`
4. Wait for completion

### API returns 502 Bad Gateway

**Error**: `{"statusCode":502,"error":"Bad Gateway"}`

**Solution**:
1. Check Railway logs for errors
2. Verify all environment variables are set
3. Try redeploying

---

## ENVIRONMENT VARIABLES EXPLAINED

| Variable | Purpose | Example |
|----------|---------|---------|
| `NODE_ENV` | Environment type | `production` |
| `PORT` | Server port | `5000` |
| `JWT_SECRET` | Auth token secret | Random 32+ char string |
| `DATABASE_URL` | Supabase connection | PostgreSQL URL |
| `SUPABASE_URL` | Supabase project URL | `https://...supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase API key | JWT token |
| `CORS_ORIGIN` | Frontend domain | `http://localhost:3000` |

---

## Next Steps After Deployment

1. ✅ Backend deployed to Railway
2. ✅ Connected to Supabase PostgreSQL
3. ✅ Tables created automatically
4. ⏭️ **NEXT**: Deploy frontend to Vercel
5. ⏭️ Update frontend to use Railway API URL

---

## Important URLs to Save

After deployment, save these:

```
Backend API: https://your-railway-url.railway.app
Health Check: https://your-railway-url.railway.app/api/health
Products API: https://your-railway-url.railway.app/api/products
```

---

**Questions?** See RAILWAY_DEPLOYMENT.md or DEPLOYMENT_GUIDE.md for more details.

**Ready?** Go to https://railway.app and start! 🚀
