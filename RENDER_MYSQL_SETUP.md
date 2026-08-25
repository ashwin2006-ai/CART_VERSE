# Deploy to Render.com with External MySQL

Since Render doesn't host MySQL natively, we'll use a free external MySQL service. Here are your options:

## Option 1: PlanetScale (Recommended - Free MySQL) ⭐

PlanetScale provides free MySQL hosting that works perfectly with Render.

### Steps:

1. **Create PlanetScale Account:**
   - Go to https://planetscale.com/register
   - Sign up (free tier available)
   - Create a new database

2. **Get Your MySQL Connection String:**
   - In PlanetScale dashboard, go to your database
   - Click "Connect"
   - Copy the MySQL connection string (looks like: `mysql://user:password@host/dbname`)

3. **Deploy to Render:**
   - Go to https://render.com
   - Click **New** → **Web Service**
   - Connect your GitHub repository (`CART_VERSE`)
   - Configure:
     - **Name:** e-commerce-api
     - **Environment:** Node
     - **Build Command:** `npm install`
     - **Start Command:** `node server/server.js`
     - **Plan:** Free
   - In **Environment Variables**, add:
     ```
     NODE_ENV=production
     PORT=10000
     DATABASE_URL=<your-planetscale-connection-string>
     JWT_SECRET=cartverse_jwt_secret_key_2026_super_secure_production
     FLIPKART_AFFILIATE_ID=cartvers01
     FLIPKART_AFFILIATE_TOKEN=fk_aff_tok_998a4e12e345b801a6bc
     FLIPKART_API_BASE_URL=https://affiliate-api.flipkart.net/affiliate/1.0
     CORS_ORIGIN=https://e-commerce-virid-delta.vercel.app
     ```
   - Click **Deploy**

4. **Wait for Deployment:**
   - Takes 5-10 minutes
   - You'll get a URL like: `https://e-commerce-api-xxxxx.onrender.com`

---

## Option 2: Railway.app with MySQL

Railway also offers free MySQL hosting.

### Steps:

1. **Go to Railway:** https://railway.app/
2. **Create Project** → **Deploy from GitHub**
3. Select your repository
4. Add **MySQL** database service
5. Add **Node.js** service with environment variables (same as above)
6. Deploy

---

## Option 3: Aiven (Free Tier Available)

Aiven offers free MySQL hosting:
- Go to https://aiven.io/
- Create account
- Create MySQL database
- Use connection string in Render

---

## Quick Setup Checklist:

- [ ] Create external MySQL account (PlanetScale recommended)
- [ ] Get MySQL connection string
- [ ] Go to Render.com and create account
- [ ] Deploy web service with your repo
- [ ] Set environment variables including DATABASE_URL
- [ ] Wait for deployment to complete
- [ ] Copy the backend URL (e.g., `https://e-commerce-api-xxxxx.onrender.com`)

---

## After Deployment:

Once you have the backend URL from Render, run:

```bash
node scripts/setup-backend-url.js https://e-commerce-api-xxxxx.onrender.com
```

Then:
```bash
git add .env.production.local
git commit -m "Update production backend URL"
git push
```

Vercel will auto-redeploy with the new backend URL.

---

## Verify It Works:

```bash
# Check backend health
curl https://e-commerce-api-xxxxx.onrender.com/api/health

# Check products
curl https://e-commerce-api-xxxxx.onrender.com/api/products?page=1&limit=5
```

Both should return JSON responses with `"success": true`.

---

## PlanetScale Free Tier Details:

- Free: Up to 5GB storage, MySQL 8.0
- No credit card required for free tier
- Scales to production when needed
- Great for development and small apps

## Render Free Tier:

- Free web services (auto-pause after 15 min inactivity)
- Pay-as-you-go after free tier depletes
- Good for testing and development

---

## Need Help?

1. Check Render logs if deployment fails
2. Verify DATABASE_URL is set correctly
3. Ensure MySQL database is accessible from Render
4. Check PlanetScale connection limits (free tier has generous limits)
