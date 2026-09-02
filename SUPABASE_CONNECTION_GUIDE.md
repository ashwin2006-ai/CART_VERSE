# 🔗 Complete Guide: Connect CartVerse Backend to Supabase

## Overview

Your backend uses **Prisma ORM** to connect to Supabase PostgreSQL. Here's everything you need to know.

---

## Step 1: Verify Supabase Project Exists

### Your Current Credentials:
```
Project ID: yjzkfwyattiibfgnngiv
URL: https://yjzkfwyattiibfgnngiv.supabase.co
Database Host: db.yjzkfwyattiibfgnngiv.supabase.co
Port: 5432
Database: postgres
User: postgres
```

### Check if Supabase is Accessible:
1. Go to https://app.supabase.com
2. Log in with your account
3. Look for project: **yjzkfwyattiibfgnngiv**
4. Note: If project doesn't exist, create one first

---

## Step 2: Get Database Connection String

### From Supabase Dashboard:

1. **Open Supabase Console:**
   - Go to https://app.supabase.com
   - Select your project

2. **Find Connection String:**
   - Click **Settings** (gear icon, bottom left)
   - Click **Database**
   - Look for **Connection String** section
   - Copy the **Postgres** connection string

3. **Connection String Format:**
   ```
   postgresql://postgres:[PASSWORD]@db.yjzkfwyattiibfgnngiv.supabase.co:5432/postgres
   ```

4. **Your Current String:**
   ```
   postgresql://postgres:Ashunila@2005@db.yjzkfwyattiibfgnngiv.supabase.co:5432/postgres?schema=public
   ```

---

## Step 3: Update .env File

Your `.env` file already has the DATABASE_URL. Verify it's correct:

### Current `.env`:
```env
DATABASE_URL="postgresql://postgres:Ashunila@2005@db.yjzkfwyattiibfgnngiv.supabase.co:5432/postgres?schema=public"
```

### If Connection String Has Special Characters:
If your password has special characters (like `@` or `#`), URL-encode them:
- `@` → `%40`
- `#` → `%23`
- `:` → `%3A`

**Example:**
```
Password: pass@word#123
Encoded: pass%40word%23123
```

---

## Step 4: Set Up Prisma Schema

Your Prisma schema is already configured. Verify it:

### Check `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  // ... other fields
}

model Product {
  id    String   @id @default(cuid())
  name  String
  // ... other fields
}
```

---

## Step 5: Initialize Prisma

Run these commands in order:

### 1. Generate Prisma Client:
```powershell
npx prisma generate
```

**Expected output:**
```
✔ Generated Prisma Client (X.X.X)
```

### 2. Push Schema to Database:
```powershell
npx prisma db push
```

**Expected output:**
```
✔ Your database is now in sync with your schema.
```

⚠️ **Note:** This creates tables in Supabase if they don't exist.

### 3. Check Connection:
```powershell
npx prisma db execute --stdin < seed.js
```

Or test manually:
```powershell
npx prisma studio
```

This opens a GUI where you can see your Supabase data.

---

## Step 6: Seed Sample Data (Optional)

If you want to populate Supabase with sample products:

```powershell
node server/scripts/seed.js
```

**Expected output:**
```
✅ Seeding data...
✅ 7 categories created
✅ 10 products created
✅ Done!
```

---

## Step 7: Verify Connection in Backend

Start your backend:

```powershell
npm run server
```

### Success Indicators:

**You should see:**
```
prisma:info Starting a postgresql pool with X connections.
🚀 CartVerse Backend Server Started
✓ Environment: development
✓ Server: http://0.0.0.0:5000
✓ Database: PostgreSQL (Supabase)
```

**NOT this:**
```
prisma:error Can't reach database server at `db.yjzkfwyattiibfgnngiv.supabase.co:5432`
```

---

## Step 8: Test API Endpoints

### Terminal 1: Keep backend running
```powershell
npm run server
```

### Terminal 2: Test endpoints

```powershell
# Test health check
curl http://localhost:5000/api/health

# Get all products from Supabase
curl http://localhost:5000/api/products

# Get specific category
curl "http://localhost:5000/api/products?category=mobiles"

