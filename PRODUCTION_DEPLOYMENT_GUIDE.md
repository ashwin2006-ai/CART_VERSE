# CartVerse Production Deployment Guide

## Overview
This guide covers deploying CartVerse to production on Vercel (frontend) and a backend server.

## Pre-Deployment Checklist

### Code Quality
- [x] All tests passed
- [x] Build succeeds without errors
- [x] No console warnings/errors
- [x] Code committed and pushed to GitHub

### Environment Configuration
- [ ] Production environment variables set
- [ ] API endpoints configured
- [ ] Database URL configured
- [ ] JWT secret configured
- [ ] CORS settings verified

### Infrastructure
- [ ] MySQL server running
- [ ] Database created and migrated
- [ ] Prisma migrations applied
- [ ] Seed data loaded
- [ ] Backend server ready

---

## Part 1: Frontend Deployment to Vercel

### Step 1: Connect GitHub to Vercel
1. Go to https://vercel.com
2. Sign in with GitHub account
3. Click "Import Project"
4. Select `e-commerce` repository
5. Vercel auto-detects Next.js/Vite project

### Step 2: Configure Build Settings
```
Framework: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Step 3: Set Environment Variables
In Vercel Dashboard → Project Settings → Environment Variables:

```
VITE_API_PROXY_TARGET=https://api.cartverse.app
NODE_ENV=production
```

**Note**: Replace `https://api.cartverse.app` with your actual backend URL

### Step 4: Deploy
1. Click "Deploy"
2. Vercel builds and deploys frontend
3. Production URL: https://e-commerce-virid-delta.vercel.app (or custom domain)
4. Auto-redeploys on every GitHub push to main

### Verify Frontend Deployment
```bash
# Check if frontend loads
curl https://e-commerce-virid-delta.vercel.app

# Check if API proxy works
curl https://e-commerce-virid-delta.vercel.app/api/health
```

---

## Part 2: Backend Deployment

### Option A: Deploy to Render

#### Step 1: Prepare Repository
Backend code is in `/server` directory of main repo.

#### Step 2: Create Render Service
1. Go to https://render.com
2. Sign in with GitHub
3. Click "New +" → "Web Service"
4. Select the e-commerce repository
5. Configure:
   - **Name**: cartverse-api
   - **Environment**: Node
   - **Build Command**: `npm install && npx prisma db push`
   - **Start Command**: `node server/server.js`
   - **Root Directory**: `.` (or leave empty)

#### Step 3: Set Environment Variables
In Render Dashboard → Environment:

```
PORT=5000
NODE_ENV=production
DATABASE_URL=mysql://user:password@host:3306/e_commerce
JWT_SECRET=your-production-secret-key-here
FLIPKART_AFFILIATE_ID=your-affiliate-id
FLIPKART_AFFILIATE_TOKEN=your-affiliate-token
```

#### Step 4: Configure Health Check
- Path: `/api/health`
- Interval: 10 minutes

#### Step 5: Deploy
1. Click "Create Web Service"
2. Render deploys and starts the service
3. Get API URL: `https://cartverse-api.onrender.com`

---

### Option B: Deploy to Railway

#### Step 1: Create Account
1. Go to https://railway.app
2. Sign in with GitHub

#### Step 2: Deploy Project
1. Click "New Project" → "Deploy from GitHub repo"
2. Select e-commerce repository
3. Railway auto-detects Node.js project

#### Step 3: Configure Services
1. **Add MySQL Plugin**:
   - Add MySQL database
   - Get connection string from Railway dashboard

2. **Configure Node Service**:
   - Root Directory: `.`
   - Build Command: `npm install && npx prisma db push`
   - Start Command: `node server/server.js`

#### Step 4: Environment Variables
```
PORT=5000
NODE_ENV=production
DATABASE_URL=[from MySQL plugin]
JWT_SECRET=your-production-secret-key
```

