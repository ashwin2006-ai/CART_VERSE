import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_COUPONS,
  INITIAL_USER,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';

const ShopContext = createContext();

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};

export const ShopProvider = ({ children }) => {
  // Persistence Helpers - Safe for mobile
  const loadLocal = (key, fallback) => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return fallback;
      }
      const saved = localStorage.getItem(`aura_${key}`);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  };

  const saveLocal = (key, val) => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      localStorage.setItem(`aura_${key}`, JSON.stringify(val));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  };

  // State Declarations
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('cartverse_theme') || 'light';
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('cartverse_theme', nextTheme);
      return nextTheme;
    });
  };

  const [currentView, setCurrentView] = useState(() => {
    if (window.location.hash === '#admin' || window.location.pathname.includes('/admin')) {
      return 'admin';
    }
    return 'store';
  }); // 'store', 'admin', 'account'

  const [products, setProducts] = useState(INITIAL_PRODUCTS); // always start fresh
  const [categories, setCategories] = useState(() => loadLocal('categories', INITIAL_CATEGORIES));
  const [reviews, setReviews] = useState(() => loadLocal('reviews', INITIAL_REVIEWS));
  const [coupons, setCoupons] = useState(() => loadLocal('coupons', INITIAL_COUPONS));
  const [user, setUser] = useState(() => {
    const loaded = loadLocal('user', INITIAL_USER);
    // Ensure user always has required properties
    if (!loaded || typeof loaded !== 'object') {
      return INITIAL_USER;
    }
    return {
      ...INITIAL_USER,
      ...loaded,
      addresses: loaded.addresses || INITIAL_USER.addresses || []
    };
  });

  // Safe user setter that ensures addresses exists
  const safeSetUser = (updater) => {
    setUser(prev => {
      const updated = typeof updater === 'function' ? updater(prev) : updater;
      if (!updated || typeof updated !== 'object') {
        return INITIAL_USER;
      }
      return {
        ...prev,
        ...updated,
        addresses: updated.addresses || prev.addresses || []
      };
    });
  };
  const [orders, setOrders] = useState(() => loadLocal('orders', INITIAL_ORDERS));
  const [cart, setCart] = useState(() => loadLocal('cart', []));
  const [wishlist, setWishlist] = useState(() => loadLocal('wishlist', ['prod-1', 'prod-4']));
  const [notifications, setNotifications] = useState(() => loadLocal('notifs', INITIAL_NOTIFICATIONS));
  const [recentlyViewed, setRecentlyViewed] = useState(() => loadLocal('recent', ['prod-1', 'prod-2']));

  // Admin Auth State
  const [adminAuth, setAdminAuth] = useState(() => loadLocal('admin_auth', {
    isAuthenticated: false,
    token: null,
    adminUser: {
      id: 'adm-001',
      name: 'Elena Vance (Lead Admin)',
      email: 'admin@cartverse.io',
      role: 'Super Administrator',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      lastLogin: '2026-08-25 12:45 PM',
      twoFactorEnabled: true
    },
    passwordHash: 'Admin@2026!'
  }));

  // Applied Promo Coupon
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 600]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  // Modal / Drawer UI States
  const [activeProductId, setActiveProductId] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [directCheckoutItem, setDirectCheckoutItem] = useState(null);
  const [recentOrder, setRecentOrder] = useState(null);
  const [trackingOrderId, setTrackingOrderId] = useState(null);
  const [reviewProductId, setReviewProductId] = useState(null);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Product loading from API
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);

  // Fetch real products from API
  const fetchProducts = async (page = 1, replace = false) => {
    try {
      setIsLoadingProducts(true);
      const res = await fetch(`/api/products?page=${page}&limit=100`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      if (data && data.success && data.data) {
        setProducts(prev => replace ? data.data : [...prev, ...data.data]);
        setTotalProducts(data.total || data.data.length);
        setCurrentPage(page);
        setHasMoreProducts(page < (data.totalPages || 1));
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.warn('API unavailable, using local data:', err.message);
      // Fallback to local data
      if (replace) {
        setProducts(INITIAL_PRODUCTS);
        setTotalProducts(INITIAL_PRODUCTS.length);
      }
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/products/categories', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      if (data && data.success && data.data && Array.isArray(data.data) && data.data.length > 0) {
        setCategories([{ id: 'all', name: 'All', slug: 'all', icon: 'LayoutGrid', count: data.data.reduce((s, c) => s + (c.count || 0), 0) }, ...data.data]);
      } else {
        throw new Error('Invalid categories response');
      }
    } catch (err) {
      console.warn('Categories API failed, using local data:', err.message);
      setCategories(INITIAL_CATEGORIES);
    }
  };

  const loadMoreProducts = () => fetchProducts(currentPage + 1, false);

  useEffect(() => {
    fetchProducts(1, true);
    fetchCategories();
  }, []);

  // Apply Theme to document root
  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.style.backgroundColor = 'var(--bg-main)';
      document.body.style.color = 'var(--text-primary)';
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('cartverse_theme', theme);
      }
    } catch (e) {
      console.warn('Theme setup error:', e);
    }
  }, [theme]);

  // Sync to LocalStorage — skip products (always fetched fresh)
  useEffect(() => { saveLocal('categories', categories); }, [categories]);
  useEffect(() => { saveLocal('reviews', reviews); }, [reviews]);
  useEffect(() => { saveLocal('coupons', coupons); }, [coupons]);
  useEffect(() => { saveLocal('user', user); }, [user]);
  useEffect(() => { saveLocal('orders', orders); }, [orders]);
  useEffect(() => { saveLocal('cart', cart); }, [cart]);
  useEffect(() => { saveLocal('wishlist', wishlist); }, [wishlist]);
  useEffect(() => { saveLocal('notifs', notifications); }, [notifications]);
  useEffect(() => { saveLocal('recent', recentlyViewed); }, [recentlyViewed]);
  useEffect(() => { saveLocal('admin_auth', adminAuth); }, [adminAuth]);

  // Handle URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Toast Function
  const addToast = ({ type = 'info', title, message }) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Admin Authentication Actions
  const adminLogin = (email, password) => {
    if (email.trim().toLowerCase() === adminAuth.adminUser.email.toLowerCase() && password === adminAuth.passwordHash) {
      const token = 'aura_adm_jwt_' + Math.random().toString(36).substring(2);
      const updated = {
        ...adminAuth,
        isAuthenticated: true,
        token,
        adminUser: {
          ...adminAuth.adminUser,
          lastLogin: new Date().toLocaleString()
        }
      };
      setAdminAuth(updated);
      addToast({
        type: 'success',
        title: 'Admin Access Granted 🛡️',
        message: `Welcome back, ${adminAuth.adminUser.name}`
      });
      return { success: true };
    } else {
      addToast({
        type: 'error',
        title: 'Access Denied',
        message: 'Invalid administrative email or security password.'
      });
      return { success: false, error: 'Invalid credentials. Please verify your credentials.' };
    }
  };

  const adminLogout = () => {
    setAdminAuth(prev => ({
      ...prev,
      isAuthenticated: false,
      token: null
    }));
    setCurrentView('store');
    window.location.hash = '';
    addToast({
      type: 'info',
      title: 'Admin Session Terminated',
      message: 'You have been securely signed out.'
    });
  };

  const changeAdminPassword = (currentPassword, newPassword) => {
    if (currentPassword !== adminAuth.passwordHash) {
      addToast({
        type: 'error',
        title: 'Password Mismatch',
        message: 'Current password provided is incorrect.'
      });
      return false;
    }
    setAdminAuth(prev => ({
      ...prev,
      passwordHash: newPassword
    }));
    addToast({
      type: 'success',
      title: 'Security Updated 🔒',
      message: 'Admin security password changed successfully.'
    });
    return true;
  };

  const updateAdminProfile = (data) => {
    setAdminAuth(prev => ({
      ...prev,
      adminUser: {
        ...prev.adminUser,
        ...data
      }
    }));
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Admin profile parameters have been updated.'
    });
  };

  // Record Recently Viewed Product
  const recordRecentlyViewed = (productId) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, 8);
    });
  };

  // Wishlist Actions
  const toggleWishlist = (productId) => {
    const exists = wishlist.includes(productId);
    const prod = products.find(p => p.id === productId);
    if (exists) {
      setWishlist(prev => prev.filter(id => id !== productId));
      addToast({
        type: 'info',
        title: 'Removed from Wishlist',
        message: prod ? `${prod.name.substring(0, 24)}... removed` : 'Item removed'
      });
    } else {
      setWishlist(prev => [...prev, productId]);
      addToast({
        type: 'success',
        title: 'Added to Wishlist ❤️',
        message: prod ? `${prod.name.substring(0, 24)}... saved` : 'Item saved'
      });
    }
  };

  // Cart Calculations
  const getCartTotals = (itemsList = cart) => {
    const subtotal = itemsList.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.type === 'percent') {
        discount = (subtotal * appliedCoupon.discount) / 100;
      } else if (appliedCoupon.type === 'fixed') {
        discount = Math.min(appliedCoupon.discount, subtotal);
      } else if (appliedCoupon.type === 'shipping') {
        discount = 15.00;
      }
    }

    const freeShippingThreshold = 999;
    const isFreeShipping = subtotal >= freeShippingThreshold || (appliedCoupon && appliedCoupon.type === 'shipping');
    const shippingFee = subtotal === 0 ? 0 : (isFreeShipping ? 0 : 99);
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = taxableAmount > 0 ? Math.round(taxableAmount * 0.18) : 0; // 18% GST
    const total = Math.max(0, taxableAmount + shippingFee + tax);

    return {
      subtotal: Math.round(subtotal),
      discount: Math.round(discount),
      shippingFee,
      tax,
      total,
      freeShippingThreshold,
      progressToFreeShipping: Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))
    };
  };

  // Cart Actions
  const addToCart = (product, quantity = 1, color = null, size = null) => {
    const selectedColor = color || (product.colors && product.colors[0]?.name) || 'Default';
    const selectedSize = size || (product.sizes && product.sizes[0]) || 'Standard';

    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.id === product.id && item.color === selectedColor && item.size === selectedSize
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(newQty, product.stock || 99)
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.images ? product.images[0] : '',
            color: selectedColor,
            size: selectedSize,
            quantity: Math.min(quantity, product.stock || 99),
            maxStock: product.stock || 99,
            category: product.category
          }
        ];
      }
    });

    addToast({
      type: 'success',
      title: 'Added to Bag 🛍️',
      message: `${product.name.substring(0, 26)}... (${quantity}x)`
    });
  };

  const updateCartQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = {
          ...updated[index],
          quantity: Math.min(newQuantity, updated[index].maxStock || 99)
        };
      }
      return updated;
    });
  };

  const removeFromCart = (index) => {
    setCart(prev => {
      const item = prev[index];
      if (item) {
        addToast({
          type: 'info',
          title: 'Removed from Cart',
          message: `${item.name.substring(0, 22)}... removed`
        });
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Coupon Actions
  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find(c => c.code === cleanCode && c.active);
    
    if (!found) {
      addToast({
        type: 'error',
        title: 'Invalid Coupon',
        message: `Promo code "${cleanCode}" does not exist or has expired.`
      });
      return false;
    }

    const { subtotal } = getCartTotals();
    if (found.minSpend && subtotal < found.minSpend) {
      addToast({
        type: 'error',
        title: 'Minimum Spend Required',
        message: `Add ₹${Math.round(found.minSpend - subtotal).toLocaleString('en-IN')} more to use code "${cleanCode}".`
      });
      return false;
    }

    setAppliedCoupon(found);
    addToast({
      type: 'success',
      title: 'Coupon Applied! 🎉',
      message: `${found.description} activated.`
    });
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast({
      type: 'info',
      title: 'Coupon Removed',
      message: 'Discount has been reset.'
    });
  };

  // Place Order Simulation
  const placeOrder = ({ items, shippingAddress, paymentMethod, totals }) => {
    const orderId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);
    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      status: 'Confirmed',
      statusStep: 2,
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      trackingNumber: 'CV-' + Math.floor(100000000 + Math.random() * 900000000),
      carrier: 'Cartverse Express Global Delivery',
      currentLocation: 'Fulfillment Hub - Ready for Dispatch',
      items: items.map(it => ({
        id: it.id,
        name: it.name,
        color: it.color,
        size: it.size,
        price: it.price,
        quantity: it.quantity,
        image: it.image
      })),
      subtotal: totals.subtotal,
      discount: totals.discount,
      shippingFee: totals.shippingFee,
      tax: totals.tax,
      total: totals.total,
      paymentMethod,
      paymentStatus: 'Paid',
      shippingAddress,
      timeline: [
        { step: 'Order Placed', time: 'Just Now', done: true },
        { step: 'Payment Verified & Confirmed', time: 'Just Now', done: true },
        { step: 'Packed & Dispatched from Warehouse', time: 'Pending', done: false },
        { step: 'In Transit with Express Courier', time: 'Pending', done: false },
        { step: 'Out for Delivery', time: 'Pending', done: false },
        { step: 'Delivered', time: 'Estimated in 3-4 days', done: false }
      ],
      canReturn: false,
      returnRequested: false
    };

    // Deduct stock from products
    setProducts(prev => {
      return prev.map(p => {
        const matchingItems = items.filter(it => it.id === p.id);
        if (matchingItems.length > 0) {
          const totalQtyBought = matchingItems.reduce((s, it) => s + it.quantity, 0);
          return {
            ...p,
            stock: Math.max(0, (p.stock || 10) - totalQtyBought)
          };
        }
        return p;
      });
    });

    // Add Order to List
    setOrders(prev => [newOrder, ...prev]);

    // Add Notification
    setNotifications(prev => [
      {
        id: 'notif-' + Date.now(),
        title: `Order ${orderId} Confirmed!`,
        message: `Your payment via ${paymentMethod} was successful. Tracking is live.`,
        time: 'Just now',
        read: false,
        type: 'order'
      },
      ...prev
    ]);

    // Confetti celebration
    try {
      confetti({
        particleCount: 110,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    // Clear cart & applied coupon if it was standard cart
    if (!directCheckoutItem) {
      clearCart();
    }
    setDirectCheckoutItem(null);
    setIsCheckoutOpen(false);
    setRecentOrder(newOrder);

    addToast({
      type: 'success',
      title: 'Order Placed Successfully! 🚀',
      message: `Order #${orderId} has been confirmed.`
    });

    return newOrder;
  };

  // Product Reviews
  const addReview = (productId, { userName, rating, comment }) => {
    const newRev = {
      id: 'rev-' + Date.now(),
      userName: userName || user.name || 'Verified Buyer',
      avatar: user.avatar,
      rating: Number(rating) || 5,
      date: new Date().toISOString().split('T')[0],
      verified: true,
      comment
    };

    setReviews(prev => {
      const existing = prev[productId] || [];
      return {
        ...prev,
        [productId]: [newRev, ...existing]
      };
    });

    // Recalculate product rating
    setProducts(prev => {
      return prev.map(p => {
        if (p.id === productId) {
          const currentList = reviews[productId] || [];
          const allRatings = [newRev.rating, ...currentList.map(r => r.rating)];
          const newAvg = (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1);
          return {
            ...p,
            rating: Number(newAvg),
            reviewCount: (p.reviewCount || 0) + 1
          };
        }
        return p;
      });
    });

    addToast({
      type: 'success',
      title: 'Review Submitted ⭐',
      message: 'Thank you for sharing your authentic feedback!'
    });
  };

  // Admin Review Management
  const adminDeleteReview = (productId, reviewId) => {
    setReviews(prev => {
      const currentList = prev[productId] || [];
      return {
        ...prev,
        [productId]: currentList.filter(r => r.id !== reviewId)
      };
    });
    addToast({ type: 'info', title: 'Review Deleted', message: 'Review has been removed.' });
  };

  const adminReplyReview = (productId, reviewId, replyText) => {
    setReviews(prev => {
      const currentList = prev[productId] || [];
      const updated = currentList.map(r => r.id === reviewId ? { ...r, adminReply: replyText } : r);
      return {
        ...prev,
        [productId]: updated
      };
    });
    addToast({ type: 'success', title: 'Reply Published', message: 'Merchant response added.' });
  };

  // User Addresses
  const addAddress = (addr) => {
    const newAddr = {
      ...addr,
      id: 'addr-' + Date.now()
    };
    safeSetUser(prev => {
      let list = [...(prev.addresses || [])];
      if (newAddr.isDefault) {
        list = list.map(a => ({ ...a, isDefault: false }));
      }
      return { ...prev, addresses: [...list, newAddr] };
    });
    addToast({ type: 'success', title: 'Address Saved', message: 'New delivery address added.' });
  };

  const updateAddress = (addrId, updated) => {
    safeSetUser(prev => {
      let list = (prev.addresses || []).map(a => (a.id === addrId ? { ...a, ...updated } : a));
      if (updated.isDefault) {
        list = list.map(a => (a.id === addrId ? a : { ...a, isDefault: false }));
      }
      return { ...prev, addresses: list };
    });
    addToast({ type: 'info', title: 'Address Updated', message: 'Delivery address modified.' });
  };

  const deleteAddress = (addrId) => {
    safeSetUser(prev => ({
      ...prev,
      addresses: (prev.addresses || []).filter(a => a.id !== addrId)
    }));
    addToast({ type: 'info', title: 'Address Removed', message: 'Saved address deleted.' });
  };

  const setDefaultAddress = (addrId) => {
    safeSetUser(prev => ({
      ...prev,
      addresses: (prev.addresses || []).map(a => ({ ...a, isDefault: a.id === addrId }))
    }));
  };

  // Returns / Refund Request
  const requestReturn = (orderId, reason) => {
    setOrders(prev => {
      return prev.map(ord => {
        if (ord.id === orderId) {
          return {
            ...ord,
            returnRequested: true,
            returnReason: reason,
            returnStatus: 'Return In Review'
          };
        }
        return ord;
      });
    });

    addToast({
      type: 'info',
      title: 'Return Request Initiated',
      message: `Return for order ${orderId} is being reviewed by our concierge.`
    });
  };

  // Admin Actions
  const adminAddProduct = (newProd) => {
    const id = 'prod-' + (products.length + 1) + '-' + Math.floor(Math.random() * 100);
    const prod = {
      ...newProd,
      id,
      rating: 5.0,
      reviewCount: 1,
      images: newProd.images && newProd.images.length > 0 ? newProd.images : [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
      ]
    };
    setProducts(prev => [prod, ...prev]);
    addToast({ type: 'success', title: 'Product Added 📦', message: `${prod.name} is now live.` });
  };

  const adminUpdateProduct = (id, updatedFields) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    addToast({ type: 'info', title: 'Product Updated', message: 'Changes saved to storefront.' });
  };

  const adminDeleteProduct = (id) => {
    const target = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    addToast({
      type: 'info',
      title: 'Product Deleted',
      message: target ? `${target.name.substring(0, 20)}... removed` : 'Product removed'
    });
  };

  const adminUpdateInventory = (productId, newStock) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: Math.max(0, Number(newStock)) } : p));
    addToast({ type: 'success', title: 'Stock Updated', message: `Inventory adjusted to ${newStock} units.` });
  };

  const adminAddCategory = (catData) => {
    const id = catData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newCat = {
      id,
      name: catData.name,
      icon: catData.icon || 'Sparkles',
      count: 0
    };
    setCategories(prev => [...prev, newCat]);
    addToast({ type: 'success', title: 'Category Created 🏷️', message: `${catData.name} added.` });
  };

  const adminDeleteCategory = (catId) => {
    if (catId === 'all') return;
    setCategories(prev => prev.filter(c => c.id !== catId));
    addToast({ type: 'info', title: 'Category Removed', message: `Category deleted.` });
  };

  const adminUpdateOrderStatus = (orderId, newStatus, newStep) => {
    setOrders(prev => {
      return prev.map(ord => {
        if (ord.id === orderId) {
          const updatedTimeline = ord.timeline.map((step, idx) => {
            if (idx + 1 <= newStep) {
              return { ...step, done: true, time: step.time.includes('Pending') ? 'Updated Today' : step.time };
            }
            return step;
          });
          return {
            ...ord,
            status: newStatus,
            statusStep: newStep,
            timeline: updatedTimeline
          };
        }
        return ord;
      });
    });

    addToast({
      type: 'success',
      title: 'Order Status Updated',
      message: `Order ${orderId} is now marked as "${newStatus}".`
    });
  };

  const adminProcessReturn = (orderId, decision, notes = '') => {
    setOrders(prev => {
      return prev.map(ord => {
        if (ord.id === orderId) {
          return {
            ...ord,
            returnStatus: decision === 'approved' ? 'Refund Processed & Approved' : 'Return Claim Rejected',
            returnDecisionNotes: notes,
            status: decision === 'approved' ? 'Returned & Refunded' : ord.status
          };
        }
        return ord;
      });
    });

    addToast({
      type: decision === 'approved' ? 'success' : 'info',
      title: decision === 'approved' ? 'Refund Approved 💳' : 'Claim Rejected',
      message: `Order ${orderId} return claim has been ${decision}.`
    });
  };

  const adminAddCoupon = (couponData) => {
    setCoupons(prev => [couponData, ...prev]);
    addToast({ type: 'success', title: 'Coupon Created 🎟️', message: `Code ${couponData.code} is active.` });
  };

  const adminToggleCoupon = (code) => {
    setCoupons(prev => prev.map(c => c.code === code ? { ...c, active: !c.active } : c));
  };

  const adminDeleteCoupon = (code) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
    addToast({ type: 'info', title: 'Coupon Deleted', message: `Code ${code} removed.` });
  };

  // Direct Buy Now trigger — requires login
  const buyNow = (product, color = null, size = null) => {
    if (!user) {
      addToast({ type: 'error', title: 'Login Required', message: 'Please sign in to place an order.' });
      return;
    }
    const selectedColor = color || (product.colors && product.colors[0]?.name) || 'Default';
    const selectedSize = size || (product.sizes && product.sizes[0]) || 'Standard';

    const singleItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images ? product.images[0] : '',
      color: selectedColor,
      size: selectedSize,
      quantity: 1,
      maxStock: product.stock || 99,
      category: product.category
    };

    setDirectCheckoutItem(singleItem);
    setIsCheckoutOpen(true);
  };

  // Value Bundle
  const value = {
    theme,
    setTheme,
    toggleTheme,
    currentView,
    setCurrentView,
    adminAuth,
    adminLogin,
    adminLogout,
    changeAdminPassword,
    updateAdminProfile,
    products,
    categories,
    reviews,
    coupons,
    user,
    setUser,
    orders,
    cart,
    wishlist,
    notifications,
    recentlyViewed,
    appliedCoupon,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    minRating,
    setMinRating,
    inStockOnly,
    setInStockOnly,
    sortBy,
    setSortBy,
    activeProductId,
    setActiveProductId,
    isCartOpen,
    setIsCartOpen,
    isCheckoutOpen,
    setIsCheckoutOpen,
    directCheckoutItem,
    setDirectCheckoutItem,
    recentOrder,
    setRecentOrder,
    trackingOrderId,
    setTrackingOrderId,
    reviewProductId,
    setReviewProductId,
    isAiAssistantOpen,
    setIsAiAssistantOpen,
    isNotificationsOpen,
    setIsNotificationsOpen,
    toasts,
    addToast,
    removeToast,
    recordRecentlyViewed,
    toggleWishlist,
    getCartTotals,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    placeOrder,
    addReview,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    requestReturn,
    adminAddProduct,
    adminUpdateProduct,
    adminDeleteProduct,
    adminUpdateInventory,
    adminAddCategory,
    adminDeleteCategory,
    adminUpdateOrderStatus,
    adminProcessReturn,
    adminDeleteReview,
    adminReplyReview,
    adminAddCoupon,
    adminToggleCoupon,
    adminDeleteCoupon,
    isLoadingProducts,
    totalProducts,
    hasMoreProducts,
    loadMoreProducts,
    fetchProducts,
    fetchCategories,
    buyNow,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};
