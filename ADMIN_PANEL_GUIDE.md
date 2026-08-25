# CARTVERSE Admin Panel - Complete Management Guide

## 🔐 Access & Login

### Admin Portal URL
- **Production**: https://e-commerce-virid-delta.vercel.app/ → Click "Merchant Portal" in footer
- **Local Dev**: http://localhost:3000/ → Click "Merchant Portal" in footer

### Demo Credentials
```
Email: admin@cartverse.io
Password: Admin@2026!
2FA Token: 884-291
```

**Note:** Credentials are pre-filled in the login form. Click "Auto Fill" button to populate them.

---

## 📊 Admin Dashboard Overview

### 1. **Dashboard Tab** (Home)
The main overview providing real-time KPI metrics:

#### Key Performance Indicators (KPIs)
- **Total Revenue**: Aggregated sales across all orders
  - Shows trend percentage (↑/↓) for current period
  - Example: ₹12.5L with 12.5% growth

- **Total Orders**: Complete count of all orders placed
  - Shows monthly change percentage
  - Example: 425 orders with 8.2% growth

- **Total Products**: Inventory count across all categories
  - Shows new product additions percentage
  - Example: 1,200 products with 5.1% growth

- **Registered Users**: Total customer accounts
  - Shows registration growth percentage
  - Example: 3,450 users with 15.3% growth

#### Secondary Metrics
- **Avg Order Value**: Average revenue per order (₹value)
- **Conversion Rate**: % of users who converted to orders
- **Active Cart Items**: Current items in all customer carts

#### Alerts & Warnings
- **Low Stock Alert** (Yellow/Amber)
  - Shows number of products with stock ≤ 5 units
  - Click to navigate to Inventory Management

- **Out of Stock Alert** (Red)
  - Shows number of products with 0 stock
  - Critical items requiring immediate restock

#### Data Tables

**Recent Orders Table:**
| Order ID | Customer | Amount | Status |
|----------|----------|--------|--------|
| #A7F23B | John Doe | ₹2,450 | Confirmed |

**Top Selling Products Table:**
| Product | Sales | Stock | Price |
|---------|-------|-------|-------|
| iPhone 15 | 245 | 12 | ₹79,999 |

**Category Distribution:**
- Visual progress bars showing product count per category
- Percentage breakdown of inventory
- Example: Electronics 35%, Fashion 28%, Home 20%, etc.

#### Time Range Filter
Select data period:
- **Week**: Last 7 days
- **Month**: Last 30 days
- **Quarter**: Last 90 days
- **All Time**: Complete historical data

---

## 📦 Product Management

### Add New Product
1. Click **"+ Add New Product"** button
2. Fill in product details:
   - **Name**: Product title (max 100 chars)
   - **Category**: Select from dropdown (electronics, fashion, etc.)
   - **Price**: Selling price in INR
   - **Original Price**: Original/MRP (for discount calculation)
   - **Discount**: % off (auto-calculated or manual)
   - **Stock**: Number of units available
   - **Description**: Detailed product info
   - **Images**: Product images (URLs)
   - **Flags**: Featured, Best Seller, New Product checkboxes

3. Click **"Save Product"** to create

### Edit Product
1. Find product in Product Listings table
2. Click **Edit icon** (pencil) on the right
3. Update details in modal
4. Click **"Update Product"**

### Delete Product
1. Click **Delete icon** (trash) on product row
2. Confirm deletion (this is permanent)

### Product Table Features
- **Search**: Filter by product name or ID
- **Sort**: By price, rating, newest
- **Status Badges**: Featured, Best Seller, New, Discount %
- **Stock Color Coding**:
  - 🟢 Green: In stock
  - 🟡 Yellow: Low stock (≤5)
  - 🔴 Red: Out of stock

---

## 🏷️ Category Management

### Add Category
1. Click **"+ Add Category"** button
2. Enter category name (e.g., "Audio Accessories")
3. Select icon (for UI display)
4. Click **"Create Category"**

### Category Dashboard
Each category shows:
- Category name
- Product count
- Delete button (if not "All")
- Quick stats

