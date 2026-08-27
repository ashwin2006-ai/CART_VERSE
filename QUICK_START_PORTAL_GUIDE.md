# Quick Start: Admin & User Portal Guide

## 🛍️ User Portal (E-commerce Store)

### What Users See
- Product catalog with search & filters
- Shopping cart with checkout
- Order tracking
- Wishlist
- Account management
- 24/7 customer support chat

### User Flow
```
1. Visit site → Browse products as guest
2. Add items to cart → Checkout
3. Proceed to payment → Optional login
4. Place order → Get tracking link
5. Sign Out → Redirected to homepage (not admin)
```

### Key URLs
- **Homepage:** `https://e-commerce-virid-delta.vercel.app/`
- **Account:** `https://e-commerce-virid-delta.vercel.app/account`
- **Search Example:** `https://e-commerce-virid-delta.vercel.app/` (use search bar)

### User Menu Options
1. ❤️ **Wishlist** - Save favorite products
2. 🛒 **Shopping Cart** - View & edit cart
3. 👤 **My Account** - Orders, addresses, profile
4. 🛡️ **Admin Panel** - (For admins only)
5. 💬 **Help & Support** - Contact customer service
6. 🚪 **Sign Out** - Logout (returns to homepage)

---

## 🔐 Admin Portal (Management)

### What Admins See
- Dashboard with sales KPIs
- Product management
- Inventory tracking
- Sales analytics & charts
- Order management
- Customer database
- Review moderation
- System status & monitoring

### Admin Flow
```
1. Visit /admin → Login screen
2. Enter credentials → Email + Password
3. 2FA verification → Authenticator app code
4. Dashboard → Manage store
5. Sign Out → Redirected to admin login
```

### Access Methods

#### Method 1: Direct URL
```
https://e-commerce-virid-delta.vercel.app/admin
```

#### Method 2: From User Portal
```
User Menu (top-right avatar)
  ↓
Click "🛡️ Admin Panel"
  ↓
Login page appears
```

#### Method 3: Keyboard Shortcut
```
Ctrl+Shift+A (Windows)
Cmd+Shift+A (Mac)
(Only works from user store, not admin)
```

### Admin Credentials
```
📧 Email: ashwin@cartverse.io
🔑 Password: (Your admin password)
🔐 2FA: Authenticator app (Google Authenticator, Microsoft Authenticator, Authy)
```

### Admin Dashboard Tabs
1. **Dashboard** - Overview of sales, orders, inventory
2. **Product Management** - Add/edit/delete products
3. **Inventory** - Stock levels, low stock alerts
4. **Sales Analytics** - Revenue charts, trends
5. **Orders** - View & manage all orders
6. **Customers** - User list & management
7. **Coupons** - Create discount codes
8. **Reviews** - Moderate product reviews
9. **System Status** - Database stats, health check
10. **2FA Settings** - Security configuration

---

## 🔀 Portal Switching

### From Store to Admin
```
Option A: User Menu → Admin Panel
Option B: Keyboard shortcut Ctrl+Shift+A
Option C: Direct URL /admin
```

### From Admin to Store
```
Click: ← Back to Store (button on admin header)
OR Manually type: https://e-commerce-virid-delta.vercel.app/
```

---

## 🚪 Logout Behavior (IMPORTANT)

### User Logout
✅ User clicks "Sign Out" in user menu
✅ Session cleared
✅ **User is redirected to homepage (/)**
✅ User can browse as guest or login again

### Admin Logout
✅ Admin clicks "Logout" in admin menu
✅ Admin session cleared
✅ **Admin is redirected to admin login (/admin)**
✅ Admin must enter credentials to access again

### Clear Separation
- **User Logout** → Home page (store browsing)
- **Admin Logout** → Admin login page (admin only)

---

## 📱 Mobile Experience

### User Portal on Mobile
- Responsive navigation (hamburger menu)
- Touch-optimized buttons
- Full product catalog accessible
- Smooth checkout flow
- Bottom navigation bar

### Admin Portal on Mobile
- Sidebar collapses to top bar
- Responsive data tables
- Touch-friendly admin controls
- Compact layout (<480px)
- All features accessible

---

## 🔒 Security

### User Portal Security
- ✅ Guest checkout allowed (no login needed)
- ✅ Optional login for order tracking
- ✅ Password hashing
- ✅ HTTPS/SSL encrypted

### Admin Portal Security
- 🔐 **Mandatory login** (cannot access as guest)
- 🔐 **2FA authentication** (app-based codes)
- 🔐 **Session token expiry** (auto-logout)
- 🔐 **IP protection** (future enhancement)
- 🔐 **Audit logging** (admin action tracking)

---

## ⚡ Troubleshooting

### "User Logout Goes to Admin Login"
❌ OLD BEHAVIOR (Fixed)
✅ NEW BEHAVIOR: Goes to homepage

**If you see admin login after user logout:**
1. Hard refresh page: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache & cookies
3. Try again

### "Can't Access Admin Portal"
1. Verify you're using correct URL: `/admin`
2. Enter correct admin credentials
3. Check 2FA code is current
4. Ensure cookies are enabled

### "Lost Admin Session"
- Admin portal auto-logs out after 30 minutes (security)
- Simply navigate to `/admin` and login again
- No data is lost

---

## 📊 Quick Reference

| Feature | User Portal | Admin Portal |
|---------|-------------|--------------|
| **URL** | `/` | `/admin` |
| **Access** | Public (no login needed) | Private (admin only) |
| **Authentication** | Optional | Required |
| **2FA** | No | Yes (authenticator app) |
| **Main Function** | Shop & order | Manage store |
| **Logout Location** | Homepage | Admin login |
| **Mobile Ready** | ✅ Yes | ✅ Yes |
| **Keyboard Shortcut** | Ctrl+Shift+A (to admin) | N/A |

---

## 🎯 Day-to-Day Usage

### Store Manager Tasks
1. **Morning Check:** Visit `/admin` → Dashboard (check overnight orders)
2. **Inventory:** Inventory tab → Check stock levels
3. **New Orders:** Orders tab → Process & ship
4. **Reviews:** Reviews tab → Respond to feedback
5. **Evening:** Check Analytics → Daily trends
6. **Sign Out** → Returns to admin login (secure)

### Customer Usage
1. **Browse:** Visit homepage → search products
2. **Purchase:** Add to cart → Checkout
3. **Track Order:** My Account → Orders → View tracking
4. **Logout** → Returns to homepage (can browse as guest)

---

## 🚀 Production Deployment

✅ **Status:** LIVE & READY
- User Portal: https://e-commerce-virid-delta.vercel.app/
- Admin Portal: https://e-commerce-virid-delta.vercel.app/admin
- All features deployed
- Mobile responsive
- Zero downtime

---

## 📞 Support

### For Users
- 💬 In-app chat support (bottom-right widget)
- 📧 Email: support@cartverse.io
- 📞 Call: 1-800-CARTVERSE

### For Admins
- 📊 System Status page (in admin panel)
- 🔧 Review logs & error tracking
- 🎯 Dashboard shows real-time metrics

---

**Last Updated:** August 25, 2026
**Version:** 1.0 - Production
