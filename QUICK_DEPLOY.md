# Quick Deployment Summary

## What You Need to Do:

### Step 1: Get Free MySQL (5 minutes)
Go to **https://planetscale.com/register**
- Sign up (free, no credit card)
- Create a new database
- Click "Connect" and copy the MySQL connection string
- Example: `mysql://xxxxxxxxxxxx:pscale_pw_xxxxxx@aws.connect.psdb.cloud/cartverse?sslaccept=strict`

### Step 2: Deploy to Render (5 minutes)
Go to **https://render.com**
- Sign up/login with GitHub
- Click **New** → **Web Service**
- Select your `CART_VERSE` repository
- Fill in:
  - **Name:** `e-commerce-api`
  - **Environment:** Node
  - **Build Command:** `npm install`
  - **Start Command:** `node server/server.js`
  - **Plan:** Free
- Click **Advanced** or scroll down to **Environment Variables**
- Add these variables:
  ```
  NODE_ENV=production
  PORT=10000
  DATABASE_URL=<paste-your-planetscale-string-here>
  JWT_SECRET=cartverse_jwt_secret_key_2026_super_secure_production
  FLIPKART_AFFILIATE_ID=cartvers01
  FLIPKART_AFFILIATE_TOKEN=fk_aff_tok_998a4e12e345b801a6bc
  FLIPKART_API_BASE_URL=https://affiliate-api.flipkart.net/affiliate/1.0
  CORS_ORIGIN=https://e-commerce-virid-delta.vercel.app
  ```
- Click **Deploy**
- Wait 5-10 minutes
- Copy your URL (e.g., `https://e-commerce-api-xxxxx.onrender.com`)

### Step 3: Update Frontend (2 minutes)
In your project folder, run:
```bash
node scripts/setup-backend-url.js https://e-commerce-api-xxxxx.onrender.com
```

Then:
```bash
git add .env.production.local
git commit -m "Update production backend URL"
git push
```

Vercel auto-redeploys (2-3 minutes)

### Step 4: Test (1 minute)
Visit: https://e-commerce-virid-delta.vercel.app/
- Check DevTools (F12) → Network
- Products should load from your backend
- No more 500 errors ✅

---

## Total Time: ~20 minutes

1. PlanetScale signup & DB creation: 5 min
2. Render deployment: 10 min
3. Update frontend config: 2 min
4. Test: 1-2 min
5. Vercel auto-redeploy: 3 min

---

## Troubleshooting:

### Render deployment stuck?
- Check the logs in Render dashboard
- Verify DATABASE_URL is set

### Frontend still shows errors?
- Wait for Vercel redeploy (check deployment status)
- Clear browser cache (Ctrl+Shift+Delete)
- Open DevTools and look for actual error messages

### MySQL connection failed?
- Verify DATABASE_URL is correct
- PlanetScale requires SSL (the connection string includes `?sslaccept=strict`)
- Check PlanetScale dashboard that database exists

---

## Documentation Files:

- **RENDER_MYSQL_SETUP.md** - Detailed setup guide with multiple MySQL options
- **DEPLOYMENT_GUIDE.md** - General deployment information
- **BACKEND_DEPLOYMENT.md** - Comprehensive backend deployment docs

---

## That's it! 🚀

Once deployed, your e-commerce app will have:
- ✅ Frontend on Vercel
- ✅ Backend on Render
- ✅ MySQL database on PlanetScale
- ✅ Full API connectivity
