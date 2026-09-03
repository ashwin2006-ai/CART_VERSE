# Shopping Cart Testing Checklist

## Test Environment
- **URL:** https://e-commerce-virid-delta.vercel.app/
- **Browser:** Any modern browser (Chrome, Firefox, Safari, Edge)
- **Test Date:** September 2, 2026

## Test Cases

### 1. Add to Cart - Basic Functionality
- [ ] Navigate to product page
- [ ] Click "Add to Cart" button on a product
- [ ] Verify product appears in cart
- [ ] Verify quantity is 1
- [ ] Check cart icon shows updated count

**Expected Result:** Product added successfully, cart count incremented

---

### 2. Cart Drawer Opening
- [ ] Click on cart icon in navbar
- [ ] Verify CartDrawer slides in from right
- [ ] Verify "Shopping Bag" header displays with item count
- [ ] Check free shipping progress bar is visible

**Expected Result:** Cart drawer opens smoothly with all elements visible

---

### 3. Quantity Management
- [ ] In cart, find an item
- [ ] Click "+" button to increase quantity
- [ ] Verify quantity increases
- [ ] Click "-" button to decrease quantity
- [ ] Verify quantity decreases
- [ ] Total price updates correctly

**Expected Result:** Quantity controls work, totals recalculate

---

### 4. Remove from Cart
- [ ] Click trash icon on a cart item
- [ ] Verify item is removed
- [ ] Verify cart count decreases
- [ ] Check totals update

**Expected Result:** Item removed, cart updated

---

### 5. Wishlist Integration
- [ ] Click heart icon on cart item
- [ ] Verify item is moved to wishlist
- [ ] Verify item is removed from cart

**Expected Result:** Item successfully moved to wishlist

---

### 6. Coupon Application
- [ ] Enter valid coupon code "SAVE20" in coupon field
- [ ] Click Apply
- [ ] Verify coupon is applied (should show green badge)
- [ ] Verify discount is calculated in totals
- [ ] Try applying another coupon
- [ ] Verify only one coupon is active

**Expected Result:** Coupon system works, discounts calculated correctly

---

### 7. Free Shipping Threshold
- [ ] Add products until subtotal < ₹999
- [ ] Verify shipping fee shows as ₹99
- [ ] Verify "Add ₹X for FREE Delivery" message
- [ ] Add more products until subtotal >= ₹999
- [ ] Verify shipping becomes FREE
- [ ] Check progress bar reaches 100%

**Expected Result:** Free shipping threshold works at ₹999

---

### 8. Price Calculations
- [ ] Verify subtotal is correct (price × quantity for all items)
- [ ] Verify GST is calculated as 18%
- [ ] Verify total = subtotal - discount + shipping + GST
- [ ] Check prices are in INR format with proper locale

**Expected Result:** All price calculations are accurate

---

### 9. Checkout Flow
- [ ] Click "Proceed to Checkout" button
- [ ] Verify checkout modal opens
- [ ] Verify Step 1 (Address) is shown
- [ ] Fill address form with valid data
- [ ] Click "Continue to Shipping"
- [ ] Verify Step 2 (Shipping Speed) shows options
- [ ] Select shipping option
- [ ] Click "Continue to Payment"
- [ ] Verify Step 3 (Payment) is visible

**Expected Result:** Checkout flow progresses through steps

---

### 10. Empty Cart Behavior
- [ ] Clear all items from cart
- [ ] Verify "Your Bag is Empty" message displays
- [ ] Verify "Start Shopping Now" button is available
- [ ] Click to close cart and return to shopping

**Expected Result:** Empty state UI displays correctly

---

### 11. Authentication Guard
- [ ] Add items to cart
- [ ] Click "Proceed to Checkout" without being logged in
- [ ] Verify authentication prompt appears
- [ ] Verify "Sign In / Register" button is available

**Expected Result:** Auth guard prevents checkout without login

---

### 12. Responsive Design (Mobile)
- [ ] Open on mobile device or use browser DevTools
- [ ] Verify cart drawer is full width
- [ ] Verify all buttons are tap-friendly (min 44px)
- [ ] Verify text is readable without horizontal scrolling
- [ ] Verify forms are usable on mobile

**Expected Result:** Cart is responsive and mobile-friendly

---

## Summary
- **Total Test Cases:** 12
- **Critical Tests:** 1, 2, 3, 4, 6, 9
- **Pass Criteria:** All critical tests must pass

## Notes
- Check browser console for any errors (F12 → Console)
- Test on different browsers if possible
- Test on mobile and desktop
- Verify localStorage is saving cart data (F12 → Application → Local Storage)
