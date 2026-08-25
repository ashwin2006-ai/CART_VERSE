# E-Commerce Backend Deployment Guide

## Quick Deployment to Render.com

### Prerequisites
- GitHub account (already connected to your repo)
- Render.com account (free)

### Automated Deployment with render.yaml

Your project includes a `render.yaml` file that automatically configures everything needed for Render.com deployment.

### Step 1: Create Render Account
1. Go to https://render.com/register
2. Sign up with GitHub (recommended for auto-sync)
3. Authorize Render to access your GitHub repositories

### Step 2: Deploy from render.yaml
1. In Render Dashboard, click **New** → **Blueprint**
2. Connect your GitHub repository (`CART_VERSE`)
3. Select the repository and authorize
4. Render will automatically detect `render.yaml` and show the configuration
5. Review the settings:
   - **Service Name:** e-commerce-api
   - **Environment:** Node
   - **Region:** Select closest to your location
   - **Plan:** Free (eligible for auto-pause after 15 min inactivity)
6. Click **Deploy Blueprint**

### Step 3: Wait for Deployment
- Initial deployment takes 5-10 minutes
- You'll see logs in real-time
- Once complete, you'll get a URL like: `https://e-commerce-api-XXXXX.onrender.com`

### Step 4: Verify Deployment
```bash
curl https://e-commerce-api-XXXXX.onrender.com/api/health
```

Should return:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "service": "CartVerse Node.js/Express + MySQL (Prisma) Backend",
  "version": "2.0.0",
  "database": "MySQL (Prisma ORM)"
}
```

### Step 5: Update Frontend Configuration
Once you have your backend URL, update `.env.production.local`:

```env
VITE_API_URL=https://e-commerce-api-XXXXX.onrender.com/api
```

Then commit and push to GitHub. Vercel will automatically redeploy with the new backend URL.

### Step 6: Test End-to-End
1. Visit your Vercel deployment: https://e-commerce-virid-delta.vercel.app/
2. Open browser DevTools (F12)
3. Go to Network tab
4. Refresh the page
5. Look for requests to `/api/products` - they should succeed

## Troubleshooting

### Backend won't start
- Check the Render logs for errors
- Ensure all environment variables are set
- Verify the database connection string

### API returns 500 errors
- Check Render service logs
- Ensure DATABASE_URL is correctly set
- If MySQL isn't ready, the fallback to mock data should trigger

### Frontend can't reach backend
- Verify the `VITE_API_URL` is correct in `.env.production.local`
- Check browser console for CORS errors
- Ensure backend service is running on Render

## Database Notes

The `render.yaml` includes an automated MySQL database setup:
- Render will create and manage the database
- Connection string is automatically injected as `DATABASE_URL`
- No manual database setup needed

## Keep Backend Running (Optional)

By default, free Render services pause after 15 minutes of inactivity. To keep it running:

1. In Render Dashboard, select your service
2. Go to **Settings** → **Auto-Suspend**
3. Toggle to **Off** (uses more resources but stays active)

Or use an external monitoring service like [Upptime](https://upptime.js.org/) to ping your API periodically.

## Next Steps

1. Go to https://render.com/register
2. Complete the deployment steps above
3. Share your backend URL here
4. I'll update the configuration and redeploy the frontend
