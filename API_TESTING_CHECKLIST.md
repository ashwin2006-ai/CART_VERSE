# CartVerse API Testing Checklist

## Pre-Test Setup
- [ ] Backend running: `docker compose -f docker-compose.base44.yml up -d`
- [ ] Database migrated: `npx prisma db push`
- [ ] Seeds applied: `node server/scripts/seed.js`
- [ ] Frontend dev server: `npm run dev`

## Test Environment
- **Frontend URL**: http://localhost:3000
- **Backend URL**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health

---

## Phase 1: Authentication APIs

### 1.1 Customer Login
```
POST /api/auth/login
Body: { "email": "alex.mercer@cartverse.io", "password": "Password@123" }
Expected: 200, returns { "success": true, "token": "...", "user": {...} }
```
- [ ] Test with valid credentials
- [ ] Test with invalid email
- [ ] Test with wrong password
- [ ] Verify JWT token stored in localStorage
- [ ] Verify user object contains: id, name, email, role, tier, rewardPoints

### 1.2 Customer Registration
```
POST /api/auth/register
Body: { "name": "Test User", "email": "newuser@test.com", "password": "Pass123!", "phone": "9876543210" }
Expected: 201, returns new user with token
```
- [ ] Test successful registration
- [ ] Test duplicate email rejection
- [ ] Test missing required fields
- [ ] Verify new user can login immediately

### 1.3 Admin Login
```
POST /api/auth/admin-login
Body: { "email": "admin@cartverse.io", "password": "Admin@2026!" }
Expected: 200, returns admin user with token and role="ADMIN"
```
- [ ] Test admin login with correct credentials
- [ ] Test admin login rejection with wrong password
- [ ] Verify admin token has "Authorization: Bearer" header

---

## Phase 2: Product APIs

### 2.1 Get All Products (Pagination)
```
GET /api/products?page=1&limit=24
Expected: 200, returns { "success": true, "data": [...], "total": N, "page": 1, "totalPages": M }
```
- [ ] Test page 1 with 24 items
- [ ] Test page 2 to verify pagination
- [ ] Test limit parameter (change to 10, 50)
- [ ] Verify response structure and data types
- [ ] Check product object has: id, name, price, stock, rating, images

### 2.2 Search Products
```
GET /api/products/search?q=laptop&page=1&limit=24
Expected: 200, returns filtered products matching query
```
- [ ] Search for "laptop" - should return relevant products
- [ ] Search for "phone" - should return relevant products
- [ ] Search with empty query - should return error
- [ ] Verify search works across name, description, category

### 2.3 Filter by Category
```
GET /api/products?category=electronics
Expected: 200, returns only electronics products
```
- [ ] Test with "electronics" category
- [ ] Test with "fashion" category
- [ ] Verify all returned products match category

### 2.4 Filter by Price Range
```
GET /api/products?minPrice=100&maxPrice=5000
Expected: 200, returns products within price range
```
- [ ] Test minPrice only: ?minPrice=1000
- [ ] Test maxPrice only: ?maxPrice=2000
- [ ] Test both: ?minPrice=500&maxPrice=3000
- [ ] Verify all products fall within range

### 2.5 Filter by Rating
```
GET /api/products?minRating=4
Expected: 200, returns products rated 4+ stars
```
- [ ] Test minRating=4
- [ ] Test minRating=3.5
- [ ] Verify rating calculation correct

### 2.6 Filter In Stock Only
```
GET /api/products?inStock=true
Expected: 200, returns only in-stock products
```
- [ ] Test inStock=true - all should have stock > 0
- [ ] Test inStock=false - all should have stock = 0 (optional)

### 2.7 Get Single Product
```
GET /api/products/:id
Expected: 200, returns complete product with category and reviews
```
- [ ] Fetch product by valid ID
- [ ] Verify includes category info
- [ ] Verify includes latest reviews (up to 10)
- [ ] Test with invalid ID - should return 404

### 2.8 Get Categories
```
GET /api/products/categories
Expected: 200, returns { "success": true, "data": [...] }
```
- [ ] Verify returns array of categories
- [ ] Each category has: id/slug, name, icon, count
- [ ] Verify category counts are accurate

---

## Phase 3: Cart APIs (Require Authentication)

### Setup: Login first
```
Get token from /api/auth/login
All requests include: Authorization: Bearer {token}
```

### 3.1 Get Cart
```
GET /api/cart
Header: Authorization: Bearer {token}
Expected: 200, returns { "success": true, "items": [...], "subtotal": N, "total": N }
```
- [ ] Get empty cart - should return empty items array
- [ ] Get cart with items - should return items with totals
- [ ] Verify totals calculation: subtotal, discount, total

