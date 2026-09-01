# CartVerse Backend - Environment Variables Documentation

## Overview

This document describes all environment variables required for CartVerse backend deployment.

**Important:** Never commit `.env` files to version control. Use `.env.example` as a template.

---

## Environment Variables by Category

### 1. DATABASE CONFIGURATION

#### `DATABASE_URL` (Required in Production)

**Description:** PostgreSQL connection string from Supabase

**Format:**
```
postgresql://[username]:[password]@[host]:[port]/[database]?schema=public
```

**Examples:**

Local PostgreSQL:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cartverse?schema=public
```

Supabase Cloud (Standard):
```
DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECT_ID.supabase.co:5432/postgres?schema=public
```

Supabase Cloud (Connection Pool - Recommended for Serverless):
```
DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECT_ID.supabase.co:6543/postgres?schema=public&pgbouncer=true
```

Render.com PostgreSQL Add-on:
```
DATABASE_URL=postgresql://user:password@dpg-xxx.render.internal:5432/dbname?schema=public
```

Railway.app:
```
DATABASE_URL=postgresql://postgres:PASSWORD@containers-us-west-XXX.railway.app:5432/railway
```

**How to Find:**
1. **Supabase:** Project Settings > Database > Connection String (Prisma)
2. **Render:** Dashboard > Database > External Connection String
3. **Railway:** Project > Database > Details > PostgreSQL Connection String

**Default:** `postgresql://postgres:postgres@localhost:5432/cartverse?schema=public` (local development)

---

### 2. SERVER CONFIGURATION

#### `NODE_ENV` (Optional)

**Description:** Node.js environment mode

**Allowed values:** `development` | `production` | `staging`

**Effects:**
- `development`: Verbose logging, source maps, slower queries logged
- `production`: Error-only logging, optimized performance, no debugging info
- `staging`: Production-like settings but with more logging

**Default:** `development`

**Example:**
```
NODE_ENV=production
```

---

#### `PORT` (Optional)

**Description:** Server listening port

**Valid range:** 1024-65535 (ports below 1024 require root)

**Default:** `5000`

**Platform-Specific:**
- **Local dev:** `5000`
- **Render.com:** Usually `10000` (auto-assigned, can override with env var)
- **Railway:** Auto-assigned (set via PORT env var)
- **Heroku:** Auto-assigned (must use `process.env.PORT`)
- **Vercel:** Must use serverless function (not applicable)

**Example:**
```
PORT=5000
```

---

### 3. AUTHENTICATION & SECURITY

#### `JWT_SECRET` (Required in Production)

**Description:** Secret key for signing JSON Web Tokens

**Requirements:**
- Minimum 32 characters
- Strong random string (no dictionary words)
- Must be the same on frontend and backend
- Different value for each environment (dev/staging/prod)

**Generate a secure JWT_SECRET:**
```bash
# Using OpenSSL (macOS/Linux)
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Using Python
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Examples:**

Development (demo):
```
JWT_SECRET=dev_jwt_secret_key_change_in_production_12345678
```

Production (recommended):
```
JWT_SECRET=xK9mL2pQ7wR4bF1aE8vJ0cN3dM6sH5tG9uI2oZ7xY4aT1mW5kP
```

**Security Note:**
- 🚫 Never use simple strings like `secret123` or `password`
- 🚫 Never hardcode in source files
- 🚫 Never share or commit to version control
- ✅ Use platform's secret manager (Render Secrets, Railway Secrets, etc.)
- ✅ Rotate periodically (every 90 days)
- ✅ Use different secrets for dev/staging/prod

---

### 4. CORS CONFIGURATION

#### `CORS_ORIGIN` (Optional but Recommended)

**Description:** Allowed frontend origin for Cross-Origin Resource Sharing

**Format:** URL without trailing slash

**Examples:**

Local development:
```
CORS_ORIGIN=http://localhost:3000
```

Production (single domain):
```
CORS_ORIGIN=https://cartverse.com
```

Multiple domains (comma-separated - requires custom CORS middleware):
```
CORS_ORIGIN=https://cartverse.com,https://www.cartverse.com,https://app.cartverse.com
```

**Default:** `http://localhost:3000`

**What it does:**
- Restricts which domains can make requests to your API
- Browser enforces this automatically (same-origin policy)
- Prevents CSRF and unauthorized access
- Required for frontend hosted on different domain

