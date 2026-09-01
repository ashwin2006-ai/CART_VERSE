# 🚀 CartVerse - Full Stack Deployment

**Deploy your e-commerce platform to production in 15 minutes!**

---

## 📌 Quick Links

Choose your preferred format:

| Format | Best For | File |
|--------|----------|------|
| **⚡ Quick Checklist** | Fast deployment | [`DEPLOY_NOW_CHECKLIST.md`](DEPLOY_NOW_CHECKLIST.md) |
| **📖 Detailed Guide** | Step-by-step help | [`FULL_STACK_DEPLOYMENT.md`](FULL_STACK_DEPLOYMENT.md) |
| **🔐 Security Info** | Credential rotation | [`SECURITY_AUDIT_REPORT.md`](SECURITY_AUDIT_REPORT.md) |
| **⏭️ Next Steps** | What to do next | [`NEXT_STEPS.md`](NEXT_STEPS.md) |

---

## 🎯 What You're Deploying

```
CartVerse E-Commerce Platform
├── Frontend (React + Vite)
│   └── Deployed to: Vercel ✨
├── Backend (Express.js)
│   └── Deployed to: Railway 🚂
└── Database (PostgreSQL)
    └── Hosted on: Supabase 🐘
```

---

## ✅ Pre-Deployment Checklist

Before you start, verify:

- [x] Code committed to GitHub (`main` branch)
- [x] Backend is production-ready
- [x] Prisma schema configured for PostgreSQL
- [x] Environment variables documented
- [x] Security audit completed
- [x] All credentials removed from docs
- [ ] **NEW CREDENTIALS GENERATED** ← DO THIS FIRST!

---

## 🔐 SECURITY: Rotate Credentials First

**⚠️ CRITICAL**: You shared credentials earlier. You MUST rotate them:

### Go to Supabase Dashboard

```
1. https://app.supabase.com
2. Select your project
3. Settings → API → Regenerate Anon Key ← Click this
4. Settings → Database → Reset Password ← And this
```

### Generate New JWT_SECRET

```bash
# Generate a random 32-character string
openssl rand -base64 32
```

**Save these three new values** - you'll use them in deployment.

---

## 🚀 Deployment Steps

### Step 1: Deploy Backend to Railway (5 min)

**Go to**: https://railway.app

```
1. Login with GitHub
2. New Project → Deploy from GitHub repo
3. Select: CART_VERSE
4. Add Environment Variables (see checklist)
5. Click Deploy
6. Copy Public URL: https://cartverse-xxxxx.railway.app
```

**Verify**:
```bash
curl https://your-railway-url.railway.app/api/health
# Should return: {"status":"healthy",...}
```

### Step 2: Deploy Frontend to Vercel (3 min)

**Update code first**:
- Edit `vite.config.js` 
- Change proxy target to your Railway URL
- Push to GitHub

**Go to**: https://vercel.com

```
1. Login with GitHub
2. Add New → Project
3. Import: CART_VERSE
4. Add Environment Variable: VITE_API_PROXY_TARGET = [your Railway URL]
5. Click Deploy
6. Copy Project URL: https://cartverse-xxxxx.vercel.app
```

### Step 3: Update Backend CORS (1 min)

**Go back to Railway**:
```
1. Click your project
2. Variables tab
3. Update CORS_ORIGIN = https://your-vercel-url.vercel.app
4. Save (auto-restarts)
```

---

## ✨ Test Your Deployment

### Frontend Works?
```
Open: https://your-vercel-url.vercel.app
- See CartVerse homepage
- Products load
- No console errors
```

### Backend Works?
```bash
curl https://your-railway-url.railway.app/api/health
# Returns: {"status":"healthy","database":"PostgreSQL (Supabase)",...}
```

### Integration Works?
```javascript
// In browser console on Vercel URL:
fetch('https://your-railway-url.railway.app/api/products')
  .then(r => r.json())
  .then(d => console.log(d))
# Returns: Product data (no CORS errors)
```

