# Complete Backend on Vercel - Serverless Functions

## What Changed?

Instead of deploying a separate backend server, we've converted everything to **Vercel Serverless Functions**. This means:

✅ **Everything runs on Vercel** - no external services needed
✅ **No credit card required** - free tier is sufficient
✅ **Automatic scaling** - Vercel handles infrastructure
✅ **No database costs** - uses in-memory data (perfect for MVP)
✅ **Single deployment** - frontend + backend together

## Architecture

```
Vercel Deployment
├── Frontend (React + Vite)
│   └── Pages: /, /admin, /checkout, etc.
└── API Functions (/api/*)
    ├── /api/health - Health check
    ├── /api/products - List products
    ├── /api/products/[id] - Get product by ID
    └── /api/products/categories - Get categories
```

## How It Works

1. **Frontend requests** go to `/api/products`
2. Vercel routes them to `api/products.js`
3. The function returns JSON data
4. Frontend renders the data
5. **No separate backend needed!**

## API Endpoints

All endpoints return mock data from `src/data/mockData.js`:

### GET /api/health
```bash
curl https://e-commerce-virid-delta.vercel.app/api/health
```
Response:
```json
{
  "status": "healthy",
  "service": "CartVerse Node.js + Vercel Serverless Backend",
  "version": "2.0.0"
}
```

### GET /api/products
```bash
curl "https://e-commerce-virid-delta.vercel.app/api/products?page=1&limit=10"
```
Query parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 100, max: 500)
- `category` - Filter by category
- `search` - Search products by name/description
- `minPrice` / `maxPrice` - Price range
- `minRating` - Minimum rating
- `inStock` - Filter in-stock products (true/false)
- `sort` - Sort by: price-low, price-high, rating, newest, featured

### GET /api/products/categories
```bash
curl https://e-commerce-virid-delta.vercel.app/api/products/categories
```

### GET /api/products/[id]
```bash
curl https://e-commerce-virid-delta.vercel.app/api/products/mob-1
```

## File Structure

```
project-root/
├── api/
│   ├── health.js                 # Health check endpoint
│   ├── products.js               # List products endpoint
│   ├── products/
│   │   ├── categories.js         # Categories endpoint
│   │   └── [id].js              # Single product endpoint
│   └── package.json             # API package metadata
├── src/
│   ├── context/
│   │   └── ShopContext.jsx       # Uses /api endpoints
│   ├── data/
│   │   └── mockData.js           # Product data
│   └── ...
├── vite.config.js               # No proxy needed
├── vercel.json                  # Routes API functions
└── ...
```

## Local Development

### Option 1: Use Vercel CLI (Recommended)

```bash
npm install -g vercel
vercel dev
```

This runs both:
- Frontend on `http://localhost:3000`
- API functions on `http://localhost:3000/api/*`

### Option 2: Separate Terminals

Terminal 1 - Frontend:
```bash
npm run dev
```

Terminal 2 - API functions (uses mock data):
```bash
vercel dev --port 3001
```

Then update frontend to call `http://localhost:3001/api/*`

## Deployment

### Just push to GitHub!

```bash
git add .
git commit -m "Convert to Vercel serverless functions"
git push
```

Vercel automatically:
1. Detects changes
2. Builds the frontend
3. Deploys API functions
4. Everything is live in ~1-2 minutes

## No Environment Variables Needed

Unlike traditional backend:
- ❌ No DATABASE_URL
- ❌ No JWT_SECRET (not needed for this MVP)
- ❌ No external service connections

The API functions use data from `src/data/mockData.js`.

## Limitations & Future Upgrades

**Current (MVP):**
- ✅ Product listing
- ✅ Filtering & search
- ✅ Pagination
- ✅ Category browsing
- ✅ All frontend features work

**Future (if needed):**
- Add database (PostgreSQL, MongoDB)
- Add authentication
- Add order processing
- Add payment integration
- Upgrade to dedicated backend

## Performance

Vercel Serverless Functions:
- **Cold start:** ~200-500ms (fine for MVP)
- **Warm start:** ~10-50ms (instant)
- **Scaling:** Automatic
- **Cost:** Free tier covers MVP loads

## CORS

All endpoints have CORS enabled:
```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
```

Works with any frontend URL.

## Testing the API

### In Browser Console:
```javascript
fetch('/api/products?page=1&limit=5')
  .then(r => r.json())
  .then(d => console.log(d))
```

### With curl:
```bash
curl https://e-commerce-virid-delta.vercel.app/api/products?page=1&limit=5
```

### In your app:
Just visit `https://e-commerce-virid-delta.vercel.app/` - products load automatically!

## Summary

**Before:** Frontend on Vercel + Backend on Railway/Render/etc.
**Now:** Everything on Vercel + No external services + Still free!

This is the ideal MVP setup. Scale later if needed. 🚀
