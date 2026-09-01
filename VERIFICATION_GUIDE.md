# CartVerse Backend - Verification & Testing Guide

## Overview

This guide provides comprehensive testing procedures to verify your CartVerse backend is working correctly after deployment.

**What you'll verify:**
- ✅ API server is running and accessible
- ✅ Database connection is working
- ✅ All 49 endpoints are functional
- ✅ Authentication (JWT) works
- ✅ CORS is properly configured
- ✅ Error handling is working
- ✅ Performance is acceptable

---

## Part 1: Quick Health Checks (2 minutes)

### Check 1.1: Server is Live

```bash
# Replace with your actual backend URL
API_URL=https://your-api.onrender.com

# Test health endpoint
curl $API_URL/api/health

# Expected response (status 200):
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "CartVerse Node.js/Express Backend",
  "version": "2.1.0",
  "database": "PostgreSQL (Supabase)",
  "environment": "production",
  "uptime": 123.45
}
```

### Check 1.2: Detailed Status

```bash
curl $API_URL/api/status

# Expected response:
{
  "status": "operational",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "2.1.0",
  "nodeVersion": "v20.10.0",
  "memory": {
    "used": "45MB",
    "total": "512MB"
  }
}
```

### Check 1.3: Response Time

```bash
# Measure API response time
time curl -s $API_URL/api/health > /dev/null

# Expected: <500ms for health check
```

### Check 1.4: HTTPS/SSL Certificate

```bash
# Verify SSL certificate is valid
curl -vI $API_URL/api/health 2>&1 | grep "SSL\|TLS"

# Should show:
# * SSL connection using TLSv1.3
# * Certificate verified
```

---

## Part 2: Authentication Testing (5 minutes)

### Test 2.1: Customer Registration

```bash
curl -X POST $API_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Customer",
    "email": "customer@test.com",
    "password": "TestPassword@123"
  }'

# Expected response (status 201):
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "uuid...",
    "name": "Test Customer",
    "email": "customer@test.com",
    "role": "CUSTOMER"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Verify:**
- ✅ Status code 201 (Created)
- ✅ JWT token returned
- ✅ User ID is UUID format
- ✅ Role is "CUSTOMER"

### Test 2.2: Customer Login

```bash
# Save the email and password from registration above
curl -X POST $API_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@test.com",
    "password": "TestPassword@123"
  }'

