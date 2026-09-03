# Supabase Server Authentication Usage Guide

## Overview

The `supabaseAuth.js` module provides server-side JWT verification and authentication helpers using the `@supabase/server` package. This enables secure token verification on your Express backend.

---

## Installation & Setup

### Already Done ✅
- `@supabase/server@1.5.2` installed
- Environment variables configured:
  - `SUPABASE_URL`
  - `SUPABASE_SECRET_KEY`
  - `SUPABASE_JWKS_URL`

### Import the Module

```javascript
const {
  authMiddleware,
  optionalAuthMiddleware,
  adminMiddleware,
  verifyToken,
  getUserFromToken,
  supabase
} = require('./lib/supabaseAuth');
```

---

## API Reference

### 1. `verifyToken(token)`

Verify a JWT token and return user information.

**Parameters:**
- `token` (string) - JWT token from Authorization header

**Returns:**
```javascript
{
  user: { id, email, user_metadata, ... } | null,
  error: { message } | null
}
```

**Example:**
```javascript
const { user, error } = await verifyToken(token);

if (error) {
  console.log('Token invalid:', error.message);
} else {
  console.log('User verified:', user.email);
}
```

---

### 2. `authMiddleware` (Express Middleware)

Protect routes - requires valid JWT token. Attaches `req.user` to request.

**Usage:**
```javascript
router.get('/protected-route', authMiddleware, (req, res) => {
  const userId = req.userId;
  const user = req.user;
  
  res.json({ message: 'Access granted', user });
});
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "No authorization header provided"
}
```

---

### 3. `optionalAuthMiddleware` (Express Middleware)

Optional authentication - does not block if token is missing. Attaches `req.user` if token is valid.

**Usage:**
```javascript
router.get('/public-route', optionalAuthMiddleware, (req, res) => {
  if (req.user) {
    res.json({ message: 'Hello authenticated user', user: req.user });
  } else {
    res.json({ message: 'Hello guest' });
  }
});
```

---

### 4. `adminMiddleware` (Express Middleware)

Admin-only protection - requires valid token AND admin role.

**Usage:**
```javascript
router.post('/admin/settings', adminMiddleware, (req, res) => {
  // Only admins reach here
  res.json({ message: 'Admin access granted' });
});
```

**Error Responses:**
- 401 - Invalid or missing token
- 403 - User not admin

---

### 5. `getUserFromToken(token)`

Get user object from token (simpler alternative to `verifyToken`).

**Usage:**
```javascript
const user = await getUserFromToken(token);

if (user) {
  console.log('User email:', user.email);
} else {
  console.log('Invalid token');
}
```

---

### 6. `refreshUserSession(refreshToken)`

Refresh user session using refresh token.

**Usage:**
```javascript
const result = await refreshUserSession(refreshToken);

if (result.success) {
  const newSession = result.data;
  // Use new session data
} else {
  console.log('Refresh failed:', result.error);
}
```

---

### 7. `signOutUser(token)`

Sign out user (invalidate token).

**Usage:**
```javascript
const result = await signOutUser(token);

if (result.success) {
  res.json({ message: 'Signed out successfully' });
} else {
  res.json({ error: result.error });
}
```

---

## Integration Examples

### Example 1: Protect a Route

**Before (using custom JWT):**
```javascript
router.get('/my-orders', customJwtVerify, (req, res) => {
  // Your code
});
```

**After (using Supabase):**
```javascript
const { authMiddleware } = require('./lib/supabaseAuth');

router.get('/my-orders', authMiddleware, (req, res) => {
  const userId = req.userId;
  // Your code
});
```

---

### Example 2: Custom JWT Verification in Route Handler

```javascript
const { verifyToken } = require('./lib/supabaseAuth');

router.post('/custom-endpoint', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  const { user, error } = await verifyToken(token);
  
  if (error) {
    return res.status(401).json({ error: error.message });
  }
  
  // Use user object
  res.json({ message: 'Success', userId: user.id });
});
```

---

### Example 3: Optional Authentication

```javascript
const { optionalAuthMiddleware } = require('./lib/supabaseAuth');

router.get('/posts', optionalAuthMiddleware, (req, res) => {
  let response = {
    posts: getAllPosts(),
    authenticated: !!req.user
  };
  
  if (req.user) {
    response.userPosts = getUserPosts(req.userId);
  }
  
  res.json(response);
});
```

