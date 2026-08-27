# Separate Admin & User Portals - Architecture

## Overview
The e-commerce application now features two completely separate portals:

1. **User Portal** (E-commerce Store) - `https://e-commerce-virid-delta.vercel.app/`
2. **Admin Portal** (Management) - `https://e-commerce-virid-delta.vercel.app/admin`

## Architecture

### User Portal (Customer Site)
- **Route:** `/` or `/store`
- **Access:** Public (all visitors)
- **Features:**
  - Browse products
  - Search & filter
  - Add to cart
  - Checkout & payment
  - Order tracking
  - Account management
  - Product reviews
  - Wishlist

### Admin Portal (Management)
- **Route:** `/admin`
- **Access:** Admin credentials required
- **Features:**
  - Dashboard with KPIs
  - Product management
  - Inventory tracking
  - Sales analytics
  - Order management
  - Customer management
  - Coupon management
  - Review moderation
  - System status monitoring
  - 2FA security

## URL Navigation

### User Portal URLs
```
/                  → Homepage with products
/admin?login       → Shows admin login (accessible to anyone but restricted)
/account           → User account page (with orders, wishlist, addresses)
```

### Admin Portal URLs
```
/admin             → Admin login (if not authenticated)
                   → Admin dashboard (if authenticated)
```

### Navigation via Code
```javascript
// Go to user store
setCurrentView('store');
window.location.hash = '';

// Go to admin portal
setCurrentView('admin');
window.location.hash = '#admin';
// OR directly navigate
window.location.pathname = '/admin';
```

## Logout Behavior

### User Logout Flow
```
User Menu → Sign Out
    ↓
Clear session data
Remove auth tokens
Reset user to "Guest User"
    ↓
Redirect to Store Homepage (/)
    ↓
Show "Signed Out" toast message
```

### Admin Logout Flow
```
Admin Menu → Logout
    ↓
Clear admin session
Remove admin auth token
    ↓
Redirect to Admin Login (/admin)
    ↓
Show "Logged Out" message
```

## Access Control

### User Portal Access
- ✅ Open to public (no authentication needed)
- ✅ Login optional for checkout
- ✅ Guest checkout supported
- ✅ Anonymous browsing allowed

### Admin Portal Access
- 🔒 Requires admin credentials
- 🔒 Email: `ashwin@cartverse.io`
- 🔒 Password: Set during signup
- 🔒  2FA available (authenticator app + hardware token)
- 🔒 Keyboard shortcut: `Ctrl+Shift+A` (from user portal)

## Implementation Details

### App.jsx Route Handler
```javascript
useEffect(() => {
  const checkPath = () => {
    if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
      setCurrentView('admin');
    } else if (window.location.pathname === '/account') {
      setCurrentView('account');
    } else {
      setCurrentView('store');
    }
  };
  checkPath();
  window.addEventListener('hashchange', checkPath);
  return () => window.removeEventListener('hashchange', checkPath);
}, [setCurrentView]);
```

### Context State Management
- `currentView`: Tracks current section ('store', 'admin', 'account')
- `adminAuth`: Manages admin login state
- `user`: Manages logged-in customer data

### Navbar Integration
- Admin button visible in user menu with keyboard shortcut hint
- Users can navigate to admin portal from store
- Admin portal has return-to-store button

## User Experience Flow

### New Customer Journey
```
Visit Store (/) 
  → Browse Products
  → Add to Cart
  → Checkout (optional login)
  → Place Order
  → Sign Out → Returns to Store Homepage
```

### Admin Journey
```
Visit Admin (/admin)
  → Enter Credentials
  → 2FA Verification (if enabled)
  → Access Admin Dashboard
  → Manage Store
  → Sign Out → Returns to Admin Login
```

### Customer with Account
```
Store Homepage
  → User Menu → My Account
  → View Orders & Addresses
  → Edit Profile
  → Sign Out → Returns to Store Homepage (as guest)
```

## Security Features

### User Portal
- Guest checkout available
- Optional authentication
- Secure password hashing
- Session tokens in localStorage
- HTTPS/SSL encrypted

### Admin Portal
- Mandatory authentication
- Two-Factor Authentication (2FA)
  - Authenticator app (Google, Microsoft, Authy)
  - Hardware token backup
  - Recovery codes
- Admin-only routes protected
- Secure admin credentials
- Session timeout on admin logout

## Mobile Responsiveness

Both portals are fully responsive:
- **Desktop** (>1024px): Full layout
- **Tablet** (768px-1024px): Optimized layout
- **Mobile** (<768px): Touch-friendly layout
- **Small Mobile** (<480px): Ultra-compact layout

## Testing Access

### Test User Portal
1. Visit: `https://e-commerce-virid-delta.vercel.app/`
2. Browse products as guest
3. Sign out (if logged in) → redirects to store homepage
4. Access admin from user menu → redirects to admin login

### Test Admin Portal
1. Visit: `https://e-commerce-virid-delta.vercel.app/admin`
2. Enter admin credentials
3. Complete 2FA if enabled
4. Access admin dashboard
5. Sign out → redirects to admin login page

## Browser Navigation

### Via URL Bar
```
https://e-commerce-virid-delta.vercel.app/      → User Store
https://e-commerce-virid-delta.vercel.app/admin  → Admin Portal
https://e-commerce-virid-delta.vercel.app/admin?login → Admin Login (forced)
```

### Via Hash
```
https://e-commerce-virid-delta.vercel.app/#store   → User Store
https://e-commerce-virid-delta.vercel.app/#admin   → Admin Portal
https://e-commerce-virid-delta.vercel.app/#account → User Account
```

## Deployment Status
- ✅ Production: https://e-commerce-virid-delta.vercel.app/
- ✅ Separate portals deployed
- ✅ Logout flow fixed (users → home, admins → login)
- ✅ All routes responsive (mobile-first)
- ✅ Build: 124.59 kB gzipped
- ✅ Zero runtime errors

## Future Enhancements
1. Dynamic admin portal URL (separate subdomain)
2. API-based authentication with JWT refresh tokens
3. Role-based access control (multiple admin roles)
4. Audit logging for admin actions
5. Admin IP whitelist restrictions
6. Email notifications for admin login
7. Admin session activity dashboard

---

**Last Updated:** August 25, 2026
**Version:** 1.0
**Status:** Production Ready ✅
