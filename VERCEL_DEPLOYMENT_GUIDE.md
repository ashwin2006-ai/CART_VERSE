# Vercel Deployment Guide - CartVerse E-Commerce

## 🚀 Step-by-Step Deployment Instructions

### Step 1: Access Vercel Project Settings

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **CartVerse** project
3. Click on **Settings** (top navigation)

### Step 2: Add Environment Variables

1. In the left sidebar, click **Environment Variables**
2. Add the following variables (copy exactly):

#### **Frontend Variables** (Required for Supabase)
These enable the frontend to connect to Supabase:

```
Name: VITE_SUPABASE_URL
Value: https://yjzkfwyattiibfgnngiv.supabase.co
Environments: Production, Preview, Development
```

```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlqemtmd3lhdHRpaWJmZ25uZ2l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNTE4NjUsImV4cCI6MjEwMzgyNzg2NX0.AjmaFKcARU0MOJHnUI-0PcLUOkQwtM9xC16AfFjgUJA
Environments: Production, Preview, Development
```

#### **Backend Variables** (Required for Database)
```
Name: DATABASE_URL
Value: postgresql://postgres.yjzkfwyattiibfgnngiv:Ashunila@2005@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&schema=public
Environments: Production
```

```
Name: DIRECT_URL
Value: postgresql://postgres.yjzkfwyattiibfgnngiv:Ashunila@2005@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?schema=public
Environments: Production
```

```
Name: JWT_SECRET
Value: your_secure_jwt_secret_generate_strong_random_string
Environments: Production
```

```
Name: CORS_ORIGIN
Value: https://your-vercel-domain.vercel.app
Environments: Production
```

```
Name: NODE_ENV
Value: production
Environments: Production
```

### Step 3: Verify Environment Variables

After adding all variables, you should see them listed:

```
✓ VITE_SUPABASE_URL (Production, Preview, Development)
✓ VITE_SUPABASE_ANON_KEY (Production, Preview, Development)
✓ DATABASE_URL (Production)
✓ DIRECT_URL (Production)
✓ JWT_SECRET (Production)
✓ CORS_ORIGIN (Production)
✓ NODE_ENV (Production)
```

### Step 4: Redeploy Your Application

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Redeploy** (or wait for auto-redeploy if you have it enabled)
4. Wait for build to complete (~2-3 minutes)

### Step 5: Verify Deployment Success

After deployment completes:

1. Visit your Vercel app URL: `https://your-app.vercel.app`
2. Check the browser console (F12) for any errors
3. Test the login functionality
4. Verify the admin panel loads
5. Check `/debug-env` page to see configuration status

---

## 🔍 Troubleshooting

### Issue: "Invalid supabaseUrl" Error

**Cause:** Environment variables not set or not loaded during build.

**Solution:**
1. Verify variables are set in Vercel dashboard
2. Click "Redeploy" to rebuild with new env vars
3. Check that variable names exactly match (case-sensitive)
4. Ensure `VITE_` prefix is present for frontend variables

### Issue: Database Connection Fails

**Cause:** DATABASE_URL not set or invalid connection string.

**Solution:**
1. Verify DATABASE_URL is in Vercel Production environment
2. Use pooling endpoint (`:6543` with `pgbouncer=true`)
3. Test connection string locally first
4. Check Supabase project credentials haven't changed

### Issue: CORS Errors

**Cause:** CORS_ORIGIN not matching your Vercel domain.

**Solution:**
1. Update CORS_ORIGIN to your actual Vercel domain
2. Format: `https://your-app.vercel.app` (no trailing slash)
3. Redeploy after updating

### Issue: Admin Login Not Working

**Cause:** JWT_SECRET missing or database not reachable.

**Solution:**
1. Verify JWT_SECRET is set (any strong random string works)
2. Check database connection is working
3. Verify ADMIN user exists in database
4. Check server logs in Vercel dashboard

---

## 📋 Complete Environment Variables Reference

### Frontend Variables (with VITE_ prefix)
| Variable | Purpose | Example |
|----------|---------|---------|
| VITE_SUPABASE_URL | Supabase project URL | https://yjzkfwyattiibfgnngiv.supabase.co |
| VITE_SUPABASE_ANON_KEY | Supabase public key | eyJhbGciOiJ... |
| VITE_API_PROXY_TARGET | API backend URL | http://localhost:5000 |

### Backend Variables (no prefix)
| Variable | Purpose | Example |
|----------|---------|---------|
| DATABASE_URL | PostgreSQL connection (pooler) | postgresql://user:pass@host:6543/db?pgbouncer=true |
| DIRECT_URL | PostgreSQL connection (direct) | postgresql://user:pass@host:5432/db |
| JWT_SECRET | Secret for signing JWT tokens | any_strong_random_string |
| CORS_ORIGIN | Frontend domain for CORS | https://your-app.vercel.app |
| NODE_ENV | Environment type | production |
| PORT | Server port (auto-assigned by Vercel) | 5000 |

---

## 🛠️ Quick Setup Command

If you have Vercel CLI installed:

```bash
# Login to Vercel
vercel login

# Link project
vercel link

# Add production secrets interactively
vercel env pull .env.production.local

# Then manually add the VITE_ variables and redeploy
```

---

## ✅ Pre-Deployment Checklist

Before deploying to Vercel:

- [ ] All 10 tasks completed
- [ ] Local build succeeds: `npm run build`
- [ ] No console errors in development
- [ ] Database credentials are correct
- [ ] All environment variables added to Vercel
- [ ] Git changes committed and pushed
- [ ] Vercel project is linked to your GitHub repo

---

## 📞 Support

- **Vercel Docs:** https://vercel.com/docs/environment-variables
- **Supabase Docs:** https://supabase.com/docs
- **Environment Issue?** Visit `/debug-env` page in your app to see what's configured

---

## 🎯 Expected Result After Deployment

✅ App loads without "Invalid supabaseUrl" error  
✅ User registration works  
✅ Admin login works  
✅ Database queries execute successfully  
✅ AI assistant responds properly  
✅ Mobile layouts render correctly  
✅ User count displays in admin panel  

**Your CartVerse e-commerce app is now live on production! 🚀**

