# Deploy CartVerse Backend to Render.com

## Overview

This guide provides **exact step-by-step instructions** to deploy your CartVerse backend to Render.com with Supabase PostgreSQL.

**Why Render.com?**
- ✅ Simple deployment (connect GitHub, auto-deploys on push)
- ✅ Free tier available ($0/month)
- ✅ Automatic HTTPS & SSL certificates
- ✅ PostgreSQL database included
- ✅ Easy environment variable management
- ✅ Built-in monitoring and logs

**Timeline:**
- ~5 minutes: Render account setup
- ~10 minutes: Supabase database setup
- ~3 minutes: GitHub push and deployment
- ~2 minutes: Test deployment
- **Total: ~20 minutes**

---

## Part 1: Prepare GitHub Repository

### Step 1.1: Commit All Changes

```bash
git add .
git commit -m "chore: prepare CartVerse backend for production with Supabase PostgreSQL"
git push origin main
```

**Important:** Ensure `.env` is in `.gitignore` (it should be by default)

### Step 1.2: Verify Files in GitHub

Visit https://github.com/YOUR_USERNAME/YOUR_REPO

You should see these new files:
- ✅ `prisma/schema.prisma` (updated with PostgreSQL)
- ✅ `server/server.js` (production-ready)
- ✅ `.env.example` (environment template)
- ✅ `Procfile` (for Render)
- ✅ `package.json` (with `start:prod` script)
- ✅ `Dockerfile` (optional, Render can use it)

---

## Part 2: Set Up Supabase Database

### Step 2.1: Create Supabase Project

1. Go to **https://app.supabase.com**
2. Click **New project**
3. Fill in:
   - **Project name:** `cartverse-prod`
   - **Database password:** Generate strong password → Copy it somewhere safe
   - **Region:** `us-east-1` (or closest to your users)
4. Click **Create new project**
5. Wait 2-3 minutes for provisioning

### Step 2.2: Get Database Connection String

1. Go to **Project Settings** (gear icon, bottom left)
2. Click **Database** tab
3. Scroll to **Connection String** section
4. Select **Prisma** from dropdown
5. **Copy the entire connection string**

You'll get something like:
```
postgresql://postgres:MyPassword123@db.abcdef1234.supabase.co:5432/postgres?schema=public
```

**Replace `[YOUR_PASSWORD]` with the password you set during project creation**

### Step 2.3: Test Connection Locally (Optional)

Before deploying, test the connection locally:

```bash
# Create a test .env file
echo 'DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_ID.supabase.co:5432/postgres?schema=public"' > .env.test

# Test connection
DATABASE_URL="postgresql://..." npx prisma db push

# If successful, delete test file
rm .env.test
```

---

## Part 3: Create Render.com Account & Service

### Step 3.1: Sign Up / Login to Render

1. Go to **https://render.com**
2. Click **Sign up** (or Login if existing user)
3. Choose **Sign up with GitHub**
4. Authorize Render to access your GitHub account
5. Complete profile setup

### Step 3.2: Create Web Service

1. In Render Dashboard, click **New +**
2. Select **Web Service**
3. Click **Connect a repository**
4. Find and select your `e-commerce` repository
5. Click **Connect**

### Step 3.3: Configure Web Service

Fill in the service creation form:

| Field | Value | Notes |
|-------|-------|-------|
| **Name** | `cartverse-api` | Your API service name |
| **Environment** | `Node` | Runtime environment |
| **Region** | `Oregon` or closest | Affects latency |
| **Branch** | `main` | Which git branch to deploy |
| **Build Command** | `npm install` | Install dependencies |
| **Start Command** | `npm run start:prod` | Production start script |
| **Plan** | `Free` | Start free ($0), upgrade later if needed |

### Step 3.4: Add Environment Variables

**Critical Step:** These secrets must be set before deployment starts

1. Scroll down to **Environment** section
2. Click **Add Environment Variable** for each:

```
NODE_ENV = production

DATABASE_URL = postgresql://postgres:PASSWORD@db.PROJECT_ID.supabase.co:5432/postgres?schema=public

JWT_SECRET = [GENERATE A STRONG SECRET - see below]

CORS_ORIGIN = https://your-frontend-domain.com

FLIPKART_AFFILIATE_ID = cartvers01

FLIPKART_AFFILIATE_TOKEN = fk_aff_tok_998a4e12e345b801a6bc

FLIPKART_API_BASE_URL = https://affiliate-api.flipkart.net/affiliate/1.0
```

