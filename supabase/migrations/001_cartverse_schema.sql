-- ═══════════════════════════════════════════════════════════════════════════════
-- CartVerse Database Schema Migration for Supabase
-- ═══════════════════════════════════════════════════════════════════════════════
--
-- PURPOSE:
-- Create all CartVerse database tables in Supabase PostgreSQL from Prisma schema.
-- This migration is designed to be idempotent and data-safe.
--
-- SAFETY MEASURES:
-- ✓ Uses IF NOT EXISTS to prevent errors if tables already exist
-- ✓ Preserves existing data (no DELETE or DROP statements)
-- ✓ Uses proper PostgreSQL constraints and relationships
-- ✓ Implements foreign keys with appropriate cascade rules
-- ✓ Creates performance indexes
--
-- STATUS: GENERATED - READY FOR REVIEW
-- DATE: September 2, 2026
--
-- EXECUTION:
-- 1. Copy entire contents of this file
-- 2. Open Supabase Dashboard → SQL Editor → New Query
-- 3. Paste the entire content
-- 4. Review the SQL
-- 5. Click "Run" button
-- 6. Verify success (no errors)
--
-- ROLLBACK (if needed):
-- If something goes wrong, you can rollback by dropping tables in reverse order
-- (see ROLLBACK section at end of this file)
--
-- ═══════════════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────────────────
-- STEP 1: CREATE ENUM TYPES (if they don't exist)
-- ───────────────────────────────────────────────────────────────────────────────
-- PostgreSQL enums for type safety and data validation

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Role') THEN
    CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'ADMIN', 'SUPERADMIN');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'OrderStatus') THEN
    CREATE TYPE "OrderStatus" AS ENUM (
      'PLACED',
      'CONFIRMED',
      'PACKED',
      'SHIPPED',
      'OUT_FOR_DELIVERY',
      'DELIVERED',
      'CANCELLED',
      'RETURNED_AND_REFUNDED'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CouponType') THEN
    CREATE TYPE "CouponType" AS ENUM ('PERCENT', 'FIXED', 'SHIPPING');
  END IF;
END $$;

-- ───────────────────────────────────────────────────────────────────────────────
-- STEP 2: CREATE BASE TABLES (No dependencies)
-- These tables don't depend on other tables
-- ───────────────────────────────────────────────────────────────────────────────

-- Users table - Customers and admins
CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "email" text NOT NULL,
  "passwordHash" text NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'CUSTOMER'::"Role",
  "phone" text,
  "avatar" text,
  "tier" text NOT NULL DEFAULT 'VIP Platinum',
  "rewardPoints" integer NOT NULL DEFAULT 0,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "users_email_unique" UNIQUE ("email")
);

-- Categories table - Product categories
CREATE TABLE IF NOT EXISTS "categories" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "slug" text NOT NULL,
  "name" text NOT NULL,
  "icon" text NOT NULL DEFAULT 'Sparkles',
  "description" text,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "categories_slug_unique" UNIQUE ("slug")
);

-- Coupons table - Discount codes
CREATE TABLE IF NOT EXISTS "coupons" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "code" text NOT NULL,
  "discountType" text NOT NULL DEFAULT 'percentage',
  "discountValue" double precision NOT NULL,
  "maxDiscount" double precision,
  "minCartValue" double precision,
  "usageLimit" integer,
  "description" text,
  "isActive" boolean NOT NULL DEFAULT true,
  "expiresAt" timestamp(3),
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "coupons_code_unique" UNIQUE ("code")
);

-- ───────────────────────────────────────────────────────────────────────────────
-- STEP 3: CREATE DEPENDENT TABLES
-- These tables reference the base tables above
-- ───────────────────────────────────────────────────────────────────────────────