**Common CORS Issues:**
```
Error: Access to XMLHttpRequest blocked by CORS policy
→ Solution: Update CORS_ORIGIN to match frontend domain
```

---

### 5. THIRD-PARTY INTEGRATIONS

#### `FLIPKART_AFFILIATE_ID` (Optional)

**Description:** Flipkart affiliate program ID

**Format:** String (provided by Flipkart)

**Example:**
```
FLIPKART_AFFILIATE_ID=cartvers01
```

**Obtain:**
1. Sign up at https://affiliate.flipkart.com
2. Generate API credentials
3. Copy Affiliate ID

**Default:** `cartvers01` (demo)

---

#### `FLIPKART_AFFILIATE_TOKEN` (Optional)

**Description:** Flipkart affiliate API token

**Format:** String (provided by Flipkart)

**Example:**
```
FLIPKART_AFFILIATE_TOKEN=fk_aff_tok_998a4e12e345b801a6bc
```

**Security:** Store in platform secrets, never commit

**Default:** `fk_aff_tok_998a4e12e345b801a6bc` (demo)

---

#### `FLIPKART_API_BASE_URL` (Optional)

**Description:** Flipkart API endpoint

**Format:** HTTPS URL

**Example:**
```
FLIPKART_API_BASE_URL=https://affiliate-api.flipkart.net/affiliate/1.0
```

**Default:** `https://affiliate-api.flipkart.net/affiliate/1.0`

---

## Environment-Specific Configuration

### Local Development (.env)

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cartverse?schema=public
JWT_SECRET=dev_jwt_secret_key_12345678901234567890
CORS_ORIGIN=http://localhost:3000
FLIPKART_AFFILIATE_ID=cartvers01
FLIPKART_AFFILIATE_TOKEN=fk_aff_tok_998a4e12e345b801a6bc
FLIPKART_API_BASE_URL=https://affiliate-api.flipkart.net/affiliate/1.0
```

### Staging (.env.staging)

```env
NODE_ENV=staging
PORT=5000
DATABASE_URL=postgresql://postgres:PASSWORD@db.staging.supabase.co:5432/postgres?schema=public
JWT_SECRET=staging_jwt_secret_strong_random_string_here
CORS_ORIGIN=https://staging-cartverse.com
FLIPKART_AFFILIATE_ID=cartvers01
FLIPKART_AFFILIATE_TOKEN=fk_aff_tok_xxx
FLIPKART_API_BASE_URL=https://affiliate-api.flipkart.net/affiliate/1.0
```

### Production (.env.production)

```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres:PASSWORD@db.prod.supabase.co:5432/postgres?schema=public&pgbouncer=true
JWT_SECRET=prod_jwt_secret_very_strong_random_string_generated_securely
CORS_ORIGIN=https://cartverse.com
FLIPKART_AFFILIATE_ID=cartvers01
FLIPKART_AFFILIATE_TOKEN=fk_aff_tok_yyy
FLIPKART_API_BASE_URL=https://affiliate-api.flipkart.net/affiliate/1.0
```

---

## Setting Environment Variables by Platform

### Render.com

1. Go to your service dashboard
2. Click **Environment** tab
3. Add each variable manually or paste `.env` file:
   - Click **Add Secret** for sensitive variables (JWT_SECRET, DB password)
   - Click **Add Variable** for public variables

```bash
# Or using Render CLI
render deploy --secret JWT_SECRET=your-value --secret DATABASE_URL=your-url
```

### Railway.app

1. Go to your project
2. Select **Variables** tab
3. Add each variable

```bash
# Environment variables appear in Railway dashboard and are injected at runtime
```

### Heroku

```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-strong-secret
heroku config:set CORS_ORIGIN=https://your-frontend.com
heroku config:set DATABASE_URL=postgresql://...

# View all variables
heroku config
```

### Vercel

1. Go to Project Settings
2. Click **Environment Variables**
3. Add each variable (select which deployments: Production, Preview, Development)

```bash
# Or using Vercel CLI
vercel env add JWT_SECRET
vercel env add DATABASE_URL
```

### GitHub Actions (CI/CD)

1. Go to repository **Settings** > **Secrets and variables** > **Actions**
2. Click **New repository secret**
3. Add each secret

```yaml
# Example: .github/workflows/deploy.yml
- name: Deploy
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
    JWT_SECRET: ${{ secrets.JWT_SECRET }}
  run: npm run build