# Expected response (status 200):
{
  "success": true,
  "user": {
    "id": "uuid...",
    "name": "Test Customer",
    "email": "customer@test.com",
    "role": "CUSTOMER"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Verify:**
- ✅ Status code 200
- ✅ JWT token matches registration token
- ✅ User data is correct

### Test 2.3: Invalid Login (Error Handling)

```bash
curl -X POST $API_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "wrong@email.com",
    "password": "WrongPassword123"
  }'

# Expected response (status 400 or 401):
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Verify:**
- ✅ Status code 400 or 401 (error)
- ✅ Meaningful error message
- ✅ No sensitive information leaked

### Test 2.4: Admin Login

```bash
curl -X POST $API_URL/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@cartverse.io",
    "password": "Admin@2026!"
  }'

# Expected response (status 200):
{
  "success": true,
  "user": {
    "id": "uuid...",
    "name": "Admin User",
    "email": "admin@cartverse.io",
    "role": "ADMIN"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Verify:**
- ✅ Status code 200
- ✅ Role is "ADMIN"
- ✅ Admin token returned

### Test 2.5: Protected Endpoint (Using JWT)

```bash
# Get token from login response above
TOKEN="eyJhbGciOiJIUzI1NiIs..."

# Try to access admin endpoint with token
curl -X GET $API_URL/api/auth/stats \
  -H "Authorization: Bearer $TOKEN"

# Expected response (status 200):
{
  "totalUsers": 1234,
  "totalOrders": 5678,
  "totalRevenue": 123456.78,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Verify:**
- ✅ Status code 200
- ✅ Statistics data returned
- ✅ Authorization header accepted

### Test 2.6: Missing Authorization Header

```bash
# Try without Authorization header
curl -X GET $API_URL/api/auth/stats

# Expected response (status 401):
{
  "success": false,
  "message": "Authorization header missing"
}
```

**Verify:**
- ✅ Status code 401 (Unauthorized)
- ✅ Clear error message
- ✅ Request rejected without token

---

## Part 3: Product Endpoints Testing (5 minutes)

### Test 3.1: Get All Products

```bash
curl "$API_URL/api/products?limit=10&offset=0"

# Expected response (status 200):
{
  "success": true,
  "products": [
    {
      "id": "uuid...",
      "name": "Product Name",
      "price": 999.99,
      "rating": 4.5,
      "stock": 50,
      "images": ["url1", "url2"],
      "category": "electronics",
      ...
    },
    ...
  ],
  "totalCount": 50000,
  "limit": 10,
  "offset": 0
}
```

**Verify:**
- ✅ Status code 200
- ✅ Array of products returned
- ✅ Pagination metadata included
- ✅ Product fields are complete

### Test 3.2: Search Products

```bash
curl "$API_URL/api/products/search?q=phone&limit=5"

# Expected response (status 200):
{
  "success": true,
  "results": [
    {
      "id": "uuid...",
      "name": "Smartphone X",
      "price": 699.99,
      ...
    }
  ],
  "count": 45
}
```

**Verify:**
- ✅ Status code 200
- ✅ Filtered results returned
- ✅ Search results count accurate

### Test 3.3: Get Product by ID

```bash
# Get product ID from previous response
PRODUCT_ID="uuid-from-above"

curl "$API_URL/api/products/$PRODUCT_ID"

# Expected response (status 200):
{
  "id": "uuid...",
  "name": "Product Name",
  "description": "...",
  "price": 999.99,
  "rating": 4.5,
  "reviews": [
    {
      "id": "uuid...",
      "rating": 5,
      "comment": "Great product!",
      ...
    }
  ],
  ...
}
```

**Verify:**
- ✅ Status code 200
- ✅ Full product details returned
- ✅ Reviews included in response
- ✅ Timestamps are valid

### Test 3.4: Get Categories

```bash
curl "$API_URL/api/categories"

# Expected response (status 200):
{
  "success": true,
  "categories": [
    {
      "id": "uuid...",
      "name": "Electronics",
      "slug": "electronics",
      "productCount": 5000
    },
    {
      "name": "Fashion",
      "slug": "fashion",
      "productCount": 3000
    },
    ...
  ]
}
```

**Verify:**
- ✅ Status code 200
- ✅ 8 categories returned
- ✅ Product counts are positive numbers

### Test 3.5: Filter Products by Category

```bash
curl "$API_URL/api/products?category=electronics&limit=5"

# Expected response (status 200):
{
  "success": true,
  "products": [
    {
      "category": "electronics",
      ...
    },
    ...
  ]
}
```

**Verify:**
- ✅ All products have category "electronics"
- ✅ Filtering works correctly

---

## Part 4: Cart & Order Testing (10 minutes)

### Test 4.1: Get Customer Cart

```bash
TOKEN="eyJhbGc..."  # From login response

curl -X GET "$API_URL/api/cart" \
  -H "Authorization: Bearer $TOKEN"

# Expected response (status 200):
{
  "success": true,
  "items": [],
  "totalItems": 0,
  "subtotal": 0
}
```

**Verify:**
- ✅ Status code 200
- ✅ Empty array for new customer
- ✅ Subtotal is 0

### Test 4.2: Add to Cart

```bash
PRODUCT_ID="uuid-from-product-list"
TOKEN="eyJhbGc..."

curl -X POST "$API_URL/api/cart" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"productId\": \"$PRODUCT_ID\",
    \"quantity\": 2,
    \"color\": \"black\",
    \"size\": \"M\"
  }"

# Expected response (status 201):
{
  "success": true,
  "message": "Added to cart",
  "cartItem": {
    "id": "uuid...",
    "productId": "$PRODUCT_ID",
    "quantity": 2,
    "color": "black",
    "size": "M"
  }
}
```

**Verify:**
- ✅ Status code 201 (Created)
- ✅ Item added with correct quantity
- ✅ Variants (color, size) saved

### Test 4.3: View Updated Cart

```bash
curl -X GET "$API_URL/api/cart" \
  -H "Authorization: Bearer $TOKEN"

# Expected response (status 200):
{
  "success": true,
  "items": [
    {
      "id": "uuid...",
      "product": {
        "name": "Product Name",
        "price": 999.99
      },
      "quantity": 2,
      "subtotal": 1999.98
    }
  ],
  "totalItems": 2,
  "subtotal": 1999.98
}
```

**Verify:**
- ✅ Item appears in cart
- ✅ Subtotal calculated correctly
- ✅ Product details included

### Test 4.4: Validate Coupon

```bash
curl -X POST "$API_URL/api/coupons/validate" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "SAVE10",
    "cartTotal": 1999.98
  }'

# Expected response (status 200):
{
  "success": true,
  "coupon": {
    "code": "SAVE10",
    "discountType": "percentage",
    "discountValue": 10,
    "discountAmount": 199.998
  },
  "newTotal": 1799.982
}
```

**Verify:**
- ✅ Status code 200
- ✅ Valid coupon accepted
- ✅ Discount calculated correctly

### Test 4.5: Create Order

```bash
curl -X POST "$API_URL/api/orders" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shippingAddress": {
      "fullName": "Test Customer",
      "street": "123 Main St",
      "city": "Test City",
      "state": "TS",
      "pincode": "12345",
      "phone": "1234567890"
    },
    "paymentMethod": "credit_card",
    "couponCode": "SAVE10"
  }'

