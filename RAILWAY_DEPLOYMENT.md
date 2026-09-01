# Railway Deployment - Step by Step

Deploy your CartVerse backend to Railway in 5 minutes.

## Prerequisites

✅ GitHub account (code already pushed)
✅ Railway account (free at https://railway.app)

## Step 1: Sign Up / Login to Railway

1. Go to **https://railway.app**
2. Click **Login** or **Start Free**
3. Choose **GitHub** as authentication method
4. Authorize Railway to access your GitHub account
5. You'll be redirected to Railway dashboard

## Step 2: Create New Project

1. In Railway dashboard, click **New Project**
2. Select **Deploy from GitHub repo**
3. Search for your repository: `CART_VERSE`
4. Click to select it
5. Railway will auto-detect `railway.json` and configure build settings

## Step 3: Configure Environment Variables

Railway dashboard will show a form after project creation:

### Add these variables:

```
NODE_ENV=production
PORT=5000
JWT_SECRET=your_secure_random_string_here_minimum_32_characters

DATABASE_URL=postgresql://postgres:Ashunila%402005@db.yjzkfwyattiibfgnngiv.supabase.co:5432/postgres?schema=public

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_from_settings

CORS_ORIGIN=https://your-frontend-domain.com

FLIPKART_AFFILIATE_ID=cartvers01
FLIPKART_AFFILIATE_TOKEN=fk_aff_tok_998a4e12e345b801a6bc
FLIPKART_API_BASE_URL=https://affiliate-api.flipkart.net/affiliate/1.0
```

### In Railway UI:

1. Go to your project
2. Click **Variables** tab
3. Paste each variable one by one
4. Click **Add Variable** after each

## Step 4: Deploy

1. Click **Deploy** button
2. Watch the build logs (should take 2-3 minutes)
3. You'll see ✅ when deployment completes

### Build will:
- Install dependencies (`npm install`)
- Generate Prisma client
- Start the server

## Step 5: Get Your Deployment URL

After deployment:

1. Go to **Deployments** tab
2. Click the active deployment
3. Find **Public URL** (looks like: `https://cartverse-production-xxxxx.railway.app`)
4. Copy this URL

## Step 6: Verify Deployment

Test your deployed backend:

```bash
# Test health endpoint
curl https://your-railway-url.railway.app/api/health

# Should return:
# {
#   "status": "healthy",
#   "timestamp": "2026-09-01T...",
#   "service": "CartVerse Node.js/Express Backend",
#   "version": "2.1.0",
#   "database": "PostgreSQL (Supabase)",
#   "environment": "production"
# }
```

## Step 7: Set Up First Migration (Optional but Recommended)

If you want to seed initial data:

1. In Railway dashboard, click **Shell** tab
2. Run:
   ```bash
   npx prisma db push --skip-generate
   ```
3. This creates all tables in Supabase

## Monitoring & Logs

**View logs in Railway:**
1. Go to project
2. Click **Deployments**
3. Click **Logs** tab
4. See real-time server output

## Common URLs After Deployment

| Endpoint | Full URL |
|----------|----------|
| Health Check | `https://your-railway-url.railway.app/api/health` |
| Products | `https://your-railway-url.railway.app/api/products` |
| Orders | `https://your-railway-url.railway.app/api/orders` |
| Auth | `https://your-railway-url.railway.app/api/auth` |

## Troubleshooting

### Build Failed

**Error**: "npm install failed"

**Solution**: 
- Check Node.js version (needs >=20.0.0)
- Go to Settings > Build & Deploy
- Set Node version to `20.x`

### "Can't reach database"

**Error**: DATABASE_URL connection failed

**Solution**:
- Verify password is URL-encoded (`@` → `%40`)
- Check Supabase project is active
- In Railway > Shell, test: `node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL)"`

### 404 on all routes

**Error**: `/api/products` returns 404

**Solution**:
- Server might not be running
- Check Logs tab for startup errors
- Verify PORT is set to `5000`

## Next: Deploy Frontend

Once backend is live, deploy your React frontend to Vercel:

```bash
npm i -g vercel
vercel
```

Then update frontend environment variable:
```
VITE_API_PROXY_TARGET=https://your-railway-url.railway.app
```

## Your Backend is Live! 🎉

Your CartVerse backend is now running in production, connected to Supabase PostgreSQL.

**Deployment URL**: `https://your-railway-url.railway.app`

---

Questions? Check Railway docs: https://docs.railway.app
