# Backend API Integration Summary

## Completed Work

The CartVerse e-commerce frontend has been successfully updated to integrate with real backend APIs instead of using mock data. This integration maintains the responsive UI by keeping local state and syncing asynchronously with the server.

## Files Created

### 1. `/src/utils/apiClient.js` (New)
A comprehensive API client utility that serves as the single point of contact between the frontend and backend.

**Key Features**:
- **Token Management**: Automatic JWT token storage and retrieval
- **Request Building**: Constructs properly formatted requests with auth headers
- **Error Handling**: Parses HTTP errors and returns structured error objects
- **Timeout Protection**: 30-second default timeout on all requests
- **Fallback Support**: Gracefully degrades when APIs are unavailable

**Main Methods**:
```javascript
// Auth
apiClient.loginCustomer(email, password)
apiClient.registerCustomer(email, password, name, phone)
apiClient.adminLogin(email, password)
apiClient.logout()

// Products
apiClient.fetchProducts(page, limit, filters)
apiClient.fetchProductById(productId)
apiClient.fetchCategories()

// Cart
apiClient.getCart()
apiClient.addToCart(productId, quantity, color, size)
apiClient.updateCartItem(cartItemId, quantity)
apiClient.removeFromCart(cartItemId)
apiClient.clearCart()

// Wishlist
apiClient.getWishlist()
apiClient.addToWishlist(productId)
apiClient.removeFromWishlist(wishlistItemId)
apiClient.checkWishlist(productId)

// Orders
apiClient.createOrder(orderData)
apiClient.getUserOrders()
apiClient.getOrderTracking(orderId)

// Coupons
apiClient.validateCoupon(code, subtotal)
apiClient.getActiveCoupons()
```

## Files Modified

### 1. `/src/context/ShopContext.jsx`
Updated to use the new API client for all backend operations.

**Key Changes**:

#### Authentication
- `userLogin()` → Now async, calls `POST /api/auth/login`
  - Attempts API login first
  - Falls back to registration if user doesn't exist
  - Falls back to localStorage for offline mode
  - Automatically manages JWT token

#### Cart Operations
- `addToCart()` → Async with API sync
  - Updates local state immediately for instant UI response
  - Syncs to API in background if user is logged in
- `updateCartQuantity()` → Async with API sync
- `removeFromCart()` → Async with API sync  
- `clearCart()` → Async with API sync

#### Wishlist Operations
- `toggleWishlist()` → Async with API sync
  - Updates local state immediately
  - Syncs to API: `POST /api/wishlist` or `DELETE /api/wishlist/:id`

#### Coupon Operations
- `applyCoupon()` → Async with API validation
  - Validates via `POST /api/coupons/validate` if user logged in
  - Falls back to local coupon list if API unavailable
  - Checks minimum spend requirements

#### Order Operations
- `placeOrder()` → Async, creates order via API
  - Sends complete order data to `POST /api/orders`
  - Maintains local order for UI responsiveness
  - Merges API response with local data

#### New Functions Added
- `fetchProductById(productId)` - Fetch single product details from API
- `syncCartFromAPI()` - Reload cart items from API
- `syncWishlistFromAPI()` - Reload wishlist from API
- `syncOrdersFromAPI()` - Reload orders from API
- Auto-sync on user login (useEffect hook)

## Integration Architecture

### Request Flow

```
User Action
    ↓
Local State Update (instant UI response)
    ↓
API Call (async, non-blocking)
    ├─ Success: State kept in sync
    └─ Failure: Local state is source of truth, auto-fallback

User sees immediate response, backend stays in sync
```

### Error Handling Strategy

1. **Network/Server Errors**: Logged to console, local state used as fallback
2. **Auth Errors (401)**: Token cleared, user redirected to login
3. **Validation Errors (400)**: Error toast shown to user
4. **Timeout**: User sees local fallback, can retry

## API Endpoints Used

All endpoints correspond to the backend routes in `/server/routes/`:

