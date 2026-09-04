import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import apiClient from '../utils/apiClient.js';

const ShopContext = createContext();

const DEFAULT_PRODUCTS = [];
const DEFAULT_CATEGORIES = [];

export const ShopProvider = ({ children }) => {
  // ═══════════════════════════════════════════════════════════════════
  // PRODUCTS STATE (declare early for use in useEffect)
  // ═══════════════════════════════════════════════════════════════════
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [hasMoreProducts, setHasMoreProducts] = useState(false);
  const [productsPage, setProductsPage] = useState(1);

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
  // LOAD PRODUCTS AND CATEGORIES FROM API ON MOUNT
  // ═══════════════════════════════════════════════════════════════════
  useEffect(() => {
    const loadProductsAndCategories = async () => {
      try {
        setIsLoadingProducts(true);

        // Load categories from API
        const categoriesResponse = await apiClient.fetchCategories();
        if (categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        }

        // Load products from API
        const productsResponse = await apiClient.fetchProducts(1, 100);
        if (productsResponse.data) {
          setProducts(productsResponse.data);
          setTotalProducts(productsResponse.total || productsResponse.data.length);
          setHasMoreProducts(productsResponse.page < productsResponse.totalPages);
        }
      } catch (error) {
        console.warn('Failed to load products from API:', error);
        // Products will remain as empty array
        setIsLoadingProducts(false);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    loadProductsAndCategories();
  }, []);

  const loadMoreProducts = useCallback(() => {
    setIsLoadingProducts(true);
    setTimeout(() => {
      setProductsPage(p => p + 1);
      setIsLoadingProducts(false);
    }, 300);
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
  // CART STATE & SYNC WITH DATABASE
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

  // Persist cart to localStorage
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
  // WISHLIST STATE & SYNC WITH DATABASE
  // ═══════════════════════════════════════════════════════════════════
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem('cartverse-wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Load wishlist from database when user logs in
  useEffect(() => {
    if (user?.id) {
      const loadWishlistFromDB = async () => {
        try {
          const response = await apiClient.getWishlist();
          if (response.success && response.items) {
            // Store wishlist items (not just IDs)
            setWishlistItems(response.items);
          }
        } catch (error) {
          console.warn('Failed to load wishlist from database:', error);
          // Keep local wishlist if API fails
        }
      };
      loadWishlistFromDB();
    }
  }, [user?.id]);

  const addToWishlist = useCallback(async (productId) => {
    if (user?.id) {
      // Add to database
      try {
        const response = await apiClient.addToWishlist(productId);
        if (response.success) {
          // Reload wishlist from database
          const wishlistResponse = await apiClient.getWishlist();
          if (wishlistResponse.success) {
            setWishlistItems(wishlistResponse.items);
          }
        }
      } catch (error) {
        console.error('Failed to add to wishlist:', error);
        addToast({ type: 'error', message: 'Failed to add to wishlist' });
      }
    } else {
      // Add to local storage for unauthenticated users
      setWishlistItems(prev => {
        if (prev.some(item => item.id === productId || item.productId === productId)) {
          return prev;
        }
        return [...prev, { productId }];
      });
    }
  }, [user?.id, addToast]);

  const removeFromWishlist = useCallback(async (wishlistItemIdOrProductId) => {
    if (user?.id) {
      // Remove from database
      try {
        const response = await apiClient.removeFromWishlist(wishlistItemIdOrProductId);
        if (response.success) {
          const wishlistResponse = await apiClient.getWishlist();
          if (wishlistResponse.success) {
            setWishlistItems(wishlistResponse.items);
          }
        }
      } catch (error) {
        console.error('Failed to remove from wishlist:', error);
        addToast({ type: 'error', message: 'Failed to remove from wishlist' });
      }
    } else {
      // Remove from local storage
      setWishlistItems(prev =>
        prev.filter(item => item.id !== wishlistItemIdOrProductId && item.productId !== wishlistItemIdOrProductId)
      );
    }
  }, [user?.id, addToast]);

  const toggleWishlist = useCallback(async (productId) => {
    const isInWishlist = wishlistItems.some(item => item.productId === productId || item.id === productId);
    if (isInWishlist) {
      const item = wishlistItems.find(item => item.productId === productId || item.id === productId);
      await removeFromWishlist(item?.id || productId);
    } else {
      await addToWishlist(productId);
    }
  }, [wishlistItems, addToWishlist, removeFromWishlist]);

  const isInWishlist = useCallback((productId) => {
    return wishlistItems.some(item => item.productId === productId || item.id === productId);
  }, [wishlistItems]);

  // Persist wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('cartverse-wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

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
  // PRODUCT DETAIL & REVIEW STATE (CRITICAL)
  // ═══════════════════════════════════════════════════════════════════
  const [activeProductId, setActiveProductId] = useState(null);
  const [recentOrder, setRecentOrder] = useState(null);
  const [reviewProductId, setReviewProductId] = useState(null);
  const [reviews, setReviews] = useState({});

  // ═══════════════════════════════════════════════════════════════════
  // REVIEW MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════
  const addReview = useCallback((productId, reviewData) => {
    const review = {
      id: `review-${Date.now()}`,
      productId,
      ...reviewData,
      createdAt: new Date().toISOString(),
    };
    
    setReviews(prev => ({
      ...prev,
      [productId]: [...(prev[productId] || []), review],
    }));
    
    addToast({
      type: 'success',
      title: 'Review Added!',
      message: 'Thank you for your review.',
    });
    
    return review;
  }, [addToast]);

  // ═══════════════════════════════════════════════════════════════════
  // BUY NOW FUNCTION (QUICK CHECKOUT)
  // ═══════════════════════════════════════════════════════════════════
  const buyNow = useCallback((product, quantity = 1, color = null, size = null) => {
    setDirectCheckoutItem({
      ...product,
      quantity,
      color,
      size,
    });
    setIsCheckoutOpen(true);
    addToast({
      type: 'info',
      message: 'Proceed to checkout',
    });
  }, [addToast]);



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
    wishlist: wishlistItems,
    wishlistItems,
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
    activeProductId,
    setActiveProductId,
    showProductDetail,
    setShowProductDetail,
    showReviewModal,
    setShowReviewModal,
    reviewProductId,
    setReviewProductId,
    addReview,
    reviews,
    buyNow,
    recentOrder,
    setRecentOrder,
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