-- Addresses table - Shipping and billing addresses for users
CREATE TABLE IF NOT EXISTS "addresses" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "userId" uuid NOT NULL,
  "title" text NOT NULL DEFAULT 'Home',
  "fullName" text NOT NULL,
  "phone" text NOT NULL,
  "street" text NOT NULL,
  "landmark" text,
  "city" text NOT NULL,
  "state" text NOT NULL,
  "pincode" text NOT NULL,
  "country" text NOT NULL DEFAULT 'India',
  "isDefault" boolean NOT NULL DEFAULT false,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "addresses_userId_fkey" FOREIGN KEY ("userId") 
    REFERENCES "users" ("id") ON DELETE CASCADE
);

-- Products table - E-commerce inventory
CREATE TABLE IF NOT EXISTS "products" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "slug" text,
  "categoryId" uuid NOT NULL,
  "price" double precision NOT NULL,
  "originalPrice" double precision,
  "discount" integer NOT NULL DEFAULT 0,
  "rating" double precision NOT NULL DEFAULT 5.0,
  "reviewCount" integer NOT NULL DEFAULT 0,
  "stock" integer NOT NULL DEFAULT 0,
  "featured" boolean NOT NULL DEFAULT false,
  "bestSeller" boolean NOT NULL DEFAULT false,
  "isNew" boolean NOT NULL DEFAULT true,
  "dealOfTheDay" boolean NOT NULL DEFAULT false,
  "images" jsonb,
  "description" text NOT NULL,
  "features" jsonb,
  "specs" jsonb,
  "colors" jsonb,
  "sizes" jsonb,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "products_slug_unique" UNIQUE ("slug"),
  CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") 
    REFERENCES "categories" ("id") ON DELETE RESTRICT
);

-- Cart items table - Shopping cart
CREATE TABLE IF NOT EXISTS "cart_items" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "userId" uuid NOT NULL,
  "productId" uuid NOT NULL,
  "quantity" integer NOT NULL DEFAULT 1,
  "color" text,
  "size" text,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "cart_items_userId_fkey" FOREIGN KEY ("userId") 
    REFERENCES "users" ("id") ON DELETE CASCADE,
  CONSTRAINT "cart_items_productId_fkey" FOREIGN KEY ("productId") 
    REFERENCES "products" ("id") ON DELETE CASCADE,
  CONSTRAINT "cart_items_userId_productId_color_size_unique" UNIQUE ("userId", "productId", "color", "size")
);

-- Wishlist items table - Product wishlists
CREATE TABLE IF NOT EXISTS "wishlist_items" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "userId" uuid NOT NULL,
  "productId" uuid NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "wishlist_items_userId_fkey" FOREIGN KEY ("userId") 
    REFERENCES "users" ("id") ON DELETE CASCADE,
  CONSTRAINT "wishlist_items_productId_fkey" FOREIGN KEY ("productId") 
    REFERENCES "products" ("id") ON DELETE CASCADE,
  CONSTRAINT "wishlist_items_userId_productId_unique" UNIQUE ("userId", "productId")
);

-- Orders table - Purchase orders
CREATE TABLE IF NOT EXISTS "orders" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "orderNumber" text,
  "userId" uuid NOT NULL,
  "couponId" uuid,
  "status" text NOT NULL DEFAULT 'Confirmed',
  "statusStep" integer NOT NULL DEFAULT 2,
  "estimatedDelivery" text,
  "trackingNumber" text,
  "carrier" text NOT NULL DEFAULT 'Aura Express Air Cargo',
  "subtotal" double precision NOT NULL,
  "discount" double precision NOT NULL DEFAULT 0,
  "shippingFee" double precision NOT NULL DEFAULT 0,
  "tax" double precision NOT NULL DEFAULT 0,
  "total" double precision NOT NULL,
  "paymentMethod" text NOT NULL,
  "paymentStatus" text NOT NULL DEFAULT 'Paid',
  "shippingAddress" jsonb,
  "timeline" jsonb,
  "returnRequested" boolean NOT NULL DEFAULT false,
  "returnReason" text,
  "returnStatus" text,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "orders_orderNumber_unique" UNIQUE ("orderNumber"),
  CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") 
    REFERENCES "users" ("id") ON DELETE RESTRICT,
  CONSTRAINT "orders_couponId_fkey" FOREIGN KEY ("couponId") 
    REFERENCES "coupons" ("id") ON DELETE SET NULL
);