### View by Category
Click on any category card to:
- See all products in that category
- Manage category-specific inventory
- View category performance

---

## 📦 Inventory & Stock Management

### Stock Alerts
The system flags:
- **Low Stock** (Amber): 1-5 units
- **Out of Stock** (Red): 0 units

### Update Inventory
1. Go to **Inventory & Stock** tab
2. Click on product to edit
3. Update stock quantity
4. Set reorder level (auto-alert when below)
5. Save changes

### Bulk Actions
- Adjust multiple products at once
- Set all products in category to same stock
- Mark items for restock

---

## 🛒 Order Management

### View All Orders
**Columns:**
| Order ID | Customer | Amount | Status | Date | Action |
|----------|----------|--------|--------|------|--------|
| #F2E8C1 | Jane Smith | ₹5,890 | Shipped | Aug 25 | View/Edit |

### Order Statuses
- **Pending**: Awaiting payment confirmation
- **Confirmed**: Payment received, processing
- **Shipped**: In transit to customer
- **Delivered**: Received by customer
- **Cancelled**: Order cancelled
- **Returned**: Item returned by customer

### Update Order Status
1. Click order ID to view details
2. Click **"Update Status"** button
3. Select new status
4. Add note (optional)
5. Save

### View Order Details
Click any order row to see:
- Customer information
- Shipping address
- Items ordered (product name, qty, price)
- Payment method
- Order timeline
- Tracking info (if shipped)

---

## 👥 Customer Management

### View All Customers
**Information Displayed:**
- Customer name
- Email address
- Phone number
- Total orders placed
- Total spending
- Join date
- Membership tier

### Customer Actions
- **View Profile**: See customer history
- **Send Message**: Email notification
- **View Orders**: All orders from this customer
- **Add Reward Points**: Manual point adjustment

### Customer Filters
- By registration date
- By spending (high value, frequent, etc.)
- By status (active, inactive, blocked)
- By tier (Standard, Silver, Gold, Platinum)

---

## 🎟️ Coupons & Offers

### Create Coupon
1. Click **"+ Add Coupon"** button
2. Fill coupon details:
   - **Code**: Unique coupon code (e.g., "SAVE20")
   - **Type**: Percentage or Fixed Amount
   - **Discount**: Amount or % off
   - **Min Spend**: Minimum cart value required
   - **Valid From/To**: Date range
   - **Usage Limit**: Max number of uses
   - **Description**: Customer-facing text

3. Click **"Create Coupon"**

### Active Coupons
- Shows currently active promotions
- Usage count
- Expiration date
- Edit/Delete buttons

### Disable Coupon
- Click **"Disable"** to temporarily pause
- Reactivate anytime
- Or **Delete** to remove permanently

---

## ⭐ Reviews Management

### View All Reviews
**Display:**
- Product name
- Customer name
- Rating (1-5 stars)
- Review text
- Date posted
- Status (Approved, Flagged, Reported)

### Review Actions
- **Approve**: Make review visible to others
- **Flag**: Mark for inappropriate content
- **Delete**: Remove review
- **Reply**: Admin response to review

### Reply to Review
1. Click **"Reply"** button on review
2. Type admin response
3. Click **"Post Reply"**
4. Reply appears below customer review

### Monitor Reviews
- Filter by rating (5★, 4★, 3★, etc.)
- Sort by date (newest first)
- Search by product name or customer

---

## 🔄 Returns & Refunds

### Pending Returns
- Shows customers who requested returns
- Reason for return
- Product and order details
- Return deadline

### Process Return
1. Click return request
2. Review return reason
3. Approve or reject
4. If approved: Generate return label
5. Update refund status
6. Process refund (marks item as received)

### Refund Status Tracking
- Pending
- Approved
- In Transit (item to warehouse)
- Received
- Refunded
- Rejected

---

## ⚡ Flipkart API Integration

### Setup Flipkart Affiliate
1. Go to **Flipkart API Hub** tab
2. Enter Flipkart credentials:
   - **Affiliate ID**: Your Flipkart associate ID
   - **Affiliate Token**: API access token
3. Click **"Save Credentials"**