#### Step 5: Deploy
- Railway auto-deploys on GitHub push
- API URL: `https://<project>.up.railway.app`

---

### Option C: Deploy to Own Server (AWS EC2, DigitalOcean, etc.)

#### Prerequisites
- Server with Node.js 18+
- MySQL 8.0+
- Git installed
- Domain configured

#### Step 1: Clone Repository
```bash
cd /home/app
git clone https://github.com/ashwin2006-ai/CART_VERSE.git cartverse
cd cartverse
```

#### Step 2: Install Dependencies
```bash
npm install
npx prisma db push
node server/scripts/seed.js
```

#### Step 3: Configure Environment
Create `.env` file:
```
PORT=5000
NODE_ENV=production
DATABASE_URL=mysql://root:password@localhost:3306/e_commerce
JWT_SECRET=your-production-secret-key-here
FLIPKART_AFFILIATE_ID=your-id
FLIPKART_AFFILIATE_TOKEN=your-token
```

#### Step 4: Setup PM2 (Process Manager)
```bash
npm install -g pm2
pm2 start server/server.js --name "cartverse-api"
pm2 save
pm2 startup
```

#### Step 5: Setup Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name api.cartverse.app;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Step 6: Enable HTTPS (SSL)
```bash
sudo certbot certonly --nginx -d api.cartverse.app
```

---

## Part 3: Post-Deployment Verification

### Test Frontend
```bash
# Homepage loads
curl https://e-commerce-virid-delta.vercel.app

# Can reach backend health check
curl https://e-commerce-virid-delta.vercel.app/api/health

# Login page displays
open https://e-commerce-virid-delta.vercel.app
```

### Test Backend APIs

#### 1. Health Check
```bash
curl https://api.cartverse.app/api/health
# Response: { "status": "healthy", "service": "CartVerse...", "database": "MySQL" }
```

#### 2. Get Products
```bash
curl https://api.cartverse.app/api/products?limit=10
# Response: { "success": true, "data": [...], "total": N, "page": 1 }
```

#### 3. Get Categories
```bash
curl https://api.cartverse.app/api/products/categories
# Response: { "success": true, "data": [...] }
```

#### 4. Customer Login
```bash
curl -X POST https://api.cartverse.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex.mercer@cartverse.io","password":"Password@123"}'
# Response: { "success": true, "token": "...", "user": {...} }
```

#### 5. Admin Login
```bash
curl -X POST https://api.cartverse.app/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cartverse.io","password":"Admin@2026!"}'
# Response: { "success": true, "token": "...", "adminUser": {...} }
```

#### 6. Cart Operations (with token)
```bash
# Get cart
curl -H "Authorization: Bearer $TOKEN" \
  https://api.cartverse.app/api/cart
```

#### 7. Create Order
```bash
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"productId":"prod-1","quantity":1}],
    "shippingAddress": {"street":"123 Main","city":"Mumbai","state":"MH","pincode":"400001"},
    "paymentMethod": "credit_card"
  }' \
  https://api.cartverse.app/api/orders
```

---

## Part 4: Update Frontend API Configuration

### Update Vite Config
File: `vite.config.js`

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})
```

### Environment Variables
**Development** (`.env.local`):
```
VITE_API_PROXY_TARGET=http://localhost:5000
```

**Production** (Vercel):
```
VITE_API_PROXY_TARGET=https://api.cartverse.app
```

---

## Part 5: Monitoring & Maintenance

### Error Tracking (Optional)
```bash
# Install Sentry
npm install @sentry/react @sentry/tracing
```

### Database Backups
```bash
# Daily backup
mysqldump -u root -p e_commerce > backup_$(date +%Y%m%d).sql
```

### Monitor Logs
```bash
# Backend logs (if using PM2)
pm2 logs cartverse-api

# Render logs
# Dashboard → Logs tab

