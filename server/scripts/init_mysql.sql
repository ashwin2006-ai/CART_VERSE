-- ==========================================================
-- CARTVERSE E-COMMERCE DATABASE INITIALIZATION SCRIPT (MySQL)
-- Database Name: e_commerce
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `e_commerce` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `e_commerce`;

-- 1. USERS TABLE (Customers & Administrators with RBAC)
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `passwordHash` TEXT NOT NULL,
  `role` ENUM('CUSTOMER', 'ADMIN', 'SUPERADMIN') NOT NULL DEFAULT 'CUSTOMER',
  `phone` VARCHAR(25) NULL,
  `avatar` TEXT NULL,
  `tier` VARCHAR(50) NOT NULL DEFAULT 'Standard Member',
  `rewardPoints` INT NOT NULL DEFAULT 100,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS `addresses` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(36) NOT NULL,
  `title` VARCHAR(50) NOT NULL DEFAULT 'Home',
  `fullName` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(25) NOT NULL,
  `street` VARCHAR(255) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `pincode` VARCHAR(20) NOT NULL,
  `country` VARCHAR(100) NOT NULL DEFAULT 'United States',
  `isDefault` BOOLEAN NOT NULL DEFAULT FALSE,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT `fk_addresses_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS `categories` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `icon` VARCHAR(50) NOT NULL DEFAULT 'Sparkles',
  `description` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NULL UNIQUE,
  `categoryId` VARCHAR(36) NOT NULL,
  `price` DOUBLE NOT NULL,
  `originalPrice` DOUBLE NULL,
  `discount` INT NOT NULL DEFAULT 0,
  `rating` DOUBLE NOT NULL DEFAULT 5.0,
  `reviewCount` INT NOT NULL DEFAULT 0,
  `stock` INT NOT NULL DEFAULT 0,
  `featured` BOOLEAN NOT NULL DEFAULT FALSE,
  `bestSeller` BOOLEAN NOT NULL DEFAULT FALSE,
  `isNew` BOOLEAN NOT NULL DEFAULT TRUE,
  `dealOfTheDay` BOOLEAN NOT NULL DEFAULT FALSE,
  `images` JSON NULL,
  `description` TEXT NOT NULL,
  `features` JSON NULL,
  `specs` JSON NULL,
  `colors` JSON NULL,
  `sizes` JSON NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX `idx_products_category` (`categoryId`),
  INDEX `idx_products_price` (`price`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. CART ITEMS TABLE
CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(36) NOT NULL,
  `productId` VARCHAR(36) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `color` VARCHAR(50) NULL,
  `size` VARCHAR(50) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY `uniq_user_cart_item` (`userId`, `productId`, `color`, `size`),
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cart_product` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. WISHLIST ITEMS TABLE
CREATE TABLE IF NOT EXISTS `wishlist_items` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(36) NOT NULL,
  `productId` VARCHAR(36) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY `uniq_user_wishlist` (`userId`, `productId`),
  CONSTRAINT `fk_wishlist_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wishlist_product` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. ORDERS TABLE