**How to generate JWT_SECRET:**

```bash
# Option 1: Using OpenSSL (macOS/Linux)
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Using Python
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

Copy the output and paste into JWT_SECRET field.

**Example completed environment variables:**

```
NODE_ENV=production
DATABASE_URL=postgresql://postgres:MyPassword123@db.abcdef1234.supabase.co:5432/postgres?schema=public
JWT_SECRET=xK9mL2pQ7wR4bF1aE8vJ0cN3dM6sH5tG9uI2oZ7xY4aT1mW5kP
CORS_ORIGIN=https://your-ecommerce.com
FLIPKART_AFFILIATE_ID=cartvers01
FLIPKART_AFFILIATE_TOKEN=fk_aff_tok_998a4e12e345b801a6bc
FLIPKART_API_BASE_URL=https://affiliate-api.flipkart.net/affiliate/1.0
```

### Step 3.5: Create Service

1. Scroll down to bottom
2. Click **Create Web Service**
3. Render starts the build process
4. Wait for deployment to complete (2-5 minutes)

**Watch the logs:**
- You'll see: "Building application"
- Then: "Running migrations" (if `prisma migrate deploy` is in release phase)
- Finally: "App live at: https://cartverse-api.onrender.com" (your actual URL will be shown)

---

## Part 4: Run Database Migrations on Production

### Step 4.1: Use Render Dashboard Shell

Once your service is deployed:

1. Go to your service dashboard (cartverse-api)
2. Click **Shell** tab (top navigation)
3. Run migration command:

```bash
npx prisma migrate deploy
```

Wait for it to complete. You'll see:
```
✓ Already in sync, no migrations pending
```

or

```
✓ 1 migration applied
```

### Step 4.2: Alternative: Use Procfile Release Phase

Edit your `Procfile` (already created):

```
web: npm run start:prod
release: npx prisma migrate deploy
```

Render automatically runs the `release` command before starting the web service.

---

## Part 5: Verify Deployment

### Step 5.1: Get Your API URL

In Render Dashboard:

1. Go to **Services** > **cartverse-api**
2. Under **Service Details**, find **URL**
3. Copy this URL (e.g., `https://cartverse-api-abc123.onrender.com`)

### Step 5.2: Test Health Endpoint

Replace `YOUR_URL` with your actual Render URL:

```bash
curl https://YOUR_URL/api/health

# Example:
curl https://cartverse-api-abc123.onrender.com/api/health
```

**Expected response (status 200):**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "CartVerse Node.js/Express Backend",
  "version": "2.1.0",
  "database": "PostgreSQL (Supabase)",
  "environment": "production",
  "uptime": 45.321
}
```

### Step 5.3: Test Other Endpoints

```bash
# Get products
curl https://YOUR_URL/api/products | head -100

# Get categories
curl https://YOUR_URL/api/categories

# Get status
curl https://YOUR_URL/api/status
```

### Step 5.4: Check Logs

In Render Dashboard > cartverse-api > **Logs** tab:

Look for:
- ✅ `🚀 CartVerse Backend Server Started`
- ✅ `✓ Database: PostgreSQL (Supabase)`
- ✅ `✓ Environment: production`
- ❌ No `ERROR` messages

---

## Part 6: Connect Frontend to Production Backend

### Step 6.1: Update Frontend Configuration

In your **frontend code**, update the API URL:

**Vite Frontend (.env.production):**

```env
VITE_API_PROXY_TARGET=https://YOUR_RENDER_URL
```

**React App:**

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://YOUR_RENDER_URL';
```

### Step 6.2: Redeploy Frontend

After updating the backend URL, redeploy your frontend:

```bash
# If using Vercel
vercel --prod

# If using Netlify
netlify deploy --prod

# If using another platform, follow their deployment process
```

### Step 6.3: Test Full Stack

1. Open your frontend in browser: `https://your-frontend-domain.com`
2. Test API calls:
   - Try searching for products
   - Add item to cart
   - Checkout process
3. Check browser console (F12) for any errors

---

## Part 7: Advanced Configuration (Optional)

### Enable Custom Domain

1. Render Dashboard > cartverse-api > **Settings**
2. Scroll to **Custom Domain**
3. Enter your domain: `api.yourcompany.com`
4. Add DNS CNAME record to your domain provider:
   ```
   CNAME: cartverse-api-abc123.onrender.com
   ```