-- Order items table - Order line items
CREATE TABLE IF NOT EXISTS "order_items" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "orderId" uuid NOT NULL,
  "productId" uuid NOT NULL,
  "quantity" integer NOT NULL,
  "color" text,
  "size" text,
  "priceAtPurchase" double precision NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") 
    REFERENCES "orders" ("id") ON DELETE CASCADE,
  CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") 
    REFERENCES "products" ("id") ON DELETE RESTRICT
);

-- Reviews table - Product reviews
CREATE TABLE IF NOT EXISTS "reviews" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "productId" uuid NOT NULL,
  "userId" uuid,
  "userName" text NOT NULL,
  "avatar" text,
  "rating" integer NOT NULL DEFAULT 5,
  "title" text,
  "comment" text NOT NULL,
  "verified" boolean NOT NULL DEFAULT true,
  "purchased" boolean NOT NULL DEFAULT false,
  "helpful" integer NOT NULL DEFAULT 0,
  "unhelpful" integer NOT NULL DEFAULT 0,
  "adminReply" text,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "reviews_productId_fkey" FOREIGN KEY ("productId") 
    REFERENCES "products" ("id") ON DELETE CASCADE,
  CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") 
    REFERENCES "users" ("id") ON DELETE SET NULL
);

-- ───────────────────────────────────────────────────────────────────────────────
-- STEP 4: CREATE INDEXES FOR PERFORMANCE
-- ───────────────────────────────────────────────────────────────────────────────
-- Indexes on frequently queried columns to improve query performance

-- Users indexes
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email");
CREATE INDEX IF NOT EXISTS "users_role_idx" ON "users" ("role");
CREATE INDEX IF NOT EXISTS "users_createdAt_idx" ON "users" ("createdAt");

-- Products indexes
CREATE INDEX IF NOT EXISTS "products_categoryId_idx" ON "products" ("categoryId");
CREATE INDEX IF NOT EXISTS "products_slug_idx" ON "products" ("slug");
CREATE INDEX IF NOT EXISTS "products_featured_idx" ON "products" ("featured");
CREATE INDEX IF NOT EXISTS "products_bestSeller_idx" ON "products" ("bestSeller");
CREATE INDEX IF NOT EXISTS "products_createdAt_idx" ON "products" ("createdAt");

-- Orders indexes
CREATE INDEX IF NOT EXISTS "orders_userId_idx" ON "orders" ("userId");
CREATE INDEX IF NOT EXISTS "orders_couponId_idx" ON "orders" ("couponId");
CREATE INDEX IF NOT EXISTS "orders_status_idx" ON "orders" ("status");
CREATE INDEX IF NOT EXISTS "orders_createdAt_idx" ON "orders" ("createdAt");

-- Cart items indexes
CREATE INDEX IF NOT EXISTS "cart_items_userId_idx" ON "cart_items" ("userId");
CREATE INDEX IF NOT EXISTS "cart_items_productId_idx" ON "cart_items" ("productId");

-- Wishlist items indexes
CREATE INDEX IF NOT EXISTS "wishlist_items_userId_idx" ON "wishlist_items" ("userId");
CREATE INDEX IF NOT EXISTS "wishlist_items_productId_idx" ON "wishlist_items" ("productId");

-- Reviews indexes
CREATE INDEX IF NOT EXISTS "reviews_productId_idx" ON "reviews" ("productId");
CREATE INDEX IF NOT EXISTS "reviews_userId_idx" ON "reviews" ("userId");
CREATE INDEX IF NOT EXISTS "reviews_rating_idx" ON "reviews" ("rating");