### Sync Products
1. Select category to sync
2. Enter search keywords (optional)
3. Click **"Sync from Flipkart"**
4. System imports products automatically

### Tracking
- Shows sync status
- Last sync date/time
- Import count
- Error logs

---

## 🔒 Security & Profile

### Change Admin Password
1. Go to **Profile & Security** tab
2. Click **"Change Password"**
3. Enter current password
4. Enter new password (8+ chars, mixed case, numbers)
5. Confirm new password
6. Save

### Update Profile
1. Edit admin name, email, avatar
2. Update phone number
3. Set notification preferences
4. Save changes

### Security Settings
- **2FA**: Two-factor authentication status
- **Login History**: View recent admin logins
- **Session Management**: Terminate active sessions
- **API Keys**: Generate/revoke API access tokens

### Audit Log
- Track all admin actions
- Timestamp for each action
- User who performed action
- Changes made

---

## 📈 Analytics & Reports

### Sales Analytics
- Daily/weekly/monthly revenue charts
- Order trends
- Top products by sales
- Top customers by spending

### Customer Analytics
- New customer count
- Repeat purchase rate
- Customer retention
- Average customer lifetime value

### Inventory Analytics
- Stock turnover rate
- Low-stock items
- Seasonal trends
- Category performance

### Export Reports
- Download as CSV/PDF
- Email reports to stakeholders
- Schedule automated reports

---

## 🎨 Customization

### Branding
- Update store name
- Change logo
- Set primary colors
- Customize email templates

### Settings
- Tax rate configuration
- Shipping settings
- Payment gateway settings
- Email notification rules

### SEO
- Meta titles and descriptions
- URL structure
- Sitemap settings

---

## 🔗 Quick Navigation

| Feature | Path | Icon |
|---------|------|------|
| Dashboard | Home | 📊 |
| Products | Product Management | 📦 |
| Categories | Category Management | 🏷️ |
| Inventory | Inventory & Stock | 📚 |
| Orders | Order Management | 🛒 |
| Customers | Customer Management | 👥 |
| Coupons | Coupons & Offers | 🎟️ |
| Reviews | Reviews Management | ⭐ |
| Returns | Return & Refunds | 🔄 |
| Flipkart | Flipkart API Hub | ⚡ |
| Security | Profile & Security | 🔒 |

---

## 💡 Tips & Best Practices

### Product Management
- ✅ Use descriptive names (affects SEO)
- ✅ Add high-quality product images
- ✅ Set accurate stock levels
- ✅ Use relevant categories
- ✅ Mark featured/new products strategically

### Inventory
- ✅ Set low-stock alerts to 10% of average daily sales
- ✅ Review inventory weekly
- ✅ Plan restocks based on trends
- ✅ Archive discontinued products

### Orders
- ✅ Process orders within 24 hours
- ✅ Send tracking info immediately
- ✅ Respond to customer inquiries within 24 hours
- ✅ Monitor payment failures

### Promotions
- ✅ Create seasonal coupons
- ✅ Use time-limited offers for urgency
- ✅ Monitor coupon usage
- ✅ Test discount impact on revenue

### Customer Service
- ✅ Respond to reviews promptly
- ✅ Address negative reviews professionally
- ✅ Process returns quickly
- ✅ Follow up with new customers

---

## 🆘 Troubleshooting

### Common Issues

**Products not appearing:**
- Check product status (active/inactive)
- Verify category is correct
- Ensure images URL is valid

**Orders not syncing:**
- Check payment gateway connection
- Verify order confirmation email sent
- Check database connection

**Stock discrepancies:**
- Reconcile inventory weekly
- Check for system errors
- Manual adjustment if needed

### Support
For technical issues:
- Email: ashwincreator@gmail.com
- Response time: 2-4 hours

---

## 📞 Admin Support

- **Email**: admin@cartverse.io
- **Telegram**: [@CartverseAdmin](https://t.me/cartverse_admin)
- **Phone**: +91-XXXX-XXXX
- **Knowledge Base**: https://docs.cartverse.io

---

**Last Updated**: August 25, 2026
**Version**: 1.0
**Status**: Production Ready

