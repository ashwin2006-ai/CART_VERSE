# API Integration Guide for CartVerse

This document outlines the migration from mock data to real backend API integration in the ShopContext.

## Overview

The ShopContext has been updated to use real backend APIs while maintaining local state for optimal UI responsiveness. The integration follows these principles:

1. **Local State First**: UI updates happen immediately with local state for responsiveness
2. **API Sync**: Calls to backend API happen asynchronously in the background
3. **Fallback Handling**: If APIs fail, local fallbacks are used automatically
4. **Token Management**: JWT tokens are automatically stored and included in authenticated requests

## File Changes

### New Files

#### `/src/utils/apiClient.js`
A singleton API client utility that handles:
- Base URL and environment configuration
- JWT token management (get/set/clear)
- Request/response handling and error management
- All CRUD operations for each domain

**Key Features:**
- Automatic token injection in Authorization headers
- Error parsing and logging
- Timeout handling (default 30s)
- Content-type negotiation
- Graceful fallback when APIs are unavailable

### Modified Files

#### `/src/context/ShopContext.jsx`
Updated to integrate API calls with local state management.

## API Endpoints Used

### Authentication
- `POST /api/auth/login` - Customer login
- `POST /api/auth/register` - Customer registration
- `POST /api/auth/admin-login` - Admin login

### Products
- `GET /api/products` - Fetch products with pagination
- `GET /api/products/:id` - Fetch single product (NEW)
- `GET /api/products/categories` - Fetch categories

### Cart
- `GET /api/cart` - Get user's cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:cartItemId` - Update cart item quantity
- `DELETE /api/cart/:cartItemId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Wishlist
- `GET /api/wishlist` - Get wishlist items
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:wishlistItemId` - Remove from wishlist
- `GET /api/wishlist/check/:productId` - Check if product in wishlist

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id/track` - Get order tracking info

### Coupons
- `POST /api/coupons/validate` - Validate coupon code
- `GET /api/coupons` - Get active coupons

## Function Changes

### Authentication

#### `userLogin(email, password, userData)`
**Change**: Now async, calls `POST /api/auth/login` and `POST /api/auth/register`

```javascript
// Before: Synchronous with localStorage only
const result = userLogin('user@example.com', 'password');

// After: Async with API integration
const result = await userLogin('user@example.com', 'password');
// Returns: { success: true, user: {...} } or { success: false, error: '...' }
```

**Behavior**:
- Attempts login via API
- Falls back to registration if user doesn't exist
- Falls back to localStorage for offline mode
- Automatically stores JWT token
- Updates user state with complete user object from API

### Cart Operations

#### `addToCart(product, quantity, color, size)`
**Change**: Now async, syncs with API after local update

```javascript
// Before: Synchronous local state only
addToCart(product, 1, 'Red', 'Large');

// After: Async with API sync
await addToCart(product, 1, 'Red', 'Large');
// Local state updates immediately, API call happens in background
// Includes fallback if API fails
```

#### `updateCartQuantity(index, quantity)`
**Change**: Now async, syncs with API

#### `removeFromCart(index)`
**Change**: Now async, syncs with API

#### `clearCart()`
**Change**: Now async, clears both locally and via API

### Wishlist Operations

#### `toggleWishlist(productId)`
**Change**: Now async, syncs with API

```javascript
// Before: Synchronous
toggleWishlist(productId);

// After: Async with API sync
await toggleWishlist(productId);
```

### Coupon Operations

#### `applyCoupon(code)`
**Change**: Now async, validates via API first

```javascript
// Before: Checked local coupons only
const success = applyCoupon('SAVE20');

// After: Validates via API first, falls back to local
const success = await applyCoupon('SAVE20');
// Checks API endpoint POST /api/coupons/validate
// Falls back to local INITIAL_COUPONS if API unavailable
```

### Order Operations

#### `placeOrder({ items, shippingAddress, paymentMethod, totals })`
**Change**: Now async, creates order via API

```javascript
// Before: Local simulation only
const order = placeOrder({...orderData});