| Domain | Method | Endpoint | Protected |
|--------|--------|----------|-----------|
| Auth | POST | /api/auth/login | No |
| Auth | POST | /api/auth/register | No |
| Auth | POST | /api/auth/admin-login | No |
| Products | GET | /api/products | No |
| Products | GET | /api/products/:id | No |
| Products | GET | /api/products/categories | No |
| Cart | GET | /api/cart | Yes |
| Cart | POST | /api/cart | Yes |
| Cart | PUT | /api/cart/:cartItemId | Yes |
| Cart | DELETE | /api/cart/:cartItemId | Yes |
| Cart | DELETE | /api/cart | Yes |
| Wishlist | GET | /api/wishlist | Yes |
| Wishlist | POST | /api/wishlist | Yes |
| Wishlist | DELETE | /api/wishlist/:wishlistItemId | Yes |
| Wishlist | GET | /api/wishlist/check/:productId | Yes |
| Orders | POST | /api/orders | Yes |
| Orders | GET | /api/orders | Yes |
| Orders | GET | /api/orders/:id/track | No |
| Coupons | POST | /api/coupons/validate | No |
| Coupons | GET | /api/coupons | No |

## Authentication Flow

```javascript
// Login
1. User enters email/password
2. userLogin() calls apiClient.loginCustomer()
3. Backend validates, returns JWT token and user object
4. Token stored in localStorage, user stored in ShopContext
5. Token automatically included in all subsequent requests

// Logout
1. apiClient.logout() clears token and user from storage
2. User state set to INITIAL_USER
3. Unauthenticated requests fail with 401, redirect to login
```

## State Management Strategy

### Local State (Immediate Updates)
- Products, categories, reviews, coupons (cached from API)
- Cart items, wishlist items (synced with API)
- User data (synced with API on login)
- UI states (modals, filters, search)

### API-Sourced Data (Synced)
When user logs in, three sync functions run:
- `syncCartFromAPI()` - Get latest cart
- `syncWishlistFromAPI()` - Get latest wishlist  
- `syncOrdersFromAPI()` - Get latest orders

### Conflict Resolution
If API and local state differ:
- API is always source of truth for user-specific data (cart, wishlist, orders)
- Local state used as working copy for responsiveness
- On sync, API data overwrites local data

## Environment Configuration

The API client reads the base URL from environment:

```env
# Development (default)
VITE_API_PROXY_TARGET=http://localhost:5000

# Production
VITE_API_PROXY_TARGET=https://api.cartverse.app
```

The Vite proxy in `vite.config.js` routes all `/api/*` requests to the configured target.

## Build Verification

The updated code has been verified to:
- ✅ Compile without errors
- ✅ Build successfully with Vite
- ✅ Import all required dependencies
- ✅ Maintain all existing functionality
- ✅ Add new API integration features

## Backward Compatibility

- ✅ Existing UI components work without changes
- ✅ Mock data still available as fallback
- ✅ localStorage fallback for offline mode
- ✅ Works with or without backend running
- ✅ Token-based auth integrates with existing admin flow

## Performance Characteristics

- **Network Overhead**: ~2KB additional code (apiClient.js)
- **Bundle Size**: Minimal impact, uses native fetch API
- **UI Responsiveness**: Instant (local state updates first)
- **API Sync**: Non-blocking (happens in background)
- **Error Recovery**: Automatic fallback to local state

## Testing Recommendations

### Manual Testing
1. Login/Register flows
2. Add/Remove cart items
3. Add/Remove wishlist items
4. Apply coupons
5. Place orders
6. Check order history

### API Availability Testing
1. Stop backend: `docker compose down api`
2. Verify local fallbacks work
3. Restart backend: `docker compose up api -d`
4. Verify sync works

### Error Scenario Testing
1. Invalid credentials
2. Network timeout
3. Invalid coupon code
4. Out of stock items
5. Invalid cart state

## Documentation

See `/API_INTEGRATION_GUIDE.md` for detailed migration guide and function reference.

## Next Steps (Future)

1. **Token Refresh**: Implement automatic token refresh before expiry
2. **Request Debouncing**: Debounce rapid cart updates
3. **Optimistic Updates**: Better UX with optimistic updates and rollbacks
4. **Offline Mode**: Service worker for offline support
5. **Analytics**: Track API performance
6. **Error Tracking**: Sentry or similar for production error monitoring

## Summary

The CartVerse frontend now seamlessly integrates with real backend APIs while maintaining excellent UI responsiveness through local state management. The API client provides a clean, reusable interface for all backend operations, with automatic error handling and graceful degradation when services are unavailable.

Users experience instant UI updates locally, while the system synchronizes with the server asynchronously in the background. This architecture provides the best of both worlds: responsiveness and data consistency.
