# Application Architecture - Portal Separation

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     CARTVERSE E-COMMERCE                         │
│                  (Single React App - Dual Portal)                │
└─────────────────────────────────────────────────────────────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
         ┌──────▼────────┐ ┌──▼──────────┐ ┌─▼──────────┐
         │  URL Router   │ │ Hash Route  │ │ App State  │
         │   (pathname)  │ │ (#/admin)   │ │ Manager    │
         └──────┬────────┘ └──┬──────────┘ └─┬──────────┘
                │              │              │
        ┌───────┴──────────────┴──────────────┴────────┐
        │                                               │
        │  App.jsx - Route Detection & Rendering      │
        │  ┌─────────────────────────────────────┐    │
        │  │ useEffect checks:                   │    │
        │  │ - window.location.pathname          │    │
        │  │ - window.location.hash              │    │
        │  │ - Sets currentView state            │    │
        │  └─────────────────────────────────────┘    │
        │                                               │
        └───────┬──────────────────────────┬───────────┘
                │                          │
      ┌─────────▼─────────┐      ┌────────▼──────────┐
      │  USER PORTAL      │      │  ADMIN PORTAL     │
      │  (currentView =   │      │  (currentView =   │
      │   'store')        │      │   'admin')        │
      │                   │      │                   │
      │ ┌───────────────┐ │      │ ┌───────────────┐ │
      │ │ E-commerce UI │ │      │ │ Admin UI      │ │
      │ │  - Navbar     │ │      │ │  - Sidebar    │ │
      │ │  - Products   │ │      │ │  - Dashboard  │ │
      │ │  - Cart       │ │      │ │  - Analytics  │ │
      │ │  - Checkout   │ │      │ │  - Inventory  │ │
      │ │  - Account    │ │      │ │  - System     │ │
      │ └───────────────┘ │      │ │    Status     │ │
      │                   │      │ └───────────────┘ │
      │ ROUTES:           │      │ ROUTES:           │
      │ • /               │      │ • /admin          │
      │ • /account        │      │ • #admin          │
      │ • /store          │      │                   │
      │                   │      │                   │
      └─────────┬─────────┘      └──────────┬────────┘
                │                           │
      ┌─────────▼──────────┐    ┌───────────▼──────┐
      │   User Actions     │    │ Admin Actions    │
      │ • Browse products  │    │ • Add products   │
      │ • Search/filter    │    │ • Manage stock   │
      │ • Add to cart      │    │ • View orders    │
      │ • Checkout         │    │ • View analytics │
      │ • Place order      │    │ • Manage users   │
      │ • Track order      │    │ • Create coupons │
      │ • Login optional   │    │ • Login required │
      │ • LOGOUT -> /      │    │ • LOGOUT -> /adm │
      │   (homepage)       │    │   (admin login)  │
      └────────────────────┘    └──────────────────┘
```

## 🔄 Application Flow - Request Routing

```
                    USER VISIT SITE
                         │
                         ▼
                   URL CHECK (App.jsx)
                    /
                   /   \
                  /     \
              /admin    other
               │         │
        ADMIN   │         │
       PORTAL   │    USER
                │    PORTAL
                │
        ┌───────▼────────┐
        │ adminAuth check │
        │ (isAuthenticated)
        │                 │
    NO  │  YES            │
        │                 │
   ┌────▼──┐          ┌──▼──┐
   │ Login │          │Panel │
   └────────┘          └─────┘
        │
    Enter Creds ──► 2FA ──► Dashboard
        │             │
        └─────────────┴──► Admin Functions
                          
                          
       USER PORTAL FLOW
       ┌─────────────┐
       │ Homepage    │◄──────┐
       │ Products    │       │
       │ Navbar      │       │
       └──────┬──────┘       │
              │              │
    ┌─────────▼──────────┐   │
    │ User Interaction   │   │
    │ - Browse           │   │
    │ - Search           │   │
    │ - Add to Cart      │   │
    │ - Checkout         │   │
    │ - Account          │   │
    └─────────┬──────────┘   │
              │              │
         ┌────▼────┐     ┌───▼────┐
         │ Logout  │─────│ Home   │
         │ Button  │     │ Page   │
         └─────────┘     └────────┘
```

## 🗂️ File Structure - Portal Separation

```
src/
├── App.jsx                          (Main routing logic)
│   ├── useEffect (URL detection)
│   ├── Route to USER PORTAL
│   └── Route to ADMIN PORTAL
│
├── components/
│   ├── Navbar.jsx                   (User navbar)
│   │   ├── Logo & Search
│   │   ├── Cart & Wishlist
│   │   └── User Menu
│   │       ├── My Account
│   │       ├── Admin Panel (link)
│   │       └── Sign Out ──► redirect to /
│   │
│   ├── AdminLogin.jsx               (Admin login page)
│   │   ├── Email input
│   │   ├── Password input
│   │   ├── 2FA verification
│   │   ├── Login button
│   │   └── Return to Store button
│   │
│   ├── AdminPanel.jsx               (Admin dashboard)
│   │   ├── Sidebar navigation
│   │   ├── Dashboard tab
│   │   ├── Product Management
│   │   ├── Inventory
│   │   ├── Sales Analytics
│   │   ├── Orders
│   │   ├── Customers
│   │   ├── Coupons
│   │   ├── Reviews
│   │   ├── System Status
│   │   ├── 2FA Settings
│   │   ├── Admin Menu
│   │   │   ├── Profile
│   │   │   ├── Settings
│   │   │   └── Logout ──► redirect to /admin (login)
│   │   │
│   │   └── Mobile responsive
│   │
│   ├── CustomerAuthModal.jsx        (User login modal)
│   ├── AccountView.jsx              (User account page)
│   ├── ProductCard.jsx              (Product display)
│   ├── CartDrawer.jsx               (Shopping cart)
│   ├── CheckoutModal.jsx            (Payment)
│   ├── OrderTrackingModal.jsx       (Order status)
│   └── ... (other user components)
│
└── context/
    └── ShopContext.jsx              (Global state)
        ├── currentView state
        ├── adminAuth state
        ├── user state
        ├── products state
        ├── orders state
        ├── coupons state
        └── ... (other states)
```

## 🔐 Authentication Flow

### User Portal - Optional Login

```
┌──────────────────────────────────────────┐
│         USER VISITS STORE                │
├──────────────────────────────────────────┤
│                                          │
│  ┌───────────────────┐                   │
│  │ Browse as Guest   │ ──────────┐       │
│  └───────────────────┘           │       │
│                                  │       │
│           OR                     │       │
│                                  │       │
│  ┌───────────────────┐           │       │
│  │ Login (optional)  │ ──┐       │       │
│  └───────────────────┘   │       │       │
│                          │       │       │
│         → Checkout       │       │       │
│         → Place Order    │       │       │
│         → Track Order    ├───────▼─────┐ │
│         → Account View   │             │ │
│         → Edit Profile   │  FULL ACCESS│ │
│         → Add Address    │             │ │
│         → Wishlist       └─────────────┘ │
│                                          │
│  ┌───────────────────────────────────┐  │
│  │ LOGOUT                            │  │
│  │ ┌─────────────────────────────────┤  │
│  │ │ ✅ Redirect to HOME PAGE (/)    │  │
│  │ │ ✅ User state cleared           │  │
│  │ │ ✅ Auth token removed           │  │
│  │ │ ✅ Can browse as guest          │  │
│  │ │ ✅ Can login again anytime      │  │
│  │ └─────────────────────────────────┤  │
│  └───────────────────────────────────┘  │
│                                          │
└──────────────────────────────────────────┘
```

### Admin Portal - Mandatory Login

```
┌──────────────────────────────────────────┐
│    ADMIN VISITS /admin                   │
├──────────────────────────────────────────┤
│                                          │
│  ┌─────────────────────┐                 │
│  │ LOGIN PAGE          │                 │
│  ├─────────────────────┤                 │
│  │ Email input         │                 │
│  │ Password input      │                 │
│  │ Login button        │                 │
│  │ "Return to Store"   │                 │
│  └────────────┬────────┘                 │
│               │                          │
│           SUBMIT                         │
│               │                          │
│        ┌──────▼──────┐                   │
│        │ Verify Creds│                   │
│        └──────┬──────┘                   │
│               │                          │
│        ┌──────▼──────┐                   │
│        │ 2FA Required│                   │
│        ├──────────────┤                   │
│        │ Scan QR Code │ OR               │
│        │ Enter 6-digit│ OR               │
│        │ code from    │ Use Recovery     │
│        │ Authenticator│ Code             │
│        │ (TOTP)       │                   │
│        └──────┬──────┘                   │
│               │                          │
│      ┌────────▼────────┐                 │
│      │ ADMIN DASHBOARD │                 │
│      ├─────────────────┤                 │
│      │ Full Admin      │                 │
│      │ Access to all   │                 │
│      │ features        │                 │
│      └────────┬────────┘                 │
│              │                           │
│     ┌────────▼────────┐                  │
│     │ LOGOUT          │                  │
│     ├─────────────────┤                  │
│     │ ✅ Redirect to  │                  │
│     │    /admin login │                  │
│     │ ✅ Session      │                  │
│     │    cleared      │                  │
│     │ ✅ Must re-login│                  │
│     │    to access    │                  │
│     └─────────────────┘                  │
│                                          │
└──────────────────────────────────────────┘
```

## 🌐 URL Routing Map

```
ENTRY POINT: https://e-commerce-virid-delta.vercel.app/

┌─ / or /store or empty ────────────────────┐
│                                           │
│  ✅ User Portal                           │
│  • Homepage with products                 │
│  • Search & browse                        │
│  • Optional login                         │
│  • Navbar with user menu                  │
│                                           │
└───────────────────────────────────────────┘

┌─ /account ────────────────────────────────┐
│                                           │
│  👤 User Account Page                     │
│  • Orders & tracking                      │
│  • Addresses                              │
│  • Wishlist                               │
│  • Profile settings                       │
│  (Protected - requires user login)        │
│                                           │
└───────────────────────────────────────────┘

┌─ /admin or /#admin ───────────────────────┐
│                                           │
│  🛡️ Admin Portal                          │
│  • Admin login page                       │
│  • Admin dashboard (if authenticated)     │
│  • All admin features                     │
│  (Protected - requires admin login)       │
│                                           │
└───────────────────────────────────────────┘

┌─ Any other route ─────────────────────────┐
│                                           │
│  ↪️ Redirects to / (User Portal)          │
│                                           │
└───────────────────────────────────────────┘
```

## 🎯 State Management Flow

```
ShopContext.jsx
│
├─ currentView: string
│  ├─ 'store'   → User portal
│  ├─ 'admin'   → Admin portal
│  └─ 'account' → User account
│
├─ adminAuth: object
│  ├─ isAuthenticated: boolean
│  ├─ user: admin data
│  ├─ passwordHash: hashed password
│  ├─ is2FAEnabled: boolean
│  ├─ twoFactorSecret: encryption key
│  └─ backupCodes: recovery codes
│
├─ user: object (customer)
│  ├─ id: user ID
│  ├─ name: customer name
│  ├─ email: email
│  ├─ phone: phone number
│  ├─ addresses: array
│  ├─ isLoggedIn: boolean
│  └─ preferences: object
│
├─ products: array
│ ├─ inventory data
│  └─ search cache
│
├─ orders: array
│  └─ order history
│
├─ cart: array
│  └─ cart items
│
├─ coupons: array
│  └─ coupon codes
│
└─ ... other states
```

## 🔗 Component Communication

```
App.jsx (Router)
│
├────────────► Navbar
│              │
│              ├────► User Menu
│              │      ├─ My Account (→ AccountView)
│              │      ├─ Admin Panel (→ AdminLogin/AdminPanel)
│              │      └─ Sign Out (→ redirect to /)
│              │
│              └─ Search
│                 └─► Product List
│
├────────────► User Portal (store)
│              │
│              ├─► ProductCard
│              ├─► CartDrawer
│              ├─► CheckoutModal
│              ├─► OrderTrackingModal
│              └─► AccountView
│
└────────────► Admin Portal
               │
               ├─► AdminLogin (if not authenticated)
               │
               └─► AdminPanel
                  ├─► AdminDashboard
                  ├─► AdminInventoryStock
                  ├─► AdminSalesAnalytics
                  ├─► AdminSystemStatus
                  ├─► Admin2FASettings
                  └─► [other admin components]
```

## 📊 Data Flow - Logout Sequence

```
USER LOGOUT                     ADMIN LOGOUT
    │                               │
    ├─ Click "Sign Out"            ├─ Click "Logout"
    │                              │
    ├─ setUser(guest)              ├─ setAdminAuth(null)
    │                              │
    ├─ Clear localStorage           ├─ Clear admin tokens
    │  • cartverse_token           │
    │  • aura_user                 │
    │                              │
    ├─ setCurrentView('store')      ├─ setCurrentView('admin')
    │                              │
    ├─ Redirect to / ◄─────────────┴─ Redirect to /admin
    │  (User can browse             (Admin must login)
    │   as guest OR login)          
    │                              
    ▼                              ▼
  HOME PAGE                    ADMIN LOGIN
  ├─ See products              ├─ Email field
  ├─ Can add to cart           ├─ Password field
  ├─ Can checkout              ├─ 2FA verification
  └─ Can login again           └─ Can return to store
```

---

## 🎪 Key Differences

| Aspect | User Portal | Admin Portal |
|--------|-------------|--------------|
| **Location** | `/` (root) | `/admin` |
| **Purpose** | Shopping | Management |
| **Login** | Optional | Mandatory |
| **Access** | Public | Restricted |
| **Logout Redirects To** | `/` (home) | `/admin` (login) |
| **2FA** | No | Yes |
| **Mobile UI** | E-commerce | Dashboard |
| **Default Role** | Customer | Admin |

---

**Generated:** August 25, 2026
**Status:** Production Ready ✅