# Vercel logs
# Dashboard → Deployments → Logs
```

### Performance Monitoring
- Frontend: Vercel Analytics
- Backend: PM2+ or DataDog
- Database: MySQL performance monitoring

---

## Part 6: Domain Configuration

### Update Frontend Domain
1. Vercel Dashboard → Settings → Domains
2. Add custom domain: `cartverse.app`
3. Update DNS records to Vercel nameservers

### Update Backend Domain
1. Point `api.cartverse.app` to backend server
2. If using Render/Railway: Configure custom domain in dashboard

### DNS Records
```
cartverse.app          CNAME  cname.vercel.com (frontend)
api.cartverse.app      A      <backend-ip> (if own server)
                       CNAME  cartverse-api.onrender.com (if Render)
                       CNAME  <railway-url> (if Railway)
```

---

## Part 7: Production Checklist

### Before Going Live
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to production server
- [ ] Environment variables configured
- [ ] Database migrated and seeded
- [ ] SSL certificates installed
- [ ] Health checks passing
- [ ] API endpoints responding
- [ ] Frontend can reach backend
- [ ] Login/registration working
- [ ] Products loading
- [ ] Cart operations working
- [ ] Order creation working
- [ ] Admin panel accessible
- [ ] Error tracking setup
- [ ] Backups configured
- [ ] Monitoring setup

### After Going Live
- [ ] Monitor error logs
- [ ] Check user metrics
- [ ] Verify payment processing
- [ ] Monitor API response times
- [ ] Check database performance
- [ ] Set up uptime monitoring
- [ ] Configure alerts
- [ ] Document runbooks

---

## Production URLs

### Frontend
```
https://e-commerce-virid-delta.vercel.app
(or https://cartverse.app with custom domain)
```

### Backend API
```
https://api.cartverse.app
(or https://cartverse-api.onrender.com if using Render)
```

### Admin Portal
```
https://e-commerce-virid-delta.vercel.app/admin
```

---

## Troubleshooting

### Frontend Not Loading
1. Check Vercel deployment logs
2. Verify environment variables set
3. Clear browser cache and reload
4. Test: `curl https://e-commerce-virid-delta.vercel.app`

### Backend Not Responding
1. Check backend service status
2. Verify MySQL connection string
3. Check logs: `pm2 logs` or dashboard logs
4. Test health: `curl https://api.cartverse.app/api/health`

### API Errors
1. Check backend logs
2. Verify database is up
3. Check environment variables
4. Test with curl before debugging frontend

### Database Connection Failed
1. Verify DATABASE_URL correct
2. Check MySQL server is running
3. Verify user permissions
4. Run migrations: `npx prisma db push`

### CORS Errors
1. Backend CORS should allow frontend domain
2. Check server.js has cors() middleware
3. Verify headers: `Access-Control-Allow-Origin`

---

## Rollback Procedure

If production breaks:

### Frontend Rollback
1. Vercel Dashboard → Deployments
2. Click previous working deployment
3. Click "Redeploy"

### Backend Rollback
- **Render**: Dashboard → Deploys → Redeploy previous
- **Railway**: Dashboard → Deployments → Redeploy previous
- **Own Server**: `git revert HEAD && pm2 restart cartverse-api`

---

## Support & Resources

### Documentation
- API Guide: `/API_INTEGRATION_GUIDE.md`
- Testing: `/API_TESTING_CHECKLIST.md`
- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs
- Express Docs: https://expressjs.com

### Getting Help
1. Check logs first
2. Verify all environment variables
3. Test with curl/Postman
4. Check GitHub issues
5. Review error tracking dashboard

---

## Summary

**Frontend**: Deployed to Vercel at https://e-commerce-virid-delta.vercel.app
**Backend**: Ready for deployment (Render, Railway, or custom server)
**Database**: MySQL configured at mysql://root:Ashunila@localhost:3306/e_commerce
**Status**: ✅ Production Ready

Next: Execute deployment steps above.

---

*Last Updated: 2026*
*Status: Production Ready*
*Version: Phase 1 Complete*