// After: Creates via API
const order = await placeOrder({...orderData});
// Sends to POST /api/orders
// Updates local state and notifications
// Returns merged result (API data + local data for UI)
```

### New Functions

#### `fetchProductById(productId)` 
Fetches detailed product information by ID
```javascript
const product = await fetchProductById('prod-123');
```

#### `syncCartFromAPI()`
Syncs cart from API (called automatically on login)
```javascript
await syncCartFromAPI();
```

#### `syncWishlistFromAPI()`
Syncs wishlist from API (called automatically on login)
```javascript
await syncWishlistFromAPI();
```

#### `syncOrdersFromAPI()`
Syncs orders from API (called automatically on login)
```javascript
await syncOrdersFromAPI();
```

## API Client Configuration

The API client is configured via environment variables:

```env
# .env or .env.production
VITE_API_PROXY_TARGET=http://localhost:5000  # Default for local dev
# In production, set to your API URL
```

For Vite, the API proxy target can be configured in `vite.config.js`:
```javascript
server: {
  proxy: {
    '/api': {
      target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:5000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '/api')
    }
  }
}
```

## Error Handling

All API calls include automatic error handling:

1. **Network Errors**: Logged to console, local fallback used
2. **Authentication Errors (401)**: Token cleared, user returned to login
3. **Validation Errors (400)**: Error message shown in toast
4. **Server Errors (5xx)**: Logged, local fallback used

Example error handling in components:

```javascript
try {
  const result = await applyCoupon('SAVE20');
  if (!result) {
    // Coupon validation failed
  }
} catch (error) {
  console.error('Coupon error:', error);
  // UI already shows error toast from context
}
```

## Token Management

JWT tokens are automatically managed by the API client:

- **Storage**: `localStorage.getItem('cartverse_token')`
- **Header**: `Authorization: Bearer <token>`
- **Expiry**: Server-side (typically 7 days)
- **Refresh**: Not yet implemented - will be added when backend supports it

To clear auth on logout:
```javascript
// ShopContext
apiClient.logout(); // Clears token and user from storage
```

## Migration Checklist

- [x] Create `apiClient.js` utility
- [x] Import `apiClient` in ShopContext
- [x] Update `userLogin()` to use API
- [x] Update `addToCart()` to sync with API
- [x] Update `updateCartQuantity()` to sync with API
- [x] Update `removeFromCart()` to sync with API
- [x] Update `clearCart()` to sync with API
- [x] Update `toggleWishlist()` to sync with API
- [x] Update `applyCoupon()` to validate via API
- [x] Update `placeOrder()` to create via API
- [x] Add `fetchProductById()` function
- [x] Add `syncCartFromAPI()` function
- [x] Add `syncWishlistFromAPI()` function
- [x] Add `syncOrdersFromAPI()` function
- [x] Add sync effect when user logs in
- [x] Test build and verify no errors
- [x] Document changes

## Testing

### Manual Testing Steps

1. **Authentication Flow**:
   - [ ] Login with valid credentials → API called, token stored
   - [ ] Login fails → Error toast shown, local fallback works
   - [ ] Register new user → API called, user created

2. **Cart Operations**:
   - [ ] Add to cart → Local update immediate, API syncs
   - [ ] Update quantity → API called with new quantity
   - [ ] Remove item → API called, item removed from local state
   - [ ] Clear cart → API called, cart cleared

3. **Wishlist**:
   - [ ] Add to wishlist → API called, item added
   - [ ] Remove from wishlist → API called, item removed
   - [ ] Wishlist persists on page refresh → Synced from API

4. **Coupons**:
   - [ ] Apply valid coupon → API validates, discount applied
   - [ ] Apply invalid coupon → Error toast shown
   - [ ] Minimum spend validation → Shows error toast if not met

5. **Orders**:
   - [ ] Place order → API called, order created
   - [ ] Order appears in user's orders → Synced from API
   - [ ] Tracking available → Fetched from API

### API Availability Testing

To test fallback behavior with API unavailable:

1. Stop backend server: `docker compose -f docker-compose.base44.yml down api`
2. Try operations - should use local fallbacks
3. Restart backend: `docker compose -f docker-compose.base44.yml up api -d`
4. Operations should sync to API

## Performance Considerations

1. **Local State First**: UI updates are instant using local state
2. **Background Sync**: API calls happen asynchronously, not blocking UI
3. **Debouncing**: Consider debouncing rapid updates (e.g., quantity changes)
4. **Caching**: API responses are stored in local state; no additional caching layer
5. **Bundle Size**: apiClient adds ~2KB gzipped

## Future Enhancements

1. **Token Refresh**: Implement automatic token refresh before expiry
2. **Request Debouncing**: Add debounce for rapid state changes
3. **Optimistic Updates**: Implement optimistic updates with rollback on failure
4. **Offline Mode**: Implement service worker for better offline support
5. **Request Queuing**: Queue requests when offline, sync when online
6. **Analytics**: Track API performance and error rates

## Support

For issues or questions:
1. Check browser console for detailed error logs
2. Verify backend is running: `curl http://localhost:5000/api/health`
3. Check network tab in DevTools for API calls
4. Review backend logs: `docker logs -f api`