```

---

## Validation & Testing

### Check Environment Variables

```bash
# In Node.js
node -e "console.log({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DATABASE_URL_LENGTH: process.env.DATABASE_URL?.length,
  JWT_SECRET_LENGTH: process.env.JWT_SECRET?.length,
  CORS_ORIGIN: process.env.CORS_ORIGIN
})"
```

### Test Database Connection

```bash
DATABASE_URL="postgresql://..." npx prisma studio
# If Prisma Studio opens, database connection is working
```

### Test Health Endpoint After Deployment

```bash
curl https://your-api-domain.com/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "CartVerse Node.js/Express Backend",
  "version": "2.1.0",
  "database": "PostgreSQL (Supabase)",
  "environment": "production",
  "uptime": 123.456
}
```

---

## Common Issues & Solutions

### Issue: `Error: Invalid connection string`

**Cause:** DATABASE_URL format is incorrect

**Solution:**
1. Verify format: `postgresql://user:password@host:port/database?schema=public`
2. URL-encode special characters in password: `:` → `%3A`, `@` → `%40`, etc.
3. Check for trailing whitespace

### Issue: `JWT_SECRET is undefined`

**Cause:** Environment variable not loaded

**Solution:**
```bash
# Verify .env file exists and is readable
ls -la .env

# Check if dotenv is loaded in server.js
# Should have: import dotenv from 'dotenv'; dotenv.config();

# Test loading manually
node -e "require('dotenv').config(); console.log(process.env.JWT_SECRET)"
```

### Issue: `CORS errors in browser`

**Cause:** CORS_ORIGIN doesn't match frontend domain

**Solution:**
1. Check frontend URL in browser address bar
2. Update CORS_ORIGIN to match exactly (no trailing slash)
3. Restart backend after changing
4. Clear browser cache (Ctrl+Shift+Delete)

### Issue: `Port 5000 already in use`

**Cause:** Another process is using the port

**Solution:**
```bash
# Find and kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Or use different port
PORT=5001 npm start
```

### Issue: Database connection timeout in production

**Cause:** Connection pool exhausted or network issue

**Solution:**
1. Use connection pooling: Add `&pgbouncer=true` to DATABASE_URL
2. Check Supabase dashboard for connection count limits
3. Verify IP whitelist in Supabase settings

---

## Security Best Practices

### ✅ Do's

- ✅ Use strong, random JWT_SECRET (32+ characters)
- ✅ Store secrets in platform's secret manager
- ✅ Use HTTPS URLs for CORS_ORIGIN
- ✅ Rotate secrets every 90 days
- ✅ Use different secrets for each environment
- ✅ Review environment variables in CI/CD logs carefully
- ✅ Use `.env.example` to document required variables
- ✅ Add `.env` to `.gitignore`

### ❌ Don'ts

- ❌ Hardcode secrets in source files
- ❌ Commit `.env` files to Git
- ❌ Use simple passwords like `password123`
- ❌ Reuse secrets across environments
- ❌ Share JWT_SECRET in chat or email
- ❌ Use localhost URLs in production
- ❌ Log sensitive environment variables
- ❌ Use demo/test secrets in production

---

## Environment Variables Reference Table

| Variable | Required | Development | Production | Type |
|----------|----------|-------------|------------|------|
| DATABASE_URL | ✅ | ✅ | ✅ | String |
| NODE_ENV | ❌ | Optional | ✅ | Enum |
| PORT | ❌ | Optional | Optional | Number |
| JWT_SECRET | ✅ | Optional | ✅ | String |
| CORS_ORIGIN | ❌ | Optional | ✅ | URL |
| FLIPKART_AFFILIATE_ID | ❌ | Optional | Optional | String |
| FLIPKART_AFFILIATE_TOKEN | ❌ | Optional | Optional | String |
| FLIPKART_API_BASE_URL | ❌ | Optional | Optional | URL |

---

## Next Steps

1. **Generate JWT_SECRET:** Use OpenSSL or Node.js command above
2. **Get Database URL:** From Supabase Project Settings
3. **Create .env file:** Copy `.env.example` and fill in actual values
4. **Test locally:** Run `npm run dev:server` and test `/api/health`
5. **Deploy:** Push to Git and deploy to your platform
6. **Verify:** Test production API endpoints

---

**Questions?** Refer to `.env.example` or individual platform documentation.
