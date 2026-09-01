# CartVerse Backend - Supabase PostgreSQL Setup Guide

## Overview

This guide walks you through creating and configuring a Supabase PostgreSQL database for CartVerse backend deployment.

**What you'll get:**
- ✅ Production-grade PostgreSQL 16 database
- ✅ Automatic backups & point-in-time recovery
- ✅ Connection pooling for serverless
- ✅ Real-time capabilities (optional)
- ✅ Row-level security (optional)
- ✅ Free tier: 500MB database, unlimited API calls, 50,000 monthly active users

---

## Part 1: Create Supabase Project

### Step 1.1: Sign Up / Login

1. Go to **https://app.supabase.com**
2. Click **Sign up** (if new) or **Login** (if existing)
3. Choose authentication method:
   - Email/Password
   - GitHub
   - Google
4. Complete verification

### Step 1.2: Create New Project

1. In Supabase dashboard, click **New project**
2. Fill in the form:

   | Field | Value | Notes |
   |-------|-------|-------|
   | **Project name** | `cartverse` | or your preferred name |
   | **Database password** | Strong password | Save this! You'll need it |
   | **Region** | `us-east-1` (or closest to users) | Affects latency |
   | **Pricing plan** | Free | Sufficient for most projects |

3. Example filled form:
   ```
   Project name: cartverse
   Password: MySuper$ecureP@ssw0rd123!
   Region: us-east-1
   Plan: Free
   ```

4. Click **Create new project**

### Step 1.3: Wait for Provisioning

- The database will provision in 2-3 minutes
- You'll see a progress indicator
- Once complete, the dashboard loads

---

## Part 2: Get Database Credentials

### Step 2.1: View Connection String

1. Go to **Project Settings** (bottom left gear icon)
2. Click **Database** tab
3. Scroll to **Connection String** section
4. Select **Prisma** from the dropdown

You'll see:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres?schema=public
```

### Step 2.2: Copy & Save Credentials

1. **Copy the connection string**
2. **Replace `[YOUR-PASSWORD]`** with the database password you set
3. **Save this somewhere secure** (password manager, deployment platform secrets)

Example (with fake credentials):
```
postgresql://postgres:MySuper$ecureP@ssw0rd123!@db.abcdefg1234567.supabase.co:5432/postgres?schema=public
```

### Step 2.3: Get Connection Pooling URL (Optional but Recommended)

For serverless deployments (Railway, Render), use connection pooling to avoid exhausting connections:

1. Same location (Project Settings > Database)
2. Under **Pooling Connection String**, select **Prisma**
3. Use this URL instead (port 6543 instead of 5432):
```
postgresql://postgres:PASSWORD@db.[PROJECT-ID].supabase.co:6543/postgres?schema=public&pgbouncer=true
```

---

## Part 3: Run Database Migrations Locally

### Step 3.1: Set Up Local Environment

1. Clone your repository (if not already done)
2. Install dependencies:
   ```bash
   cd e-commerce
   npm install
   ```

3. Create `.env` file with Supabase connection:
   ```env
   DATABASE_URL="postgresql://postgres:PASSWORD@db.PROJECT_ID.supabase.co:5432/postgres?schema=public"
   NODE_ENV=development
   JWT_SECRET=dev_secret_key_for_testing
   CORS_ORIGIN=http://localhost:3000
   PORT=5000
   ```

### Step 3.2: Generate Prisma Client

```bash
npx prisma generate
```

### Step 3.3: Run Migrations

This creates all tables in your Supabase database:

```bash
# Create and run initial migration
npx prisma migrate dev --name init

# Or if you just want to push the schema (no version control)
npx prisma db push
```

**What gets created:**
- ✅ 10 database tables (users, products, orders, categories, reviews, etc.)
- ✅ Foreign key relationships
- ✅ Indexes for performance
- ✅ Constraints & defaults

### Step 3.4: Seed Sample Data (Optional)

Load sample data to test the API:

```bash
node server/scripts/seed.js
```

**What gets seeded:**
- ✅ 8 product categories
- ✅ 1000 sample products
- ✅ 3 demo users (customer + 2 admins)
- ✅ 5 coupon codes

### Step 3.5: Verify Connection

```bash
# Open Prisma Studio (GUI database browser)
npx prisma studio

