import React, { createContext, useState, useCallback, useContext, useEffect } from 'react';
import { INITIAL_PRODUCTS } from '../data/mockData';

export const ShopContext = createContext();

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within ShopProvider');
  }
  return context;
};

export const ShopProvider = ({ children }) => {
  // Core state
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const [adminAuth, setAdminAuth] = useState(null);
  const [products, setProducts] = useState([]);
  const [flipkartProducts, setFlipkartProducts] = useState([]);
  
  // UI state
  const [currentView, setCurrentView] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeProductId, setActiveProductId] = useState(null);
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  
  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  
  // Pagination
  const [totalProducts, setTotalProducts] = useState(0);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  
  // Recently viewed
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  
  // Orders and checkout
  const [orders, setOrders] = useState([]);
  const [recentOrder, setRecentOrder] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [directCheckoutItem, setDirectCheckoutItem] = useState(null);
  const [trackingOrderId, setTrackingOrderId] = useState(null);
  
  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // ✅ Load user from localStorage on app mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('aura_user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        if (userData && userData.isLoggedIn) {
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Failed to load user from localStorage:', error);
    }
  }, []);

  // Load products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoadingProducts(true);
        // Try to fetch from API
        const response = await fetch('/api/products?limit=50');
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || INITIAL_PRODUCTS);
          setTotalProducts(data.total || INITIAL_PRODUCTS.length);
        } else {
          // Fallback to mock data
          setProducts(INITIAL_PRODUCTS);
          setTotalProducts(INITIAL_PRODUCTS.length);
        }
      } catch (error) {
        console.error('Failed to load products, using mock data:', error);
        // Fallback to mock data on error
        setProducts(INITIAL_PRODUCTS);
        setTotalProducts(INITIAL_PRODUCTS.length);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    
    loadProducts();
  }, []);

  // Cart functions
  const addToCart = useCallback((item) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + (item.quantity || 1) } : p
        );
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCart((prev) => prev.filter((p) => p.id !== itemId));
  }, []);

  const updateCartQuantity = useCallback((itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart((prev) =>
        prev.map((p) => (p.id === itemId ? { ...p, quantity } : p))
      );
    }
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Wishlist functions
  const addToWishlist = useCallback((product) => {
    setWishlist((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const isInWishlist = useCallback((productId) => {
    return wishlist.some((p) => p.id === productId);
  }, [wishlist]);

  // Utility functions
  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const getCartCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const loadMoreProducts = useCallback(() => {
    setIsLoadingProducts(true);
    // This will be called when user scrolls to load more
    setTimeout(() => setIsLoadingProducts(false), 500);
  }, []);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const addToRecentlyViewed = useCallback((product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 10);
    });
  }, []);

  // Address management
  const addAddress = useCallback((address) => {
    setUser((prev) => {
      if (!prev) return prev;
      const newAddr = { ...address, id: Date.now().toString() };
      const updated = { ...prev, addresses: [...(prev.addresses || []), newAddr] };
      localStorage.setItem('aura_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Order management
  const placeOrder = useCallback((orderData) => {
    const order = {
      id: 'ORD-' + Date.now(),
      userId: user?.id,
      items: orderData.items,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      subtotal: orderData.totals.subtotal,
      discount: orderData.totals.discount,
      shippingFee: orderData.totals.shippingFee,
      tax: orderData.totals.tax,
      total: orderData.totals.total,
      status: 'Processing',
      statusStep: 1,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
      trackingNumber: 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      items: orderData.items.map(item => ({
        id: item.id,
        name: item?.name || 'Product',
        price: item.price,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        image: item.image
      }))
    };

    setOrders((prev) => [order, ...prev]);
    setRecentOrder(order);
    setCart([]);
    
    // Save order to localStorage
    const storedOrders = JSON.parse(localStorage.getItem('cartverse_orders') || '[]');
    localStorage.setItem('cartverse_orders', JSON.stringify([order, ...storedOrders]));

    addToast({ type: 'success', title: 'Order Placed! 🎉', message: `Order ${order.id} confirmed. Estimated delivery: ${order.estimatedDelivery}` });
    
    return order;
  }, [user?.id, addToast, setCart]);

  // Load orders from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cartverse_orders');
      if (stored) {
        const parsedOrders = JSON.parse(stored);
        setOrders(parsedOrders);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  }, []);

  // Coupon management
  const [coupons] = useState([
    { code: 'SAVE20', discount: 0.20, type: 'percent', active: true, minOrder: 500 },
    { code: 'FLAT100', discount: 100, type: 'flat', active: true, minOrder: 999 },
    { code: 'FREESHIP', discount: 1.0, type: 'shipping', active: true, minOrder: 0 },
  ]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const applyCoupon = useCallback((code) => {
    const coupon = coupons.find(c => c.code === code && c.active);
    if (!coupon) {
      addToast({ type: 'error', title: 'Invalid Coupon', message: 'This coupon code is not valid or expired.' });
      return false;
    }
    setAppliedCoupon(coupon);
    addToast({ type: 'success', title: 'Coupon Applied! ✓', message: `Coupon ${code} applied successfully.` });
    return true;
  }, [coupons, addToast]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  // Calculate cart totals with coupon
  const getCartTotals = useCallback((items = null) => {
    const itemsToUse = items || cart;
    const subtotal = itemsToUse.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const freeShippingThreshold = 999;
    let discount = 0;
    let shippingFee = subtotal >= freeShippingThreshold ? 0 : 99;

    if (appliedCoupon) {
      if (appliedCoupon.type === 'percent') {
        discount = Math.round(subtotal * appliedCoupon.discount);
      } else if (appliedCoupon.type === 'flat') {
        discount = appliedCoupon.discount;
      } else if (appliedCoupon.type === 'shipping') {
        shippingFee = 0;
      }
    }

    const afterDiscount = subtotal - discount;
    const tax = Math.round(afterDiscount * 0.18);
    const total = afterDiscount + shippingFee + tax;

    return {
      subtotal,
      discount,
      shippingFee,
      freeShippingThreshold,
      progressToFreeShipping: Math.round((subtotal / freeShippingThreshold) * 100),
      tax,
      total,
    };
  }, [cart, appliedCoupon]);

  // Reviews management
  const [reviews, setReviews] = useState({});
  const [reviewProductId, setReviewProductId] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cartverse_reviews');
      if (stored) {
        setReviews(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
    }
  }, []);

  const addReview = useCallback((productId, review) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: [...(prev[productId] || []), {
        id: Date.now(),
        ...review,
        date: new Date().toISOString(),
        helpful: 0
      }]
    }));
  }, []);

  // ✅ Missing functions for ProductDetailModal
  const toggleWishlist = useCallback((productId) => {
    const product = products.find(p => p.id === productId) || flipkartProducts.find(p => p.id === productId);
    if (product) {
      addToWishlist(product);
    }
  }, [products, flipkartProducts, addToWishlist]);

  const buyNow = useCallback((product, color, size, quantity) => {
    setDirectCheckoutItem({ 
      ...product, 
      selectedColor: color, 
      selectedSize: size,
      quantity: quantity || 1
    });
    setIsCheckoutOpen(true);
  }, [setDirectCheckoutItem, setIsCheckoutOpen]);

  const value = {
    // Core state
    cart,
    wishlist,
    user,
    setUser,
    adminAuth,
    setAdminAuth,
    products,
    setProducts,
    flipkartProducts,
    setFlipkartProducts,
    
    // UI state
    currentView,
    setCurrentView,
    isCartOpen,
    setIsCartOpen,
    activeProductId,
    setActiveProductId,
    theme,
    toggleTheme,
    isLoading,
    setIsLoading,
    isLoadingProducts,
    setIsLoadingProducts,
    
    // Search & filter
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    minRating,
    setMinRating,
    inStockOnly,
    setInStockOnly,
    sortBy,
    setSortBy,
    
    // Pagination
    totalProducts,
    setTotalProducts,
    hasMoreProducts,
    setHasMoreProducts,
    
    // Recently viewed
    recentlyViewed,
    addToRecentlyViewed,
    
    // Orders and checkout
    orders,
    setOrders,
    recentOrder,
    setRecentOrder,
    isCheckoutOpen,
    setIsCheckoutOpen,
    directCheckoutItem,
    setDirectCheckoutItem,
    trackingOrderId,
    setTrackingOrderId,
    placeOrder,
    addAddress,
    getCartTotals,

    // Coupons
    coupons,
    appliedCoupon,
    applyCoupon,
    removeCoupon,

    // Reviews
    reviews,
    reviewProductId,
    setReviewProductId,
    addReview,
    
    // Toasts
    toasts,
    addToast,
    
    // Cart functions
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    
    // Wishlist functions
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    buyNow,
    
    // Utility functions
    loadMoreProducts,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};