### Database Works?
```
Go to: https://app.supabase.com
- See all 11 tables created
- users, products, orders, categories, reviews, etc.
```

---

## 📊 Architecture After Deployment

```
┌─────────────────────────────────────────────────────────┐
│                        Internet                          │
└─────────────────────────────────────────────────────────┘
            ↓                                    ↓
    ┌─────────────────┐            ┌─────────────────────┐
    │ Vercel (React)  │            │ Railway (Express)   │
    │ cartverse-*.    │            │ cartverse-*.        │
    │ vercel.app      │            │ railway.app         │
    └─────────────────┘            └─────────────────────┘
            │                                    │
            └────────────────────┬───────────────┘
                                 ↓
                        ┌─────────────────┐
                        │ Supabase        │
                        │ PostgreSQL      │
                        │ (yjzkfwyatti...)│
                        └─────────────────┘
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check Railway logs, verify env vars, check DB password encoding |
| Frontend blank | Verify VITE_API_PROXY_TARGET set, check browser console |
| CORS error | Update CORS_ORIGIN in Railway to Vercel URL |
| Tables missing | Run `npx prisma db push` in Railway shell |
| API 502 error | Check backend is running (green status in Railway) |

See `DEPLOY_NOW_CHECKLIST.md` for more troubleshooting.

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `DEPLOY_NOW_CHECKLIST.md` | ⭐ Use this for quick deployment |
| `FULL_STACK_DEPLOYMENT.md` | Detailed step-by-step guide |
| `SECURITY_AUDIT_REPORT.md` | Security fixes and credential rotation |
| `vite.config.js` | Frontend proxy configuration |
| `railway.json` | Railway deployment config |
| `prisma/schema.prisma` | Database schema |

---

## 🔗 Your Deployment URLs

After deployment, you'll have three URLs:

```
Frontend:  https://cartverse-[random].vercel.app
Backend:   https://cartverse-[random].railway.app
Database:  https://app.supabase.com (dashboard only)
```

---

## 📋 Quick Status

| Component | Platform | Status | Time |
|-----------|----------|--------|------|
| Frontend | Vercel | ⏳ Ready | 3 min |
| Backend | Railway | ⏳ Ready | 5 min |
| Database | Supabase | ⏳ Ready | Auto |

**Total time**: ~15 minutes

---

## 🎯 Success Criteria

Your deployment is successful when:

✅ Frontend loads from Vercel URL  
✅ Backend responds from Railway URL  
✅ `/api/health` shows "healthy"  
✅ No CORS errors  
✅ Products display on homepage  
✅ Can login/register  
✅ Can add to cart  
✅ All tables exist in Supabase  

---

## ⏭️ What's Next?

After deployment:

1. **Monitor** - Watch logs for errors
2. **Test** - Try user flows (login, browse, cart)
3. **Scale** - Monitor database usage
4. **Optimize** - Add caching, CDN if needed
5. **Maintain** - Regular backups, security updates

---

## 📞 Need Help?

Check these files in order:

1. **Quick reference**: `DEPLOY_NOW_CHECKLIST.md`
2. **Detailed help**: `FULL_STACK_DEPLOYMENT.md`
3. **Security**: `SECURITY_AUDIT_REPORT.md`
4. **Troubleshooting**: See "Troubleshooting" section above
5. **Logs**: Railway dashboard Logs tab for backend
6. **Build errors**: Vercel deployments page

---

## 🚀 Ready to Deploy?

**Start here**: [`DEPLOY_NOW_CHECKLIST.md`](DEPLOY_NOW_CHECKLIST.md)

1. ✅ Rotate credentials (Supabase → regenerate API key + password)
2. ✅ Deploy backend to Railway
3. ✅ Deploy frontend to Vercel
4. ✅ Update backend CORS
5. ✅ Verify everything works
6. 🎉 You're live!

---

**Deployment time: ~15 minutes**

**Go to `DEPLOY_NOW_CHECKLIST.md` now!** 🚀
