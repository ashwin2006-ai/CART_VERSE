# CartVerse Backend Deployment Guide

Deploy your Express backend to Railway with Supabase PostgreSQL.

## Prerequisites

- GitHub account (to host your code)
- Railway account (free tier available)
- Supabase project with connection string

## Step 1: Push Code to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: CartVerse backend with Supabase"
git remote add origin https://github.com/YOUR_USERNAME/cartverse.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Railway

### Option A: Using Railway Dashboard (Recommended)

1. **Go to Railway:** https://railway.app
2. **Sign up/Login** with GitHub
3. **Create new project** → "Deploy from GitHub repo"
4. **Select your repository** (cartverse)
5. **Railway auto-detects** `railway.json` and configures the build
6. Click **Deploy**

### Option B: Using Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

## Step 3: Configure Environment Variables

In Railway dashboard:

1. Go to your project
2. Click **Variables** tab
3. Add these variables:

```
NODE_ENV=production
PORT=5000
JWT_SECRET=your_secure_random_string_here
CORS_ORIGIN=https://your-frontend-domain.com

DATABASE_URL=postgresql://postgres:Ashunila%402005@db.yjzkfwyattiibfgnngiv.supabase.co:5432/postgres?schema=public

SUPABASE_URL=https://yjzkfwyattiibfgnngiv.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlqemtmd3lhdHRpaWJmZ25uZ2l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNTE4NjUsImV4cCI6MjEwMzgyNzg2NX0.AjmaFKcARU0MOJHnUI-0PcLUOkQwtM9xC16AfFjgUJA

FLIPKART_AFFILIATE_ID=cartvers01
FLIPKART_AFFILIATE_TOKEN=fk_aff_tok_998a4e12e345b801a6bc
FLIPKART_API_BASE_URL=https://affiliate-api.flipkart.net/affiliate/1.0
```

## Step 4: Run Initial Migration

After deployment, connect to Railway and run the migration:

```bash
# Option 1: Via Railway CLI
railway run npx prisma db push --skip-generate

# Option 2: Via Railway dashboard
# Go to Deployments → Click running deployment → Shell tab
# Run: npx prisma db push --skip-generate
```

## Step 5: Verify Deployment

```bash
# Get your Railway deployment URL
railway status

# Test the API
curl https://your-railway-url.railway.app/api/health

# Expected response:
# { "status": "healthy" }
```

## Step 6: Update Frontend

Update your frontend to use the deployed backend:

```jsx
// In your React app (src/App.jsx or API config)
const API_URL = process.env.VITE_API_PROXY_TARGET || 
               'https://your-railway-url.railway.app/api';

// Or update vite.config.js proxy target for production
```

## Deployment Status

After deploying to Railway, you'll get a public URL like:
```
https://cartverse-production-xxxxx.railway.app
```

Your backend is now live and connected to Supabase!

## Troubleshooting

### "Can't reach database server"

**Solution:** Make sure `DATABASE_URL` is set correctly in Railway variables, with password URL-encoded.

### "Prisma schema sync failed"

**Solution:** Run migration manually in Railway shell:
```bash
railway run npx prisma db push --skip-generate
```

### "Port already in use"

**Solution:** Railway assigns a random port. Use `process.env.PORT` in your code (already done in `server/server.js`).

## Next: Deploy Frontend

After backend is live, deploy your React frontend to Vercel:

```bash
# Add Vercel config
npm i -g vercel
vercel
```

Then update your backend URL in frontend environment variables.

---

**Need help?** Check:
- Railway Docs: https://docs.railway.app
- Supabase Docs: https://supabase.com/docs
