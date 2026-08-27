# API Integration Quick Reference

## Using APIs in Components

### Import the API Client
```javascript
import apiClient from '../utils/apiClient';
```

### Using Context Functions
```javascript
import { useShop } from '../context/ShopContext';

function MyComponent() {
  const { 
    userLogin, 
    addToCart, 
    applyCoupon, 
    placeOrder 
  } = useShop();

  // All functions that interact with APIs are now async
  const handleLogin = async (email, password) => {
    const result = await userLogin(email, password);
    if (result.success) {
      // User logged in successfully
    }
  };

  const handleAddToCart = async (product) => {
    await addToCart(product, 1);
    // Toast and API sync happen automatically
  };

  return {/* ... */};
}
```

## Common Patterns

### Authentication

```javascript
// Login
const result = await userLogin('user@example.com', 'password123');
if (result.success) {
  // User is logged in, token stored, state updated
  console.log(result.user.name);
} else {
  // Show error: result.error
  console.error(result.error);
}

// Logout (from AdminPanel or AccountView)
adminLogout(); // or trigger logout in cart
```

### Cart Operations

```javascript
// Add item
await addToCart(product, quantity, color, size);
// Local state updates instantly, API syncs in background

// Update quantity
await updateCartQuantity(cartIndex, newQuantity);

// Remove item
await removeFromCart(cartIndex);

// Clear all
await clearCart();

// Get totals
const { subtotal, discount, shippingFee, tax, total } = getCartTotals();
```

### Wishlist

```javascript
// Toggle add/remove
await toggleWishlist(productId);
// Automatically handles adding or removing based on current state

// Check if in wishlist
const isWishlisted = wishlist.includes(productId);
```

### Coupons

```javascript
// Apply coupon code
const success = await applyCoupon('SAVE20');
if (success) {
  // Coupon applied, discount calculated
  const { discount } = getCartTotals();
}

// Remove coupon
removeCoupon();
```

### Orders

```javascript
// Place order
const order = await placeOrder({
  items: cart,
  shippingAddress: selectedAddress,
  paymentMethod: 'credit_card',
  totals: getCartTotals()
});

// Order object has:
// - id: order ID
// - date: ISO timestamp
// - status: 'Confirmed', etc
// - items: order items
// - tracking info
// - timeline
```

### Fetching Data

```javascript
// Products already fetched on mount via fetchProducts()

// Fetch single product details
const product = await fetchProductById('prod-123');

// Categories already fetched on mount via fetchCategories()

// Products sync automatically on user login
// Cart syncs via syncCartFromAPI()
// Wishlist syncs via syncWishlistFromAPI()
// Orders sync via syncOrdersFromAPI()
```

## Error Handling

### In Components
```javascript
const handleCheckout = async () => {
  try {
    const order = await placeOrder(orderData);
    // Success - component already shows success toast
  } catch (error) {
    console.error('Checkout failed:', error);
    // Error toast already shown by ShopContext
  }
};
```

### Toast System (Built-in)
```javascript
// Errors show automatically
// Success messages show automatically
// Info messages show automatically

// Example from addToCart:
addToast({
  type: 'success',
  title: 'Added to Bag 🛍️',
  message: `${product.name.substring(0, 26)}... (${quantity}x)`
});
```

## State Patterns

### Responsive UI with Local State
```javascript
// Pattern: Update local state, then sync with API

// Before:
setCart([...cart, newItem]); // Instant UI update
// Behind the scenes:
// apiClient.addToCart() called if user logged in

// Component sees instant update, backend syncs automatically
```

### Handling API Unavailability
```javascript
// If backend is down:
// 1. localStorage is used as fallback
// 2. Local state continues to work
// 3. Operations are queued/retried when backend recovers
// 4. No user-facing errors (just slower, offline mode)
```

## Key State Management Rules

1. **Always use async/await**: `await userLogin()`, `await addToCart()`
2. **Don't call apiClient directly**: Use context functions instead
3. **Trust local state for UI**: Local state updates first
4. **Errors handled by context**: Toasts show automatically
5. **User token managed automatically**: Don't manually set headers