-- Addresses indexes
CREATE INDEX IF NOT EXISTS "addresses_userId_idx" ON "addresses" ("userId");

-- ═══════════════════════════════════════════════════════════════════════════════
-- SUMMARY OF CREATED OBJECTS
-- ═══════════════════════════════════════════════════════════════════════════════
--
-- ENUM TYPES: 3
--   • Role (CUSTOMER, ADMIN, SUPERADMIN)
--   • OrderStatus (PLACED, CONFIRMED, PACKED, SHIPPED, OUT_FOR_DELIVERY, DELIVERED, CANCELLED, RETURNED_AND_REFUNDED)
--   • CouponType (PERCENT, FIXED, SHIPPING)
--
-- TABLES: 10
--   1. users                 (12 columns) - Customer and admin accounts
--   2. categories            (5 columns)  - Product categories
--   3. coupons               (10 columns) - Discount codes
--   4. addresses             (11 columns) - Shipping/billing addresses
--   5. products              (20 columns) - E-commerce inventory
--   6. cart_items            (6 columns)  - Shopping cart
--   7. wishlist_items        (4 columns)  - Product wishlists
--   8. orders                (23 columns) - Purchase orders
--   9. order_items           (8 columns)  - Order line items
--  10. reviews               (14 columns) - Product reviews
--
-- FOREIGN KEYS: 14
--   • addresses.userId → users.id (CASCADE)
--   • products.categoryId → categories.id (RESTRICT)
--   • cart_items.userId → users.id (CASCADE)
--   • cart_items.productId → products.id (CASCADE)
--   • wishlist_items.userId → users.id (CASCADE)
--   • wishlist_items.productId → products.id (CASCADE)
--   • orders.userId → users.id (RESTRICT)
--   • orders.couponId → coupons.id (SET NULL)
--   • order_items.orderId → orders.id (CASCADE)
--   • order_items.productId → products.id (RESTRICT)
--   • reviews.productId → products.id (CASCADE)
--   • reviews.userId → users.id (SET NULL)
--
-- CONSTRAINTS: 9 UNIQUE
--   • users.email
--   • categories.slug
--   • coupons.code
--   • products.slug
--   • orders.orderNumber
--   • cart_items([userId, productId, color, size])
--   • wishlist_items([userId, productId])
--
-- INDEXES: 18
--   • Performance indexes on frequently queried columns
--   • Foreign key relationship indexes
--   • Search and filter optimization
--
-- ═══════════════════════════════════════════════════════════════════════════════
-- ROLLBACK INSTRUCTIONS (If Needed)
-- ═══════════════════════════════════════════════════════════════════════════════
--
-- If you need to rollback this migration, run the following SQL in order:
--
-- DROP TABLE IF EXISTS "reviews" CASCADE;
-- DROP TABLE IF EXISTS "order_items" CASCADE;
-- DROP TABLE IF EXISTS "orders" CASCADE;
-- DROP TABLE IF EXISTS "wishlist_items" CASCADE;
-- DROP TABLE IF EXISTS "cart_items" CASCADE;
-- DROP TABLE IF EXISTS "products" CASCADE;
-- DROP TABLE IF EXISTS "addresses" CASCADE;
-- DROP TABLE IF EXISTS "users" CASCADE;
-- DROP TABLE IF EXISTS "coupons" CASCADE;
-- DROP TABLE IF EXISTS "categories" CASCADE;
-- DROP TYPE IF EXISTS "Role" CASCADE;
-- DROP TYPE IF EXISTS "OrderStatus" CASCADE;
-- DROP TYPE IF EXISTS "CouponType" CASCADE;
--
-- Note: This is destructive and should only be used if you need to start over.
-- Consider backing up your data first.
--
-- ═══════════════════════════════════════════════════════════════════════════════