# Search products
curl "http://localhost:5000/api/products?search=samsung"
```

### Expected Response:
```json
{
  "success": true,
  "count": 10,
  "total": 10,
  "page": 1,
  "totalPages": 1,
  "data": [...],
  "source": "database"
}
```

⚠️ If `source` is `"mock-data"` instead of `"database"`, connection failed.

---

## Step 9: Frontend Connection

Start frontend:

```powershell
npm run dev
```

Visit http://localhost:3000

### You should see:
- ✅ Products loading on home page
- ✅ Categories in category bar
- ✅ Search functionality working
- ✅ Filters working
- ✅ Cart functionality

---

## Troubleshooting Connection Issues

### Issue 1: "Can't reach database server"

**Cause:** Network/firewall blocking connection

**Solutions:**
1. **Check internet connection** - Ensure you're online
2. **Check firewall** - Allow port 5432
3. **Try VPN** - Some networks block Supabase
4. **Check DATABASE_URL** - Verify credentials in `.env`
5. **Restart backend** - Kill and restart `npm run server`

### Issue 2: "Password authentication failed"

**Cause:** Wrong password in DATABASE_URL

**Solution:**
1. Go to Supabase dashboard
2. Reset database password (Settings → Database → Reset Password)
3. Update DATABASE_URL in `.env`
4. Restart backend

### Issue 3: "Database does not exist"

**Cause:** Wrong database name in connection string

**Solution:**
1. Connection string should use: `postgres` database
2. Check `.env`:
   ```
   DATABASE_URL="...@db.yjzkfwyattiibfgnngiv.supabase.co:5432/postgres?schema=public"
   ```

### Issue 4: Prisma Can't Find Schema

**Solution:** Regenerate Prisma client:
```powershell
npx prisma generate
npx prisma db push
```

---

## Environment Variables Summary

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | Prisma connection | `postgresql://...` |
| `SUPABASE_URL` | Supabase project | `https://xyz.supabase.co` |
| `SUPABASE_ANON_KEY` | Public API key | JWT token |
| `NODE_ENV` | Environment | `development` |
| `JWT_SECRET` | Auth token secret | Any random string |
| `CORS_ORIGIN` | Frontend URL | `http://localhost:3000` |

---

## Production Deployment

When deploying to production (Railway, Vercel, etc.):

1. **Add environment variables to platform:**
   - Set `DATABASE_URL` to your Supabase connection string
   - Set `JWT_SECRET` to a strong random string

2. **Run migrations:**
   - Platform will run `npm run build`
   - Ensure `prisma generate` runs before build

3. **Verify connection:**
   - Check logs for "PostgreSQL pool connected"
   - Test `/api/health` endpoint

---

## Complete Workflow

```
1. Verify Supabase project exists
                ↓
2. Copy DATABASE_URL from Supabase
                ↓
3. Update .env file
                ↓
4. Run: npx prisma generate
                ↓
5. Run: npx prisma db push
                ↓
6. Run: npm run server
                ↓
7. Test: curl http://localhost:5000/api/products
                ↓
8. ✅ Connection successful!
```

---

## Quick Start

All in one command sequence:

```powershell
# 1. Install dependencies (if needed)
npm install

# 2. Regenerate Prisma
npx prisma generate

# 3. Sync schema to Supabase
npx prisma db push

# 4. Seed sample data (optional)
node server/scripts/seed.js

# 5. Start backend
npm run server

# 6. In new terminal, start frontend
npm run dev

# 7. Visit http://localhost:3000
```

---

## Advanced: View Data in Supabase

### Option 1: Prisma Studio (Easiest)
```powershell
npx prisma studio
```
Opens GUI at http://localhost:5555

### Option 2: Supabase Web Console
1. Go to https://app.supabase.com
2. Select your project
3. Click **SQL Editor**
4. Run queries:
   ```sql
   SELECT * FROM "User";
   SELECT * FROM "Product";
   SELECT * FROM "Category";
   ```

### Option 3: Database Client (DBeaver, pgAdmin, etc.)
1. Download database client
2. New connection:
   - Host: `db.yjzkfwyattiibfgnngiv.supabase.co`
   - Port: `5432`
   - User: `postgres`
   - Password: `Ashunila@2005`
   - Database: `postgres`

---

## Summary

✅ **Your CartVerse is configured for Supabase!**

- Backend ready to connect
- Prisma schema prepared
- Environment variables set
- Mock data fallback active

**Next Steps:**
1. Run `npx prisma generate`
2. Run `npx prisma db push`
3. Run `npm run server`
4. Visit http://localhost:3000

You're ready to go! 🚀