## Component Examples

### Login Component
```javascript
async function handleLogin() {
  setLoading(true);
  const result = await userLogin(email, password, { 
    name: fullName,
    phone: phoneNumber 
  });
  
  if (result.success) {
    navigate('/shop');
  }
  setLoading(false);
}
```

### Add to Cart Button
```javascript
async function handleAddToCart() {
  setAdding(true);
  await addToCart(product, quantity, selectedColor, selectedSize);
  // Toast shows automatically
  // API syncs in background
  setAdding(false);
}
```

### Checkout Flow
```javascript
async function handleCheckout() {
  setProcessing(true);
  
  const order = await placeOrder({
    items: cart,
    shippingAddress: addresses[selectedAddressIndex],
    paymentMethod: paymentMethod,
    totals: getCartTotals()
  });
  
  if (order) {
    // Confetti shows automatically
    // Notifications added automatically
    // Cart cleared automatically
    navigate(`/order/${order.id}`);
  }
  
  setProcessing(false);
}
```

### Wishlist Toggle
```javascript
async function handleWishlistClick(productId) {
  await toggleWishlist(productId);
  // Toast shows automatically (added/removed)
  // API syncs in background
  setHeartIcon(wishlist.includes(productId) ? '❤️' : '🤍');
}
```

## Debugging Tips

### Check if User is Logged In
```javascript
const { user } = useShop();
console.log(user?.token); // JWT token if logged in
console.log(user?.id); // User ID
```

### Monitor API Calls
```javascript
// Open DevTools → Network tab
// Look for requests to /api/*
// Check Headers for Authorization: Bearer <token>
```

### Check Local Storage
```javascript
// DevTools → Application → LocalStorage
// cartverse_token - JWT token
// aura_user - User object
// aura_cart - Cart items
// aura_wishlist - Wishlist items
```

### Verify Backend Running
```bash
curl http://localhost:5000/api/health
# Should return: { "status": "healthy", ... }
```

### Common Issues

**Issue**: Cart not persisting after refresh
- Check: Is user logged in? (localStorage shows cartverse_token)
- Solution: Login will sync cart from API

**Issue**: API calls failing with 401
- Check: Token stored in localStorage
- Solution: Login again to get fresh token

**Issue**: Coupons not working
- Check: Coupon code matches exactly (case-insensitive comparison)
- Check: Minimum spend requirements met
- Solution: See backend coupon routes for available codes

**Issue**: Orders not appearing
- Check: Is user logged in?
- Solution: Orders sync automatically on login via syncOrdersFromAPI()

## API Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "user": {...},
    "token": "jwt_token_here",
    // or
    "items": [...],
    // or
    "order": {...}
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

## Performance Notes

- Cart, wishlist, orders sync happens **silently in background**
- UI stays responsive because local state updates first
- API calls won't block user interactions
- Failed API calls fall back to local state automatically

## Deployment Checklist

Before deploying to production:

- [ ] Set `VITE_API_PROXY_TARGET` to production API URL
- [ ] Verify JWT secret matches backend
- [ ] Test all API endpoints are accessible
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Test offline fallbacks
- [ ] Verify token refresh (if implemented)
- [ ] Check CORS settings on backend
- [ ] Set secure cookie flags for tokens
- [ ] Enable HTTPS
- [ ] Set appropriate request timeouts

## Support Commands

```bash
# Start backend
docker compose -f docker-compose.base44.yml up -d

# Check backend health
curl http://localhost:5000/api/health

# View backend logs
docker logs -f api

# Stop backend
docker compose -f docker-compose.base44.yml down

# Rebuild after code changes
npm run build

# Start dev server
npm run dev
```

## More Information

- Full guide: See `/API_INTEGRATION_GUIDE.md`
- Implementation details: See `/src/utils/apiClient.js`
- Context implementation: See `/src/context/ShopContext.jsx`