### 3.2 Add to Cart
```
POST /api/cart
Body: { "productId": "prod-1", "quantity": 2, "color": "Red", "size": "L" }
Expected: 201, returns success message and added item
```
- [ ] Add single item
- [ ] Add same item again - should increase quantity
- [ ] Add item with different color/size - should create separate entry
- [ ] Verify stock validation (can't add more than available)
- [ ] Verify product exists check

### 3.3 Update Cart Item Quantity
```
PUT /api/cart/:cartItemId
Body: { "quantity": 5 }
Expected: 200, returns updated item
```
- [ ] Update quantity to higher value
- [ ] Update quantity to 1
- [ ] Test quantity validation (no zero/negative)
- [ ] Verify stock limits enforced

### 3.4 Remove from Cart
```
DELETE /api/cart/:cartItemId
Expected: 200, returns success
```
- [ ] Remove single item
- [ ] Verify item no longer in cart
- [ ] Get cart should show updated list

### 3.5 Clear Cart
```
DELETE /api/cart
Expected: 200, returns success
```
- [ ] Clear entire cart
- [ ] Get cart should return empty items array
- [ ] Add item again to verify cart still works

---

## Phase 4: Wishlist APIs (Require Authentication)

### 4.1 Get Wishlist
```
GET /api/wishlist
Header: Authorization: Bearer {token}
Expected: 200, returns { "success": true, "items": [...], "count": N }
```
- [ ] Get wishlist (may be empty)
- [ ] Each item should have: id, productId, name, price, rating, stock

### 4.2 Add to Wishlist
```
POST /api/wishlist
Body: { "productId": "prod-1" }
Expected: 201, returns added item
```
- [ ] Add product to wishlist
- [ ] Try adding same product again - should return 400 (already exists)
- [ ] Verify product exists validation

### 4.3 Remove from Wishlist
```
DELETE /api/wishlist/:wishlistItemId
Expected: 200, returns success
```
- [ ] Remove item from wishlist
- [ ] Get wishlist should show updated list
- [ ] Add it back to verify still works

### 4.4 Check if in Wishlist
```
GET /api/wishlist/check/:productId
Expected: 200, returns { "success": true, "inWishlist": boolean, "wishlistItemId": "..." }
```
- [ ] Check product in wishlist - should return true
- [ ] Check product not in wishlist - should return false
- [ ] Should work without authentication (returns inWishlist: false)

---

## Phase 5: Order APIs (Require Authentication)

### 5.1 Create Order
```
POST /api/orders
Body: {
  "items": [
    { "productId": "prod-1", "quantity": 1, "color": "Red", "size": "L" }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "MH",
    "pincode": "400001"
  },
  "paymentMethod": "credit_card",
  "couponCode": "SAVE10"  // optional
}
Expected: 201, returns created order with ID, tracking number, timeline
```
- [ ] Create order with single item
- [ ] Create order with multiple items
- [ ] Verify order ID generated
- [ ] Verify tracking number assigned
- [ ] Verify stock reduced for products
- [ ] Verify coupon applied (if provided)
- [ ] Verify cart cleared after order
- [ ] Check order has timeline with 6 steps
- [ ] Verify order status = "Confirmed"

### 5.2 Get User Orders
```
GET /api/orders
Header: Authorization: Bearer {token}
Expected: 200, returns { "success": true, "orders": [...], "count": N }
```
- [ ] Get orders after creating one
- [ ] Verify returned orders include: id, date, status, items, tracking
- [ ] Most recent order should be first
- [ ] Can't access other users' orders

### 5.3 Get Order Tracking
```
GET /api/orders/:orderId/track
Expected: 200, returns complete order with timeline
```
- [ ] Track by order ID
- [ ] Track by tracking number
- [ ] Verify includes all tracking info
- [ ] Invalid ID should return 404

---

## Phase 6: Coupon APIs

### 6.1 Get Active Coupons
```
GET /api/coupons
Expected: 200, returns { "success": true, "coupons": [...], "count": N }
```
- [ ] Should return available coupons
- [ ] Each coupon has: code, description, discountType, discountValue
- [ ] Only non-expired coupons returned
- [ ] No authentication required

### 6.2 Validate Coupon
```
POST /api/coupons/validate
Body: { "code": "SAVE10", "cartTotal": 1000 }
Expected: 200, returns discount amount and final total
```
- [ ] Validate valid coupon "SAVE10"
- [ ] Validate expired coupon - should return error
- [ ] Validate minimum cart value requirement
- [ ] Validate percentage discount calculation
- [ ] Validate fixed discount calculation
- [ ] Validate usage limit check
- [ ] Invalid code should return 404

### 6.3 Create Coupon (Admin Only)
```
POST /api/coupons
Header: Authorization: Bearer {admin-token}
Body: { "code": "NEWCODE", "discountType": "percentage", "discountValue": 15 }
Expected: 201, returns created coupon
```
- [ ] Admin can create coupon (needs admin token)
- [ ] Non-admin should get 403
- [ ] Duplicate code should return error

### 6.4 Update Coupon (Admin Only)
```
PUT /api/coupons/:couponId
Header: Authorization: Bearer {admin-token}
Body: { "discountValue": 20 }
Expected: 200, returns updated coupon
```
- [ ] Update existing coupon
- [ ] Verify changes persisted

### 6.5 Delete Coupon (Admin Only)
```
DELETE /api/coupons/:couponId
Header: Authorization: Bearer {admin-token}
Expected: 200, returns success
```
- [ ] Delete coupon
- [ ] Validate coupon no longer works

---

## Phase 7: Error Handling Tests

### 7.1 Authentication Errors
- [ ] 401 when no token provided for protected endpoint
- [ ] 401 when invalid token provided
- [ ] 403 when non-admin tries admin endpoint

### 7.2 Validation Errors
- [ ] 400 for missing required fields
- [ ] 400 for invalid data types
- [ ] 400 for out-of-range values

### 7.3 Not Found Errors
- [ ] 404 for non-existent product
- [ ] 404 for non-existent order
- [ ] 404 for non-existent cart item

### 7.4 Server Errors
- [ ] Test with backend stopped - should show graceful error
- [ ] Database error handling

---

## Phase 8: Frontend Integration Tests

### 8.1 Login Flow
- [ ] Navigate to /
- [ ] See login page (not signed in)
- [ ] Enter valid credentials
- [ ] Token stored in localStorage
- [ ] Redirected to store after login
- [ ] Can see user name in navbar

### 8.2 Browse Products
- [ ] Products load from API
- [ ] Can filter by category
- [ ] Can search products
- [ ] Can sort by price/rating
- [ ] Pagination works

### 8.3 Cart Operations
- [ ] Add product to cart
- [ ] Cart updates in real-time
- [ ] Can update quantity
- [ ] Can remove item
- [ ] Cart totals calculate correctly

### 8.4 Wishlist Operations
- [ ] Add product to wishlist
- [ ] Heart icon updates
- [ ] Can view wishlist
- [ ] Can remove from wishlist

### 8.5 Checkout Flow
- [ ] Enter shipping address
- [ ] Select payment method
- [ ] Apply coupon (if testing)
- [ ] Place order
- [ ] Get order confirmation
- [ ] Order appears in order history
- [ ] Can track order

### 8.6 Admin Portal
- [ ] Admin login with admin@cartverse.io / Admin@2026!
- [ ] Can view orders
- [ ] Can update order status
- [ ] Can manage products (if needed)

---

## Phase 9: Performance Tests

- [ ] Products load in < 2 seconds
- [ ] Search returns results in < 1 second
- [ ] Add to cart updates UI instantly
- [ ] No console errors
- [ ] No memory leaks on repeated operations
- [ ] Bundle size < 150KB gzipped (currently 129KB ✅)

---

## Phase 10: Cross-Browser Tests

- [ ] Chrome: All features work
- [ ] Firefox: All features work
- [ ] Safari: All features work (if available)
- [ ] Mobile Safari: Responsive and works

---

## API Test Credentials

### Customer Account (Pre-seeded)
```
Email: alex.mercer@cartverse.io
Password: Password@123
```

### Admin Account (Pre-seeded)
```
Email: admin@cartverse.io
Password: Admin@2026!
```

### Test Products
Available from: `GET /api/products?limit=10`

### Test Coupons (Available)
- SAVE10 - 10% off
- SAVE20 - 20% off (min ₹2000)
- FLAT100 - ₹100 off
- WELCOME - 15% off (min ₹1000)
- SUMMER50 - ₹50 off

---

## Troubleshooting

### Backend not responding
```bash
# Check if running
curl http://localhost:5000/api/health

# Restart
docker compose -f docker-compose.base44.yml restart api
```

### Database issues
```bash
# Reset database
npx prisma db push --force-reset
node server/scripts/seed.js
```

### JWT token issues
- Clear localStorage: DevTools → Application → Clear storage
- Re-login to get fresh token

### CORS errors
- Ensure backend CORS allows localhost:3000
- Check Access-Control-Allow-Origin header

---

## Sign-Off

- [ ] All Phase 1-7 tests passed
- [ ] No critical errors found
- [ ] Performance acceptable
- [ ] Frontend integration verified
- [ ] Admin panel working
- [ ] Ready for production deployment

**Test Date**: ________
**Tester Name**: ________
**Result**: ☐ PASS ☐ FAIL

**Issues Found**: (if any)
_________________________________
_________________________________
_________________________________

**Notes**:
_________________________________
_________________________________

---

## Next Steps (After Testing)
1. Commit all code changes
2. Push to GitHub main branch
3. Deploy to Vercel (frontend)
4. Deploy to production server (backend)
5. Verify production URLs work
6. Monitor error logs
7. Phase 2: Advanced features (reviews, recommendations, etc.)
