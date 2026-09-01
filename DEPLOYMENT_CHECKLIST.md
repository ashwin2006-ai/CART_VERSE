# ✅ Deployment Checklist

Track your progress through the deployment steps.

## Phase 1: Preparation ✅ COMPLETE

- [x] Code committed to GitHub (main branch)
- [x] Backend is production-ready
- [x] Prisma schema configured for PostgreSQL
- [x] Environment variables documented
- [x] Security audit completed
- [x] Credentials removed from documentation
- [x] `.env.production` template created

**Status**: Ready to deploy! 🚀

---

## Phase 2: Railway Deployment (DO THIS NOW)

### Step 1: Create Railway Project
- [ ] Go to https://railway.app
- [ ] Login with GitHub
- [ ] Click "New Project"
- [ ] Select "Deploy from GitHub repo"
- [ ] Search and select `CART_VERSE`

**Status**: ⏳ Waiting for you...

---

### Step 2: Add Environment Variables

Add these in Railway dashboard (click **Variables** tab):

- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `5000`
- [ ] `JWT_SECRET` = `[generate random 32+ char string]`
- [ ] `DATABASE_URL` = `postgresql://postgres:Ashunila%402005@db.yjzkfwyattiibfgnngiv.supabase.co:5432/postgres?schema=public`
- [ ] `SUPABASE_URL` = `https://yjzkfwyattiibfgnngiv.supabase.co`
- [ ] `SUPABASE_ANON_KEY` = `[your key from Supabase]`
- [ ] `CORS_ORIGIN` = `http://localhost:3000`
- [ ] `FLIPKART_AFFILIATE_ID` = `cartvers01`
- [ ] `FLIPKART_AFFILIATE_TOKEN` = `fk_aff_tok_xxx`
- [ ] `FLIPKART_API_BASE_URL` = `https://affiliate-api.flipkart.net/affiliate/1.0`

**Important**: The `@` in your password MUST be encoded as `%40` in DATABASE_URL

---

### Step 3: Deploy
- [ ] Click **Deploy** button
- [ ] Watch the build logs
- [ ] Wait for ✅ "Deployment Successful" message
- [ ] Takes about 2-3 minutes

**Build should do**:
1. Install npm packages
2. Generate Prisma client
3. Start the server
4. Create Supabase tables automatically

---

### Step 4: Get Deployment URL
- [ ] Go to **Deployments** tab
- [ ] Click active (green) deployment
- [ ] Copy **Public URL** (format: `https://cartverse-xxxxx.railway.app`)
- [ ] Save this URL - you'll need it!

---

## Phase 3: Verification

### Test API Health
```bash
curl https://your-railway-url.railway.app/api/health
```
- [ ] Returns `{"status": "healthy"}`
- [ ] No 502 or 504 errors
- [ ] Response time < 2 seconds

---

### Check Database Connection
- [ ] Go to Railway Logs tab
- [ ] Look for: `"🐘 PostgreSQL Database (Supabase): CONNECTED & READY"`
- [ ] No connection errors in logs

---

### Verify Tables Created in Supabase
1. [ ] Go to https://app.supabase.com
2. [ ] Select your project
3. [ ] Click **SQL Editor** or **Tables**
4. [ ] Verify these tables exist:
   - [ ] `users`
   - [ ] `products`
   - [ ] `categories`
   - [ ] `orders`
   - [ ] `cart_items`
   - [ ] `wishlist_items`
   - [ ] `reviews`
   - [ ] `coupons`
   - [ ] `addresses`
   - [ ] `order_items`
   - [ ] `flipkart_products`

---

### Test API Endpoints

```bash
# Replace YOUR_URL with your Railway URL

# Get products
curl https://YOUR_URL/api/products

# Get categories
curl https://YOUR_URL/api/categories

# Get health status
curl https://YOUR_URL/api/status
```

- [ ] All endpoints respond with data
- [ ] No authentication errors
- [ ] CORS headers present in response

---

## Phase 4: Post-Deployment

- [ ] Backend is live and accessible
- [ ] Database connected and ready
- [ ] All tables created successfully
- [ ] API endpoints responding correctly
- [ ] ⏭️ Next: Deploy frontend to Vercel
- [ ] ⏭️ Update frontend API URL
- [ ] ⏭️ Test full integration

---

## Status Summary

| Phase | Status | ETA |
|-------|--------|-----|
| Preparation | ✅ COMPLETE | - |
| Railway Deployment | ⏳ IN PROGRESS | < 5 min |
| Verification | ⏳ WAITING | < 10 min |
| Production Ready | ⏳ PENDING | After Phase 3 |

---

## Emergency Contacts

**If deployment fails:**

1. Check Railway logs for errors
2. Verify all environment variables are set
3. Check database password is URL-encoded
4. Try redeploying from Railway dashboard

**Resources:**
- Railway Docs: https://docs.railway.app
- Supabase Docs: https://supabase.com/docs
- Error Logs: Railway Deployments → Logs tab

---

## Progress Tracking

**Start Time**: [When you begin]  
**Deployment URL**: [Will fill after deployment]  
**Completion Time**: [When all tests pass]

---

**Let me know when you've completed the deployment and I'll help verify everything! 🚀**