# Expected response (status 201):
{
  "success": true,
  "order": {
    "id": "uuid...",
    "orderNumber": "ORD-2024-001",
    "trackingNumber": "AURA-...",
    "status": "Confirmed",
    "total": 1799.98,
    "discount": 199.98,
    "items": [
      {
        "productId": "uuid...",
        "quantity": 2,
        "priceAtPurchase": 999.99
      }
    ]
  }
}
```

**Verify:**
- ✅ Status code 201 (Created)
- ✅ Order number generated
- ✅ Tracking number generated
- ✅ Discount applied correctly
- ✅ Items from cart included

### Test 4.6: Get Order Details

```bash
ORDER_ID="uuid-from-order-above"

curl -X GET "$API_URL/api/orders/$ORDER_ID" \
  -H "Authorization: Bearer $TOKEN"

# Expected response (status 200):
{
  "success": true,
  "order": {
    "id": "$ORDER_ID",
    "orderNumber": "ORD-2024-001",
    "status": "Confirmed",
    "statusStep": 2,
    "timeline": [
      {
        "step": 1,
        "status": "Placed",
        "completed": true
      },
      {
        "step": 2,
        "status": "Confirmed",
        "completed": true
      },
      ...
    ],
    "items": [...],
    "shippingAddress": {...},
    "total": 1799.98
  }
}
```

**Verify:**
- ✅ Status code 200
- ✅ Order status and timeline correct
- ✅ All order details present

---

## Part 5: Wishlist Testing (3 minutes)

### Test 5.1: Add to Wishlist

```bash
PRODUCT_ID="uuid-from-products"
TOKEN="eyJhbGc..."

curl -X POST "$API_URL/api/wishlist" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"productId\": \"$PRODUCT_ID\"}"

# Expected response (status 201):
{
  "success": true,
  "message": "Added to wishlist"
}
```

**Verify:**
- ✅ Status code 201
- ✅ Success message

### Test 5.2: Get Wishlist

```bash
curl -X GET "$API_URL/api/wishlist" \
  -H "Authorization: Bearer $TOKEN"

# Expected response (status 200):
{
  "success": true,
  "wishlist": [
    {
      "id": "uuid...",
      "product": {
        "id": "uuid...",
        "name": "Product",
        "price": 999.99
      }
    }
  ]
}
```

**Verify:**
- ✅ Added product appears in list
- ✅ Product details included

### Test 5.3: Remove from Wishlist

```bash
WISHLIST_ITEM_ID="uuid-from-wishlist"

curl -X DELETE "$API_URL/api/wishlist/$WISHLIST_ITEM_ID" \
  -H "Authorization: Bearer $TOKEN"

# Expected response (status 200):
{
  "success": true,
  "message": "Removed from wishlist"
}
```

**Verify:**
- ✅ Status code 200
- ✅ Item removed successfully

---

## Part 6: Reviews Testing (3 minutes)

### Test 6.1: Add Review

```bash
PRODUCT_ID="uuid..."
TOKEN="eyJhbGc..."

