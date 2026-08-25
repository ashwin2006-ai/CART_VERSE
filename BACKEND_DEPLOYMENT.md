# Backend Deployment Instructions

Your e-commerce app has two parts:
- **Frontend:** Deployed on Vercel (https://e-commerce-virid-delta.vercel.app)
- **Backend:** Needs to be deployed to a server (choose one option below)

## Option 1: Render.com (Recommended) ⭐

### Steps:
1. Visit https://render.com/register
2. Sign up using GitHub (recommended)
3. Go to Dashboard → **New** → **Blueprint**
4. Connect your GitHub repository
5. Render will auto-detect `render.yaml` and configure everything
6. Click **Deploy Blueprint**
7. Wait 5-10 minutes for deployment

**Your backend URL will be:** `https://e-commerce-api-XXXXX.onrender.com`

### After Deployment:
Once you have the URL, run this command in your project directory:

```bash
node scripts/setup-backend-url.js https://e-commerce-api-XXXXX.onrender.com
```

This will:
- Update `.env.production.local` with your backend URL
- Display next steps for finalizing the setup

---

## Option 2: Railway.app (Also Great) 🚂

### Steps:
1. Visit https://railway.app/
2. Sign up using GitHub
3. Create **New Project** → **Deploy from GitHub**
4. Select your repository
5. Add **MySQL Database** service
6. Set environment variables (from `.env.production`)
7. Deploy

**Your backend URL will be:** `https://your-service-name.railway.app`

### After Deployment:
```bash
node scripts/setup-backend-url.js https://your-service-name.railway.app
```

---

## Option 3: Heroku (Legacy but still works)

Heroku now has a paid model, but you can try:
1. Visit https://www.heroku.com/
2. Create account
3. Connect GitHub
4. Deploy the repository
5. Add MySQL database add-on
6. Deploy

---

## Verification Checklist

After deployment, verify everything works:

### 1. Check Backend Health
```bash
curl https://your-backend-url/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "CartVerse Node.js/Express + MySQL (Prisma) Backend",
  "version": "2.0.0",
  "database": "MySQL (Prisma ORM)"
}
```

### 2. Check Products Endpoint
```bash
curl https://your-backend-url/api/products?page=1&limit=10
```

Should return products with `"success": true`

### 3. Test Full Stack
1. Open https://e-commerce-virid-delta.vercel.app/
2. Open DevTools (F12)
3. Go to **Network** tab
4. Refresh page
5. Look for `/api/products` requests
6. They should succeed with status 200

---

## Configuration Files

The deployment is configured in:

- **`render.yaml`** - For Render.com deployment (auto-detected)
- **`railway.json`** - For Railway.app deployment (alternative)
- **`.env.production`** - Production environment variables
- **`.env.production.local`** - Your specific backend URL (ignored in git)

---

## Environment Variables Set During Deployment

The backend needs these variables (set in your deployment platform):

```
NODE_ENV=production
PORT=10000 (for Render; varies for other platforms)
DATABASE_URL=<auto-injected by platform>
JWT_SECRET=cartverse_jwt_secret_key_2026_super_secure_production
FLIPKART_AFFILIATE_ID=cartvers01
FLIPKART_AFFILIATE_TOKEN=fk_aff_tok_998a4e12e345b801a6bc
FLIPKART_API_BASE_URL=https://affiliate-api.flipkart.net/affiliate/1.0
CORS_ORIGIN=https://e-commerce-virid-delta.vercel.app
```

---

## Troubleshooting

### Backend shows "unhealthy"
- Check the deployment logs
- Ensure MySQL database is running
- Verify environment variables are set

### Frontend can't reach backend
- Verify `VITE_API_URL` in `.env.production.local`
- Check browser console for CORS errors
- Confirm backend URL is correct
- Wait a few minutes for Vercel redeploy

### Database connection fails
- Check DATABASE_URL environment variable
- Ensure database service is created
- Verify database credentials

### Service keeps crashing
- Check error logs in deployment platform
- Look for missing dependencies
- Verify Node.js version compatibility

---

## Cost Notes

- **Render.com**: Free tier available, auto-pauses after 15 min (restart on next request)
- **Railway.app**: Free credits monthly (~$5 worth)
- **Heroku**: Paid services (no free tier anymore)

For a free, always-running backend, Render with auto-pause is fine for development.

---

## Next Steps

1. Choose a deployment platform (Render recommended)
2. Complete the deployment
3. Get your backend URL
4. Run the setup script with your URL
5. Wait for Vercel redeploy (1-2 minutes)
6. Test the full stack

**Need help?** Check the logs in your deployment platform's dashboard.
