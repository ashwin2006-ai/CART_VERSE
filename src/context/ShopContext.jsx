import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../data/mockData.js';
import apiClient from '../utils/apiClient.js';

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

  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('cartverse-user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('cartverse-user');
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

  const updateCartQuantity = useCallback((index, newQuantity) => {
    if (newQuantity <= 0) {
      setCartItems(prev => prev.filter((_, i) => i !== index));
    } else {
      setCartItems(prev =>
        prev.map((item, i) =>
          i === index ? { ...item, quantity: newQuantity } : item
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
  // ORDER STATE
  // ═══════════════════════════════════════════════════════════════════
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('cartverse-orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartverse-orders', JSON.stringify(orders));
  }, [orders]);

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

  const toggleWishlist = useCallback((productId) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
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
  // COUPONS STATE & MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════
  const [coupons, setCoupons] = useState([
    { code: 'SAVE20', discount: 20, minOrder: 2999, description: '20% off on orders above ₹2,999', active: true, type: 'percentage' },
    { code: 'WELCOME10', discount: 10, minOrder: 0, description: '10% off your entire first purchase', active: true, type: 'percentage' },
    { code: 'FREESHIP', discount: 0, minOrder: 999, description: 'Free express shipping over ₹999', active: true, type: 'shipping' },
    { code: 'FLAT500', discount: 500, minOrder: 3999, description: '₹500 instant discount on orders above ₹3,999', active: true, type: 'flat' },
  ]);

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const applyCoupon = useCallback((code) => {
    const coupon = coupons.find(c => c.code === code);
    if (!coupon || !coupon.active) return false;
    setAppliedCoupon(coupon);
    return true;
  }, [coupons]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  // ═══════════════════════════════════════════════════════════════════
  // CHECKOUT STATE & MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════
  const [directCheckoutItem, setDirectCheckoutItem] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // ═══════════════════════════════════════════════════════════════════
  // ADDRESS MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════
  const addAddress = useCallback((addressData) => {
    const newAddress = {
      ...addressData,
      id: `addr-${Date.now()}`,
    };
    setUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        addresses: [...(prev.addresses || []), newAddress],
      };
    });
    return newAddress;
  }, []);

  const removeAddress = useCallback((addressId) => {
    setUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        addresses: (prev.addresses || []).filter(a => a.id !== addressId),
      };
    });
  }, []);

  // ═══════════════════════════════════════════════════════════════════
  // ORDER PLACEMENT
  // ═══════════════════════════════════════════════════════════════════
  const placeOrder = useCallback((orderData) => {
    const newOrder = {
      id: `order-${Date.now()}`,
      ...orderData,
      createdAt: new Date().toISOString(),
      status: 'CONFIRMED',
      statusStep: 2,
    };
    
    setOrders(prev => [...prev, newOrder]);
    setOrderConfirmationData(newOrder);
    setShowOrderConfirmation(true);
    clearCart();
    setAppliedCoupon(null);
    
    addToast({
      type: 'success',
      title: 'Order Placed!',
      message: `Your order #${newOrder.id.slice(-8)} has been confirmed.`,
    });
    
    return newOrder;
  }, [addToast]);

  // ═══════════════════════════════════════════════════════════════════
  // CART TOTALS CALCULATION
  // ═══════════════════════════════════════════════════════════════════
  const getCartTotals = useCallback((itemsToCalc = cartItems) => {
    const subtotal = itemsToCalc.reduce((sum, item) => {
      return sum + ((item?.price || 0) * (item?.quantity || 0));
    }, 0);

    const freeShippingThreshold = 999;
    let discount = 0;
    let shippingFee = subtotal >= freeShippingThreshold ? 0 : 99;

    if (appliedCoupon) {
      if (appliedCoupon.minOrder && subtotal < appliedCoupon.minOrder) {
        // Coupon doesn't apply - order too small
      } else {
        if (appliedCoupon.type === 'percentage') {
          discount = Math.round((subtotal * appliedCoupon.discount) / 100);
        } else if (appliedCoupon.type === 'flat') {
          discount = appliedCoupon.discount;
        } else if (appliedCoupon.type === 'shipping') {
          shippingFee = 0;
        }
      }
    }

    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Math.round((taxableAmount * 18) / 100); // 18% GST
    const total = subtotal - discount + shippingFee + tax;

    return {
      subtotal: Math.round(subtotal),
      discount: Math.round(discount),
      shippingFee: Math.round(shippingFee),
      tax: Math.round(tax),
      total: Math.round(total),
      freeShippingThreshold,
      progressToFreeShipping: Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100)),
    };
  }, [cartItems, appliedCoupon]);

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
    updateCartQuantity,
    removeFromCart,
    clearCart,
    isCartOpen: showCartDrawer,
    setIsCartOpen: setShowCartDrawer,
    getCartTotals,

    // Wishlist
    wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
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
    setActiveProductId: setSelectedProduct,
    showProductDetail,
    setShowProductDetail,
    showReviewModal,
    setShowReviewModal,
    reviewProductId: null,
    setReviewProductId: () => {},
    addReview: () => {},
    showCartDrawer,
    setShowCartDrawer,
    showCheckout: isCheckoutOpen,
    setShowCheckout: setIsCheckoutOpen,
    isCheckoutOpen,
    setIsCheckoutOpen,
    directCheckoutItem,
    setDirectCheckoutItem,
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
    placeOrder,

    // Coupons
    coupons,
    setCoupons,
    appliedCoupon,
    applyCoupon,
    removeCoupon,

    // Addresses
    addAddress,
    removeAddress,

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