curl -X POST "$API_URL/api/reviews" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"productId\": \"$PRODUCT_ID\",
    \"rating\": 5,
    \"title\": \"Great Product!\",
    \"comment\": \"This product exceeded my expectations. Highly recommended!\"
  }"

# Expected response (status 201):
{
  "success": true,
  "review": {
    "id": "uuid...",
    "productId": "$PRODUCT_ID",
    "rating": 5,
    "title": "Great Product!",
    "comment": "...",
    "verified": true
  }
}
```

**Verify:**
- ✅ Status code 201
- ✅ Review created with correct rating
- ✅ Verified flag set

### Test 6.2: Get Reviews

```bash
curl -X GET "$API_URL/api/reviews?productId=$PRODUCT_ID&limit=10"

# Expected response (status 200):
{
  "success": true,
  "reviews": [
    {
      "id": "uuid...",
      "productId": "$PRODUCT_ID",
      "rating": 5,
      "title": "Great Product!",
      ...
    }
  ],
  "totalCount": 1,
  "averageRating": 5
}
```

**Verify:**
- ✅ Review appears in list
- ✅ Average rating calculated
- ✅ Total count accurate

---

## Part 7: Error Handling Testing (3 minutes)

### Test 7.1: 404 Not Found

```bash
curl "$API_URL/api/products/invalid-id"

# Expected response (status 404):
{
  "success": false,
  "message": "Product not found",
  "status": 404
}
```

**Verify:**
- ✅ Status code 404
- ✅ Meaningful error message

### Test 7.2: Invalid Route

```bash
curl "$API_URL/api/nonexistent"

# Expected response (status 404):
{
  "success": false,
  "message": "Route /api/nonexistent not found",
  "status": 404
}
```

**Verify:**
- ✅ Status code 404
- ✅ Route error message

### Test 7.3: Validation Error

```bash
curl -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "email": "invalid-email",
    "password": "short"
  }'

# Expected response (status 400):
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters"
  }
}
```

**Verify:**
- ✅ Status code 400 (Bad Request)
- ✅ Specific validation errors returned

### Test 7.4: Server Error

```bash
# This should work fine, but if it returns 500, check logs
curl "$API_URL/api/health"

# If error (status 500):
{
  "success": false,
  "message": "Internal Server Error",
  "status": 500
}
```

**Verify:**
- ✅ Should not return 500 for valid requests
- ✅ If it does, check server logs for cause

---

## Part 8: Performance Testing (5 minutes)

### Test 8.1: Response Times

```bash
# Create a test script
cat > test-performance.sh << 'EOF'
#!/bin/bash
API_URL=$1
ENDPOINT=$2

echo "Testing $ENDPOINT..."
for i in {1..10}; do
  curl -s -w "Time: %{time_total}s\n" -o /dev/null "$API_URL$ENDPOINT"
done
EOF

chmod +x test-performance.sh

# Run test
./test-performance.sh "https://your-api.com" "/api/products?limit=10"
```

**Expected times:**
- ✅ Health check: <100ms
- ✅ Product list: 150-300ms
- ✅ Search: 200-400ms
- ✅ Create order: 300-500ms

### Test 8.2: Concurrent Requests

```bash
# Test with 10 concurrent requests
ab -n 10 -c 10 https://your-api.com/api/health

# Expected:
# Requests per second: >100
# Failed requests: 0
# Time taken for tests: <1 second
```

### Test 8.3: Check Response Headers

```bash
curl -I "$API_URL/api/health"

# Expected headers:
# HTTP/2 200
# content-type: application/json
# access-control-allow-origin: <your-domain>
# cache-control: no-cache
```

**Verify:**
- ✅ HTTP/2 or HTTP/1.1 200 OK
- ✅ CORS header present
- ✅ Content-Type is JSON

---

## Part 9: Automated Testing Script

### Create Comprehensive Test Suite

```bash
cat > test-api.sh << 'EOF'
#!/bin/bash

API_URL=${1:-"http://localhost:5000"}
PASSED=0
FAILED=0