---

### Example 4: Admin-Only Route

```javascript
const { adminMiddleware } = require('./lib/supabaseAuth');

router.post('/admin/create-user', adminMiddleware, (req, res) => {
  // Only admins can reach here
  const newUser = createUser(req.body);
  res.json({ success: true, user: newUser });
});
```

---

## Migration from Custom JWT to Supabase

### Step 1: Replace Auth Routes

**Old:**
```javascript
import { protect, adminOnly } from '../middleware/auth.js';

router.put('/profile', protect, updateCustomerProfile);
```

**New:**
```javascript
const { authMiddleware, adminMiddleware } = require('../lib/supabaseAuth');

router.put('/profile', authMiddleware, updateCustomerProfile);
router.post('/admin/update', adminMiddleware, updateAdminProfile);
```

### Step 2: Update Middleware Usage

In `server.js`:
```javascript
// Old
app.use('/api', customJwtVerify);

// New - Use route-level instead
app.use('/api/auth', authRoutes); // authRoutes already has middleware
```

### Step 3: Update Controllers

In `authController.js`:
```javascript
// Now req.user is automatically verified by Supabase middleware
export const getUserStats = (req, res) => {
  const userId = req.userId; // Set by authMiddleware
  // Your code
};
```

---

## Environment Variables

Ensure these are set:

```bash
SUPABASE_URL=https://yjzkfwyattiibfgnngiv.supabase.co
SUPABASE_SECRET_KEY=sb_secret_5SRCm••••••••••••••••••••
SUPABASE_PUBLISHABLE_KEY=sb_publishable_V5utEsNAETLWJvXXQBFXCw_oJ3zdY99
SUPABASE_JWKS_URL=https://yjzkfwyattiibfgnngiv.supabase.co/auth/v1/.well-known/jwks.json
```

---

## Error Handling

### Common Errors

**"No token provided"**
- Cause: Missing Authorization header
- Fix: Client must send: `Authorization: Bearer <token>`

**"Token verification failed"**
- Cause: Invalid or expired token
- Fix: User should login again to get fresh token

**"Admin access required"**
- Cause: User doesn't have admin role
- Fix: Use different route or upgrade user role in Supabase

---

## Security Best Practices

✅ **DO:**
- Always use `authMiddleware` for sensitive routes
- Check `req.userId` in controllers
- Store tokens securely on client side
- Use HTTPS in production
- Keep `SUPABASE_SECRET_KEY` private

❌ **DON'T:**
- Expose `SUPABASE_SECRET_KEY` in frontend code
- Skip token verification for "internal" routes
- Trust tokens without verifying them
- Commit secrets to git

---

## Testing

### Test Protected Route

```bash
# Get token first (from login response)
TOKEN="eyJhbGc..."

# Test with valid token
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/auth/profile

# Test without token (should fail)
curl http://localhost:5000/api/auth/profile
```

---

## Troubleshooting

### Issue: "SUPABASE_SECRET_KEY is undefined"

**Solution:**
1. Check `.env` file has `SUPABASE_SECRET_KEY`
2. Restart your server
3. Verify key is not commented out

### Issue: "Token verification failed" on valid token

**Solution:**
1. Token may be expired
2. Check token format: should be `Bearer <token>`
3. Verify token wasn't corrupted in transit

### Issue: Admin middleware always rejects

**Solution:**
1. Check user's Supabase Auth role/metadata
2. User role must be 'admin' in user_metadata
3. Set in Supabase dashboard or via API

---

## Next Steps

1. ✅ Import `supabaseAuth.js` in your routes
2. ✅ Replace old auth middleware with Supabase middleware
3. ✅ Update controllers to use `req.userId`
4. ✅ Test each protected route
5. ✅ Deploy to production

---

## Support

For issues:
1. Check environment variables
2. Verify token format in Authorization header
3. Check Supabase dashboard for user/role settings
4. Review Supabase Auth documentation

---

**File Location:** `server/lib/supabaseAuth.js`  
**Last Updated:** September 2, 2026  
**Status:** ✅ Ready for Production
