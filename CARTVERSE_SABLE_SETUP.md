# Setup cartverse-sable as Frontend

## Goal
Make `https://cartverse-sable.vercel.app/` the frontend for this CartVerse project

## Step 1: Connect cartverse-sable Project to This Repository

1. Go to https://vercel.com/dashboard
2. Click on the **cartverse-sable** project
3. Click **Settings** → **Git**
4. Under "Project" section, change the Git repository to point to **this project's repository**
   - If using GitHub: Select your GitHub repo for e-commerce
   - Verify branch is set to `main`

## Step 2: Update Environment Variables in cartverse-sable

1. In the **cartverse-sable** project dashboard
2. Click **Settings** → **Environment Variables**
3. Add/Update these variables:

### Frontend Variables (VITE_ prefix)
```
VITE_SUPABASE_URL
https://yjzkfwyattiibfgnngiv.supabase.co
Environments: Production, Preview, Development
```

```
VITE_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlqemtmd3lhdHRpaWJmZ25uZ2l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNTE4NjUsImV4cCI6MjEwMzgyNzg2NX0.AjmaFKcARU0MOJHnUI-0PcLUOkQwtM9xC16AfFjgUJA
Environments: Production, Preview, Development
```

```
VITE_API_PROXY_TARGET
https://your-backend-api-url.com
Environments: Production, Preview, Development
```

## Step 3: Update CORS_ORIGIN

This is important - the backend needs to allow requests from cartverse-sable:

```
CORS_ORIGIN
https://cartverse-sable.vercel.app
Environments: Production
```

**Where to set CORS_ORIGIN:**
- If backend is on same Vercel project: Set in the backend environment
- If backend is separate: Set in the backend project's environment variables

## Step 4: Redeploy

1. In **cartverse-sable** project
2. Go to **Deployments**
3. Click **⋮** on the latest deployment
4. Select **Redeploy**
5. Wait for build to complete (2-3 minutes)

## Step 5: Verify

Visit: https://cartverse-sable.vercel.app/

Check:
- [ ] App loads without errors
- [ ] No "Invalid supabaseUrl" errors
- [ ] Can see products
- [ ] Can register/login
- [ ] Admin panel accessible
- [ ] Mobile responsive
- [ ] AI assistant works

---

## ✅ Final Configuration

After setup, cartverse-sable will have:
- ✅ This project's frontend code
- ✅ Connection to PostgreSQL database
- ✅ Connection to Supabase authentication
- ✅ All features working (CRUD, AI, auth, profiles)
- ✅ Mobile responsive design

---

## 🔗 Architecture After Setup

```
User Browser
    ↓
https://cartverse-sable.vercel.app/ (Frontend)
    ↓
API Gateway (/api proxy)
    ↓
Backend (Express.js)
    ↓
PostgreSQL (Supabase)
```

---

## 🐛 Troubleshooting

**Issue: "Invalid supabaseUrl" error**
- Solution: Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set correctly

**Issue: CORS errors when calling API**
- Solution: Update CORS_ORIGIN in backend environment to https://cartverse-sable.vercel.app

**Issue: Build fails**
- Solution: Check that all VITE_ variables are present before Vercel build runs

**Issue: Database connection fails**
- Solution: Verify DATABASE_URL is correct in backend environment

---

## 📝 Environment Variables Needed

| Variable | Where | Value |
|----------|-------|-------|
| VITE_SUPABASE_URL | cartverse-sable | https://yjzkfwyattiibfgnngiv.supabase.co |
| VITE_SUPABASE_ANON_KEY | cartverse-sable | eyJhbGciOiJ... |
| CORS_ORIGIN | Backend project | https://cartverse-sable.vercel.app |
| DATABASE_URL | Backend project | postgresql://... |

---

**That's it! cartverse-sable will now be your frontend.** ✨

