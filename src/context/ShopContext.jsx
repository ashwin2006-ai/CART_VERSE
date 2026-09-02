import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../data/mockData.js';

const ShopContext = createContext();

const DEFAULT_PRODUCTS = INITIAL_PRODUCTS || [];
const DEFAULT_CATEGORIES = INITIAL_CATEGORIES || [];

export const ShopProvider = ({ children }) => {
  // ═══════════════════════════════════════════════════════════════════
  // THEME STATE
  // ═══════════════════════════════════════════════════════════════════
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('cartverse-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('cartverse-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  }, []);

  // ═══════════════════════════════════════════════════════════════════
  // AUTHENTICATION STATE
  // ═══════════════════════════════════════════════════════════════════
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cartverse-user');
    return saved ? JSON.parse(saved) : null;
  });

  const [adminAuth, setAdminAuth] = useState({
    isAuthenticated: false,
    user: null,
    token: null,
  });

  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('cartverse-user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('cartverse-user');
  }, []);

  // ═══════════════════════════════════════════════════════════════════
  // ADMIN AUTHENTICATION
  // ═══════════════════════════════════════════════════════════════════
  const adminLogin = useCallback((email, password, twoFactorCode) => {
    // Demo admin credentials (hardcoded for development)
    const DEMO_EMAIL = 'admin@cartverse.io';
    const DEMO_PASSWORD = 'Admin@2026!';
    const DEMO_2FA = '123456'; // Simple demo 2FA

    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      // For demo, we'll accept any 2FA code or empty
      const adminUser = {
        id: 'admin-1',
        name: 'CartVerse Admin',
        email: email,
        role: 'admin',
        permissions: ['manage-products', 'manage-orders', 'manage-users', 'view-analytics'],
        twoFactorEnabled: true,
      };

      setAdminAuth({
        isAuthenticated: true,
        user: adminUser,
        token: `admin-token-${Date.now()}`,
      });

      localStorage.setItem('cartverse-admin-token', `admin-token-${Date.now()}`);
      localStorage.setItem('cartverse-admin-user', JSON.stringify(adminUser));

      return { success: true, message: 'Admin login successful' };
    }

    return { success: false, error: 'Invalid email or password' };
  }, []);

  const adminLogout = useCallback(() => {
    setAdminAuth({
      isAuthenticated: false,
      user: null,
      token: null,
    });
    localStorage.removeItem('cartverse-admin-token');
    localStorage.removeItem('cartverse-admin-user');
  }, []);

  // ═══════════════════════════════════════════════════════════════════
  // TOAST STATE (for notifications)
  // ═══════════════════════════════════════════════════════════════════
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((msgOrObj, type = 'info') => {
    const id = Date.now();
    let toastObj;
    
    // Handle both old format: addToast(message, type)
    // and new format: addToast({ type, title, message })
    if (typeof msgOrObj === 'object' && msgOrObj !== null) {
      toastObj = { id, ...msgOrObj };
    } else {
      toastObj = { id, message: msgOrObj, type };
    }
    
    setToasts(prev => [...prev, toastObj]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ═══════════════════════════════════════════════════════════════════
  // PRODUCTS STATE
  // ═══════════════════════════════════════════════════════════════════
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [totalProducts, setTotalProducts] = useState(DEFAULT_PRODUCTS.length);
  const [hasMoreProducts, setHasMoreProducts] = useState(false);
  const [productsPage, setProductsPage] = useState(1);

  const loadMoreProducts = useCallback(() => {
    setIsLoadingProducts(true);
    setTimeout(() => {
      setProductsPage(p => p + 1);
      setIsLoadingProducts(false);
    }, 300);
  }, []);

  // ═══════════════════════════════════════════════════════════════════
  // CART STATE
  // ═══════════════════════════════════════════════════════════════════
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartverse-cart');
    return saved ? JSON.parse(saved) : [];
  });

  const addToCart = useCallback((product, quantity = 1, color = null, size = null) => {
    setCartItems(prev => {
      const existing = prev.find(
        item => item.id === product.id && item.color === color && item.size === size
      );
      if (existing) {
        return prev.map(item =>
          item.id === product.id && item.color === color && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity, color, size }];
    });
  }, []);

  const updateCartItem = useCallback((productId, quantity, color, size) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size);
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === productId && item.color === color && item.size === size
            ? { ...item, quantity }
            : item
        )
      );
    }
  }, []);

  const removeFromCart = useCallback((productId, color = null, size = null) => {
    setCartItems(prev =>
      prev.filter(item => !(item.id === productId && item.color === color && item.size === size))
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Persist cart
  useEffect(() => {
    localStorage.setItem('cartverse-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // ═══════════════════════════════════════════════════════════════════
  // WISHLIST STATE
  // ═══════════════════════════════════════════════════════════════════
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('cartverse-wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const addToWishlist = useCallback((productId) => {
    setWishlist(prev => {
      if (prev.includes(productId)) return prev;
      return [...prev, productId];
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setWishlist(prev => prev.filter(id => id !== productId));
  }, []);

  const isInWishlist = useCallback((productId) => {
    return wishlist.includes(productId);
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('cartverse-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // ═══════════════════════════════════════════════════════════════════
  // RECENTLY VIEWED STATE
  // ═══════════════════════════════════════════════════════════════════
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const saved = localStorage.getItem('cartverse-recently-viewed');
    return saved ? JSON.parse(saved) : [];
  });

  const addToRecentlyViewed = useCallback((productId) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, 20);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('cartverse-recently-viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // ═══════════════════════════════════════════════════════════════════
  // FILTER STATE
  // ═══════════════════════════════════════════════════════════════════
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  // ═══════════════════════════════════════════════════════════════════
  // VIEW STATE
  // ═══════════════════════════════════════════════════════════════════
  const [currentView, setCurrentView] = useState('store');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [orderConfirmationData, setOrderConfirmationData] = useState(null);
  const [showOrderTracking, setShowOrderTracking] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState(null);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  // ═══════════════════════════════════════════════════════════════════
  // ORDER STATE
  // ═══════════════════════════════════════════════════════════════════
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('cartverse-orders');
    return saved ? JSON.parse(saved) : [];
  });

  const createOrder = useCallback((orderData) => {
    const newOrder = {
      id: `order-${Date.now()}`,
      ...orderData,
      createdAt: new Date().toISOString(),
      status: 'CONFIRMED',
      statusStep: 2,
    };
    setOrders(prev => [...prev, newOrder]);
    return newOrder;
  }, []);

  useEffect(() => {
    localStorage.setItem('cartverse-orders', JSON.stringify(orders));
  }, [orders]);

  // ═══════════════════════════════════════════════════════════════════
  // COUPONS STATE
  // ═══════════════════════════════════════════════════════════════════
  const [coupons, setCoupons] = useState([
    { code: 'SAVE20', discount: 20, minOrder: 2999, description: '20% off on orders above ₹2,999' },
    { code: 'WELCOME10', discount: 10, minOrder: 0, description: '10% off your entire first purchase' },
    { code: 'FREESHIP', discount: 0, minOrder: 999, description: 'Free express shipping over ₹999' },
    { code: 'FLAT500', discount: 500, minOrder: 3999, description: '₹500 instant discount on orders above ₹3,999' },
  ]);

  // ═══════════════════════════════════════════════════════════════════
  // COMPUTED VALUES
  // ═══════════════════════════════════════════════════════════════════
  const cartTotal = useMemo(() => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((sum, item) => {
      if (!item || typeof item.price !== 'number' || typeof item.quantity !== 'number') return sum;
      return sum + (item.price * item.quantity);
    }, 0);
  }, [cartItems]);

  const cartCount = useMemo(() => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((sum, item) => {
      if (!item || typeof item.quantity !== 'number') return sum;
      return sum + item.quantity;
    }, 0);
  }, [cartItems]);

  // ═══════════════════════════════════════════════════════════════════
  // CONTEXT VALUE
  // ═══════════════════════════════════════════════════════════════════
  const value = {
    // Theme
    theme,
    setTheme,
    toggleTheme,

    // Auth
    user,
    setUser,
    login,
    logout,
    adminAuth,
    setAdminAuth,
    adminLogin,
    adminLogout,

    // Products
    products,
    setProducts,
    categories,
    setCategories,
    isLoadingProducts,
    setIsLoadingProducts,
    totalProducts,
    setTotalProducts,
    hasMoreProducts,
    setHasMoreProducts,
    loadMoreProducts,

    // Cart (with backward compatibility aliases)
    cartItems,
    cart: cartItems,
    cartTotal,
    cartCount,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    setIsCartOpen: () => {}, // placeholder

    // Wishlist
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,

    // Recently Viewed
    recentlyViewed,
    addToRecentlyViewed,

    // Filters
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    minRating,
    setMinRating,
    inStockOnly,
    setInStockOnly,
    sortBy,
    setSortBy,

    // Views
    currentView,
    setCurrentView,
    selectedProduct,
    setSelectedProduct,
    setActiveProductId: setSelectedProduct, // alias
    showProductDetail,
    setShowProductDetail,
    showReviewModal,
    setShowReviewModal,
    showCartDrawer,
    setShowCartDrawer,
    showCheckout,
    setShowCheckout,
    showOrderConfirmation,
    setShowOrderConfirmation,
    orderConfirmationData,
    setOrderConfirmationData,
    showOrderTracking,
    setShowOrderTracking,
    trackingOrderId,
    setTrackingOrderId,
    isAiAssistantOpen,
    setIsAiAssistantOpen,

    // Orders
    orders,
    createOrder,

    // Coupons
    coupons,
    setCoupons,

    // Toasts
    toasts,
    addToast,
    removeToast,
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within ShopProvider');
  }
  return context;
};