CREATE TABLE IF NOT EXISTS `orders` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `orderNumber` VARCHAR(50) NOT NULL UNIQUE,
  `userId` VARCHAR(36) NOT NULL,
  `status` ENUM('PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED_AND_REFUNDED') NOT NULL DEFAULT 'CONFIRMED',
  `statusStep` INT NOT NULL DEFAULT 2,
  `estimatedDelivery` DATETIME(3) NULL,
  `trackingNumber` VARCHAR(100) NULL,
  `carrier` VARCHAR(100) NOT NULL DEFAULT 'Cartverse Express Global Delivery',
  `subtotal` DOUBLE NOT NULL,
  `discount` DOUBLE NOT NULL DEFAULT 0,
  `shippingFee` DOUBLE NOT NULL DEFAULT 0,
  `tax` DOUBLE NOT NULL DEFAULT 0,
  `total` DOUBLE NOT NULL,
  `paymentMethod` VARCHAR(50) NOT NULL,
  `paymentStatus` VARCHAR(50) NOT NULL DEFAULT 'Paid',
  `shippingAddress` JSON NOT NULL,
  `timeline` JSON NOT NULL,
  `returnRequested` BOOLEAN NOT NULL DEFAULT FALSE,
  `returnReason` TEXT NULL,
  `returnStatus` VARCHAR(50) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX `idx_orders_user` (`userId`),
  INDEX `idx_orders_status` (`status`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `orderId` VARCHAR(36) NOT NULL,
  `productId` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `price` DOUBLE NOT NULL,
  `quantity` INT NOT NULL,
  `color` VARCHAR(50) NULL,
  `size` VARCHAR(50) NULL,
  `image` TEXT NULL,
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_items_product` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. COUPONS TABLE
CREATE TABLE IF NOT EXISTS `coupons` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `type` ENUM('PERCENT', 'FIXED', 'SHIPPING') NOT NULL DEFAULT 'PERCENT',
  `discount` DOUBLE NOT NULL,
  `minSpend` DOUBLE NOT NULL DEFAULT 0,
  `description` TEXT NOT NULL,
  `active` BOOLEAN NOT NULL DEFAULT TRUE,
  `expiresAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `productId` VARCHAR(36) NOT NULL,
  `userId` VARCHAR(36) NULL,
  `userName` VARCHAR(100) NOT NULL,
  `avatar` TEXT NULL,
  `rating` INT NOT NULL DEFAULT 5,
  `comment` TEXT NOT NULL,
  `verified` BOOLEAN NOT NULL DEFAULT TRUE,
  `adminReply` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT `fk_reviews_product` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. FLIPKART PRODUCTS CACHE TABLE
CREATE TABLE IF NOT EXISTS `flipkart_products` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NULL,
  `price` DOUBLE NOT NULL,
  `mrp` DOUBLE NULL,
  `discount` INT NOT NULL DEFAULT 0,
  `rating` DOUBLE NOT NULL DEFAULT 4.5,
  `reviewCount` INT NOT NULL DEFAULT 0,
  `inStock` BOOLEAN NOT NULL DEFAULT TRUE,
  `imageUrl` TEXT NULL,
  `productUrl` TEXT NULL,
  `affiliateUrl` TEXT NULL,
  `specs` JSON NULL,
  `brand` VARCHAR(100) NULL,
  `offers` JSON NULL,
  `lastSyncedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX `idx_fk_cat` (`category`),
  INDEX `idx_fk_price` (`price`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==========================================================
-- DEFAULT SEED DATA (Admin & Initial Customer)
-- ==========================================================

-- Insert Lead Admin (Elena Vance: admin@cartverse.io / Password: Admin@2026!)
INSERT INTO `users` (`id`, `name`, `email`, `passwordHash`, `role`, `tier`, `rewardPoints`) 
VALUES (
  'adm-001', 
  'Elena Vance (Lead Admin)', 
  'admin@cartverse.io', 
  '$2a$10$w8T0t2P9n7z8U.E4v5W0.u9d4Y2z5W3q1x2y3z4a5b6c7d8e9f0g', 
  'ADMIN', 
  'Super Administrator', 
  9999
) ON DUPLICATE KEY UPDATE `role` = 'ADMIN';

-- Insert Sample Verified Customer (Alex Mercer: alex.mercer@lumina.io / Password: Password@123)
INSERT INTO `users` (`id`, `name`, `email`, `passwordHash`, `role`, `tier`, `rewardPoints`, `phone`, `avatar`) 
VALUES (
  'usr-101', 
  'Alex Mercer', 
  'alex.mercer@lumina.io', 
  '$2a$10$w8T0t2P9n7z8U.E4v5W0.u9d4Y2z5W3q1x2y3z4a5b6c7d8e9f0g', 
  'CUSTOMER', 
  'VIP Platinum', 
  1240, 
  '+1 (555) 389-2041', 
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
) ON DUPLICATE KEY UPDATE `tier` = 'VIP Platinum';

-- Insert Default Discount Coupons
INSERT INTO `coupons` (`id`, `code`, `type`, `discount`, `minSpend`, `description`, `active`) VALUES
('coup-1', 'WELCOME10', 'PERCENT', 10, 0, '10% off your entire first purchase', TRUE),
('coup-2', 'SAVE20', 'PERCENT', 20, 150, '20% off on orders exceeding $150', TRUE),
('coup-3', 'FREESHIP', 'SHIPPING', 100, 50, 'Free Express Worldwide Shipping on orders over $50', TRUE),
('coup-4', 'FLAT30', 'FIXED', 30, 200, '$30 instant deduction for orders above $200', TRUE)
ON DUPLICATE KEY UPDATE `active` = TRUE;