# Then:
# 1. Go to http://localhost:5555
# 2. Select "User" table
# 3. Should see demo users created
```

---

## Part 4: Connection Pooling Setup (Production)

### Why Connection Pooling?

PostgreSQL has a limited number of concurrent connections (usually 100). On serverless platforms with multiple instances, connections can be exhausted quickly. Connection pooling fixes this.

### Step 4.1: Enable Connection Pooling in Supabase

1. Project Settings > **Database** > **Pooling** tab
2. Click **Connection String** (under PgBouncer)
3. Select **Prisma**
4. Copy the URL (port 6543)

Example:
```
postgresql://postgres:PASSWORD@db.project_id.supabase.co:6543/postgres?schema=public&pgbouncer=true
```

### Step 4.2: Use Pooled Connection in Production

When deploying, use the **pooled** URL instead of standard URL:

```env
# Standard (use for local development)
DATABASE_URL=postgresql://postgres:PASSWORD@db.project_id.supabase.co:5432/postgres?schema=public

# Pooled (use for production/serverless)
DATABASE_URL=postgresql://postgres:PASSWORD@db.project_id.supabase.co:6543/postgres?schema=public&pgbouncer=true
```

---

## Part 5: Security Configuration

### Step 5.1: IP Whitelist (Optional)

By default, Supabase allows connections from any IP. For extra security:

1. Project Settings > **Database** > **Network**
2. Click **Add allowed IPs**
3. Add your office/home IP address
4. Add your deployment platform IPs

**Common deployment platforms:**
- Render: See in project settings after deployment
- Railway: Auto-configured (no whitelist needed for Supabase)
- Vercel: Requires separate configuration

### Step 5.2: Enable Row Level Security (Advanced)

For multi-tenant applications, enable RLS to isolate user data:

1. Go to **Authentication** > **Policies**
2. Click **Enable RLS** on table
3. Define policies per table

**Example policy:**
```sql
-- Users can only see their own data
CREATE POLICY "Users can view own data"
ON users FOR SELECT
USING (auth.uid() = id);
```

*(Optional for CartVerse - not required for basic setup)*

### Step 5.3: Configure Database Password

Change the default database password (recommended):

1. Project Settings > **Database** > **Reset Password**
2. Enter new strong password
3. Click **Update password**
4. Update your DATABASE_URL environment variable

---

## Part 6: Backups & Monitoring

### Step 6.1: Automatic Backups

Supabase automatically backs up your database:

- ✅ Daily backups (free tier)
- ✅ 7-day retention
- ✅ Point-in-time recovery available

View backups:
1. Project Settings > **Backups**
2. See backup history and schedule

### Step 6.2: Database Monitoring

Monitor your database usage:

1. Go to **Project Overview**
2. See:
   - Storage used (500MB free tier limit)
   - Database size growth
   - Active users count
   - Real-time analytics

### Step 6.3: Enable Email Alerts (Free Tier)

Get notified if database is approaching limits:

1. Project Settings > **Notifications**
2. Toggle email alerts ON
3. You'll get notified when:
   - Database size approaches limit
   - Backup fails
   - Unexpected activity detected

---

## Part 7: Verify Supabase Setup

### Step 7.1: Test Database Connection

```bash
# Test with psql (if installed)
psql "postgresql://postgres:PASSWORD@db.project_id.supabase.co:5432/postgres?schema=public"

# Or test with Node.js
node -e "
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$queryRaw\`SELECT 1\`
  .then(() => { console.log('✅ Connected!'); process.exit(0); })
  .catch((e) => { console.error('❌ Error:', e.message); process.exit(1); });
"
```

### Step 7.2: Check Table Creation

```bash
# List all tables
npx prisma studio

# Or query directly
psql "postgresql://..." -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public';"
```

Expected tables:
```
users
products
orders
order_items
categories
reviews
wishlist_items
cart_items
coupons
addresses
flipkart_products
```

### Step 7.3: Verify Sample Data

```bash
# Connect to Supabase database
npx prisma studio

# Then in the GUI:
# 1. Select "User" table → Should see demo users
# 2. Select "Product" table → Should see 1000 products
# 3. Select "Category" table → Should see 8 categories
```

---

## Part 8: Connect to Backend Code

### Step 8.1: Update Environment Variables