### Set Up Notifications

1. Render Dashboard > **Account Settings** > **Notifications**
2. Enable email alerts for:
   - Deployment failures
   - Memory limit exceeded
   - Errors in logs

### Monitor Logs

View real-time logs:

```bash
# Using Render CLI (after login)
render logs cartverse-api
```

Or use Dashboard > Logs tab

---

## Part 8: Troubleshooting

### Issue: Build Failed

**Error:** `npm ERR! 404 package not found`

**Solution:**
```bash
# Verify package.json has all dependencies
npm install

# Test build locally
npm run build

# Push to Git
git add .
git commit -m "fix: dependencies"
git push
```

### Issue: Service Crashes on Startup

**Error:** `App crashed on startup`

**Solution:**
1. Check Render Logs for error message
2. Common causes:
   - `DATABASE_URL` not set
   - `JWT_SECRET` missing
   - Database connection timeout

3. Fix in Render Dashboard > Environment Variables
4. Click **Redeploy** button

### Issue: 502 Bad Gateway

**Error:** `502 Bad Gateway` when accessing API

**Solution:**
1. Verify service is running: Render Dashboard > Status should be "Live"
2. Check logs for errors
3. Database connection issue:
   - Verify DATABASE_URL is correct
   - Check Supabase project is running
4. Wait 30 seconds and try again (Render might be restarting)

### Issue: CORS Errors in Browser

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
1. Update `CORS_ORIGIN` environment variable to your frontend URL
2. NO trailing slash: `https://example.com` (not `https://example.com/`)
3. Click **Redeploy** after changing environment variable

### Issue: Database Migrations Failed

**Error:** `Error: Migration failed`

**Solution:**
```bash
# Run migration from Render Shell
npx prisma migrate deploy

# If stuck, check migration status
npx prisma migrate status

# View migration files
ls -la prisma/migrations/
```

### Issue: Out of Memory

**Error:** `JavaScript heap out of memory`

**Solution:**
1. Render Dashboard > **Instance Type**
2. Upgrade from Free to Paid plan
3. Or optimize database queries

---

## Maintenance & Monitoring

### Daily Checks

```bash
# Check API health
curl https://YOUR_URL/api/health

# Check status
curl https://YOUR_URL/api/status
```

### Weekly Tasks

- Review Render Dashboard > Logs
- Check Supabase Database stats
- Monitor storage usage

### Monthly Tasks

- Review error logs
- Update dependencies: `npm update`
- Rotate JWT_SECRET (generate new one in environment variables)

---

## Auto-Deployment Setup

Your deployment is now **automatic**:

1. Make code changes locally
2. `git push origin main`
3. Render automatically detects push
4. Render rebuilds and redeploys
5. New version live in 2-5 minutes

**To disable auto-deploy:**
- Render Dashboard > Settings > Auto-deploy toggle (off)

---

## Production Checklist

Before going live:

- [ ] Supabase project created and accessible
- [ ] DATABASE_URL copied correctly (replaced password placeholder)
- [ ] JWT_SECRET generated and set (strong random string)
- [ ] CORS_ORIGIN set to your frontend domain
- [ ] Render service deployed and "Live" status
- [ ] `/api/health` endpoint returns 200
- [ ] Database migrations ran successfully
- [ ] Frontend updated with production API URL
- [ ] Frontend tested with backend
- [ ] All critical API endpoints tested
- [ ] Logs checked for errors
- [ ] Monitoring/alerts configured

---

## Getting Your Public API URL

Your CartVerse backend is now publicly accessible!

**Public API URL format:**
```
https://cartverse-api-abc123.onrender.com
```

Or with custom domain (if configured):
```
https://api.yourcompany.com
```

**Share this URL with:**
- Your frontend developers
- Frontend production deployment
- API consumers
- Documentation

---

## Next Steps

1. ✅ Backend deployed to Render
2. ✅ Supabase PostgreSQL configured
3. ✅ Public API URL obtained
4. 📝 Frontend connected to backend (DEPLOY_FRONTEND.md)
5. 📝 Set up monitoring & alerting (optional)

---

## Support

**Render Support:** https://render.com/docs
**Supabase Support:** https://supabase.com/docs
**Prisma Support:** https://www.prisma.io/docs

---

**Congratulations! Your CartVerse backend is now live on production! 🚀**