test_endpoint() {
  local name=$1
  local method=$2
  local endpoint=$3
  local data=$4
  local expected_code=$5

  if [ -z "$data" ]; then
    response=$(curl -s -w "\n%{http_code}" -X $method "$API_URL$endpoint")
  else
    response=$(curl -s -w "\n%{http_code}" -X $method "$API_URL$endpoint" \
      -H "Content-Type: application/json" -d "$data")
  fi

  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')

  if [ "$http_code" = "$expected_code" ]; then
    echo "✓ $name ($http_code)"
    ((PASSED++))
  else
    echo "✗ $name (expected $expected_code, got $http_code)"
    ((FAILED++))
  fi
}

echo "Testing CartVerse API: $API_URL"
echo ""

# Health checks
test_endpoint "Health Check" "GET" "/api/health" "" "200"
test_endpoint "Status" "GET" "/api/status" "" "200"

# Auth endpoints
test_endpoint "Categories" "GET" "/api/categories" "" "200"
test_endpoint "Products" "GET" "/api/products" "" "200"

# Error handling
test_endpoint "Invalid Route" "GET" "/api/invalid" "" "404"
test_endpoint "Invalid Product ID" "GET" "/api/products/invalid" "" "404"

echo ""
echo "Results: $PASSED passed, $FAILED failed"
EOF

chmod +x test-api.sh

# Run all tests
./test-api.sh https://your-api.com
```

---

## Part 10: Monitoring Dashboard Setup

### Set Up Alerts

Log into your hosting platform (Render/Railway) and:

1. **Enable error notifications**
   - Go to Settings > Notifications
   - Add email for deployment failures

2. **Monitor resource usage**
   - Check Memory usage weekly
   - Monitor database connections
   - Review response times

3. **Check logs regularly**
   - View recent logs
   - Search for errors
   - Set up log filtering

---

## Verification Checklist

Mark these off as you complete each test:

### Health & Infrastructure
- [ ] Health endpoint returns 200
- [ ] Status endpoint returns data
- [ ] HTTPS/SSL certificate valid
- [ ] Response times acceptable (<500ms)

### Authentication
- [ ] Customer registration works
- [ ] Customer login works
- [ ] Admin login works
- [ ] JWT tokens generated
- [ ] Protected endpoints require auth
- [ ] Invalid credentials rejected

### Data Endpoints
- [ ] Products list returns data
- [ ] Product search works
- [ ] Categories list complete
- [ ] Filtering works
- [ ] Pagination works

### Cart & Orders
- [ ] Cart add/update/remove works
- [ ] Coupons validate
- [ ] Orders create successfully
- [ ] Order tracking works

### Secondary Features
- [ ] Wishlist works
- [ ] Reviews create/display
- [ ] Ratings calculate
- [ ] Admin stats return data

### Error Handling
- [ ] 404 errors handled
- [ ] Validation errors returned
- [ ] No 500 errors for valid requests
- [ ] Helpful error messages

### Performance
- [ ] Response times <500ms
- [ ] Concurrent requests work
- [ ] No memory leaks
- [ ] Database queries optimized

---

## Troubleshooting Verification Failures

| Error | Cause | Solution |
|-------|-------|----------|
| Connection refused | Backend not running | Check hosting platform, restart service |
| 502 Bad Gateway | Server crashed | Check logs, restart, verify database |
| CORS errors | Wrong CORS_ORIGIN | Update environment variable, restart |
| Database errors | Connection lost | Verify DATABASE_URL, check Supabase |
| JWT errors | Invalid token | Generate new token, verify JWT_SECRET |
| Slow responses | Database query issue | Add indexes, optimize queries |

---

## Getting Help

If tests fail:

1. **Check server logs**
   ```bash
   # Render
   render logs cartverse-api --tail=50
   
   # Or view in dashboard > Logs
   ```

2. **Verify environment variables**
   ```bash
   # Render Dashboard > Environment tab
   # Check all variables are set correctly
   ```

3. **Test database connection**
   ```bash
   npx prisma db execute --stdin
   SELECT 1;  # Should return 1
   ```

4. **Review documentation**
   - BACKEND_README.md - Architecture overview
   - DEPLOYMENT_GUIDE.md - Deployment help
   - DEPLOY_RENDER.md - Render-specific issues

---

## Final Status

Once all tests pass:

✅ Your CartVerse backend is production-ready and fully verified!

**Next steps:**
1. Connect frontend to production API
2. Run full-stack integration tests
3. Deploy frontend to production
4. Monitor logs for issues
5. Set up automated monitoring

---

**Congratulations! Your backend is live and verified! 🚀**