In your `.env` (local dev):
```env
DATABASE_URL="postgresql://postgres:PASSWORD@db.PROJECT_ID.supabase.co:5432/postgres?schema=public"
NODE_ENV=development
JWT_SECRET=dev_secret_key_change_in_production
CORS_ORIGIN=http://localhost:3000
PORT=5000
```

### Step 8.2: Test Backend Server

```bash
# Start backend server
npm run dev:server

# In another terminal, test API
curl http://localhost:5000/api/health

# Expected response:
{
  "status": "healthy",
  "database": "PostgreSQL (Supabase)",
  "version": "2.1.0"
}
```

### Step 8.3: Test Product Endpoint

```bash
curl http://localhost:5000/api/products

# Should return JSON array of 1000 products
```

---

## Troubleshooting

### Issue: Connection Refused

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Cause:** Trying to connect to localhost instead of Supabase

**Solution:**
```bash
# Wrong (localhost)
DATABASE_URL="postgresql://postgres:pass@localhost:5432/cartverse"

# Correct (Supabase)
DATABASE_URL="postgresql://postgres:pass@db.abc123.supabase.co:5432/postgres"
```

---

### Issue: Password Authentication Failed

**Error:** `Error: password authentication failed for user "postgres"`

**Cause:** Wrong password in connection string

**Solution:**
1. Go to Project Settings > **Database**
2. Click **Reset Password**
3. Enter new password
4. Update DATABASE_URL with new password
5. Test connection

---

### Issue: Database "cartverse" Does Not Exist

**Error:** `Error: database "cartverse" does not exist`

**Cause:** Using wrong database name (Supabase uses `postgres` by default)

**Solution:**
```bash
# Wrong
DATABASE_URL="...@db.xxx.supabase.co:5432/cartverse"

# Correct
DATABASE_URL="...@db.xxx.supabase.co:5432/postgres?schema=public"
```

---

### Issue: Connection Timeout

**Error:** `Error: connect ETIMEDOUT`

**Cause:** Network/firewall blocking connection or Supabase not accessible

**Solution:**
1. Check internet connection
2. Verify Supabase project is active (dashboard loads)
3. Try connection from another network (phone hotspot)
4. Check IP whitelist settings (if configured)
5. Try pooled connection URL (port 6543)

---

### Issue: Relations Not Found During Migrations

**Error:** `Error: constraint not found`

**Cause:** Running migrations in wrong order or schema conflicts

**Solution:**
```bash
# Reset and restart
npx prisma migrate reset --skip-generate --skip-seed

# Then re-run migrations
npx prisma migrate dev
```

---

## Supabase Dashboard Quick Reference

| Task | Path |
|------|------|
| **View Connection String** | Project Settings > Database > Connection String |
| **View Connection Pooling** | Project Settings > Database > Pooling |
| **Reset Database Password** | Project Settings > Database > Reset Password |
| **View Backups** | Project Settings > Backups |
| **Configure IP Whitelist** | Project Settings > Database > Network |
| **View Database Usage** | Project Overview (Storage, Row counts) |
| **Configure Alerts** | Project Settings > Notifications |
| **Browse Database Tables** | SQL Editor > Run custom queries |

---

## Next Steps

1. ✅ **Create Supabase project** (Steps 1-2)
2. ✅ **Run migrations locally** (Step 3)
3. ✅ **Verify connection** (Step 7)
4. ✅ **Test backend API** (Step 8)
5. 📝 **Ready for deployment** → See DEPLOYMENT_GUIDE.md

---

## Production Deployment Checklist

Before deploying to production:

- [ ] Supabase project created and accessible
- [ ] Database migrations ran successfully (`npx prisma migrate deploy`)
- [ ] Sample data seeded (optional)
- [ ] Connection pooling URL obtained (port 6543)
- [ ] Database password changed from default
- [ ] Backups enabled and tested
- [ ] IP whitelist configured (if needed)
- [ ] Row-level security policies defined (if needed)
- [ ] DATABASE_URL saved in deployment platform secrets
- [ ] JWT_SECRET generated and saved
- [ ] CORS_ORIGIN set to frontend domain

---

**Questions or issues?** Check:
- Supabase Docs: https://supabase.com/docs
- Prisma Docs: https://www.prisma.io/docs
- This guide's Troubleshooting section above
