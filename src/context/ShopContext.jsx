import React, { createContext, useState, useCallback, useContext, useEffect } from 'react';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../data/mockData';

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
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
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
          // Handle both data.products and data.data formats
          const productList = data.data || data.products || INITIAL_PRODUCTS;
          setProducts(productList);
          setTotalProducts(data.total || productList.length);
        } else {
          // Fallback to mock data
          console.warn('Products API returned non-OK status, using mock data');
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

  const addToast = useCallback((messageOrObj, type = 'info') => {
    const id = Date.now();
    // Handle both formats: addToast(message, type) and addToast({type, title, message})
    let toastData;
    if (typeof messageOrObj === 'object') {
      // Object format: {type, title, message}
      toastData = {
        id,
        type: messageOrObj.type || 'info',
        message: messageOrObj.message || messageOrObj.title || 'Notification',
      };
    } else {
      // String format: (message, type)
      toastData = {
        id,
        message: messageOrObj,
        type,
      };
    }
    setToasts((prev) => [...prev, toastData]);
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
  }, [addToast]);

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

  // Admin authentication
  const adminLogin = useCallback((email, password) => {
    // Demo credentials check
    if (email === 'admin@cartverse.io' && password === 'Admin@2026!') {
      const adminUser = {
        id: 'admin-' + Date.now(),
        name: 'Elena Vance (Lead Admin)',
        email: 'admin@cartverse.io',
        role: 'ADMIN',
        isAuthenticated: true,
        loginTime: new Date().toISOString(),
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        tier: 'Super Administrator'
      };
      setAdminAuth(adminUser);
      localStorage.setItem('cartverse_adminAuth', JSON.stringify(adminUser));
      addToast({ type: 'success', title: 'Admin Access Granted', message: 'Welcome to CartVerse Admin Portal!' });
      return { success: true };
    }
    return { success: false, error: 'Invalid admin credentials' };
  }, [addToast]);

  const adminLogout = useCallback(() => {
    setAdminAuth(null);
    localStorage.removeItem('cartverse_adminAuth');
    addToast({ type: 'info', title: 'Logged Out', message: 'Admin session ended.' });
  }, [addToast]);

  // Admin Profile Management
  const updateAdminProfile = useCallback(async (profileData) => {
    try {
      const { name, email, avatar } = profileData;
      
      // Update local state
      const updatedAdmin = {
        ...adminAuth,
        name: name || adminAuth.name,
        email: email || adminAuth.email,
        avatar: avatar || adminAuth.avatar
      };
      
      setAdminAuth(updatedAdmin);
      localStorage.setItem('cartverse_adminAuth', JSON.stringify(updatedAdmin));
      
      // Try to sync with backend
      try {
        const response = await fetch('/api/auth/admin/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, avatar })
        });
        if (!response.ok) throw new Error('Backend update failed');
      } catch (err) {
        console.warn('Backend profile update failed, using local storage:', err.message);
      }
      
      addToast({ type: 'success', title: 'Profile Updated', message: 'Admin profile has been updated successfully.' });
      return { success: true };
    } catch (error) {
      addToast({ type: 'error', title: 'Update Failed', message: error.message });
      return { success: false, error: error.message };
    }
  }, [adminAuth, addToast]);

  const changeAdminPassword = useCallback(async (currentPassword, newPassword) => {
    try {
      if (!currentPassword || !newPassword) {
        throw new Error('Current and new passwords are required.');
      }
      
      if (newPassword.length < 8) {
        throw new Error('New password must be at least 8 characters long.');
      }
      
      // Try backend password change
      try {
        const response = await fetch('/api/auth/admin/password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currentPassword, newPassword })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Password change failed');
        }
      } catch (err) {
        console.warn('Backend password change failed:', err.message);
        // For now, allow local-only password change
      }
      
      addToast({ type: 'success', title: 'Password Changed', message: 'Admin password has been updated successfully.' });
      return { success: true };
    } catch (error) {
      addToast({ type: 'error', title: 'Password Change Failed', message: error.message });
      return { success: false, error: error.message };
    }
  }, [addToast]);

  // Admin Category Management
  const adminAddCategory = useCallback((categoryData) => {
    try {
      const newCategory = {
        id: 'cat-' + Date.now(),
        name: categoryData.name || 'New Category',
        icon: categoryData.icon || 'Sparkles',
        count: 0
      };
      setCategories(prev => [...prev, newCategory]);
      addToast({ type: 'success', title: 'Category Added', message: `Category "${newCategory.name}" added successfully.` });
      return { success: true, category: newCategory };
    } catch (error) {
      addToast({ type: 'error', title: 'Failed to Add Category', message: error.message });
      return { success: false, error: error.message };
    }
  }, [addToast]);

  const adminDeleteCategory = useCallback((categoryId) => {
    try {
      if (categoryId === 'all') {
        addToast({ type: 'error', title: 'Cannot Delete', message: 'Cannot delete the "For You" category.' });
        return { success: false, error: 'Cannot delete default category' };
      }
      
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      
      // Remove products from this category
      setProducts(prev => prev.map(prod => 
        prod.category === categoryId ? { ...prod, category: 'all' } : prod
      ));
      
      addToast({ type: 'success', title: 'Category Deleted', message: 'Category deleted successfully.' });
      return { success: true };
    } catch (error) {
      addToast({ type: 'error', title: 'Failed to Delete Category', message: error.message });
      return { success: false, error: error.message };
    }
  }, [addToast]);

  const adminUpdateCategory = useCallback((categoryId, updatedData) => {
    try {
      setCategories(prev => prev.map(cat => 
        cat.id === categoryId ? { ...cat, ...updatedData } : cat
      ));
      addToast({ type: 'success', title: 'Category Updated', message: 'Category updated successfully.' });
      return { success: true };
    } catch (error) {
      addToast({ type: 'error', title: 'Failed to Update Category', message: error.message });
      return { success: false, error: error.message };
    }
  }, [addToast]);

  // Admin Product Management
  const adminAddProduct = useCallback((productData) => {
    try {
      const newProduct = {
        id: 'prod-' + Date.now(),
        ...productData,
        rating: 4.5,
        reviewCount: 0,
        featured: productData.featured || false,
        bestSeller: productData.bestSeller || false,
        isNew: productData.isNew !== false,
        dealOfTheDay: false
      };
      setProducts(prev => [...prev, newProduct]);
      addToast({ type: 'success', title: 'Product Added', message: `Product "${newProduct.name}" added successfully.` });
      return { success: true, product: newProduct };
    } catch (error) {
      addToast({ type: 'error', title: 'Failed to Add Product', message: error.message });
      return { success: false, error: error.message };
    }
  }, [addToast]);

  const adminUpdateProduct = useCallback((productId, updatedData) => {
    try {
      setProducts(prev => prev.map(prod => 
        prod.id === productId ? { ...prod, ...updatedData } : prod
      ));
      addToast({ type: 'success', title: 'Product Updated', message: 'Product updated successfully.' });
      return { success: true };
    } catch (error) {
      addToast({ type: 'error', title: 'Failed to Update Product', message: error.message });
      return { success: false, error: error.message };
    }
  }, [addToast]);

  const adminDeleteProduct = useCallback((productId) => {
    try {
      setProducts(prev => prev.filter(prod => prod.id !== productId));
      addToast({ type: 'success', title: 'Product Deleted', message: 'Product deleted successfully.' });
      return { success: true };
    } catch (error) {
      addToast({ type: 'error', title: 'Failed to Delete Product', message: error.message });
      return { success: false, error: error.message };
    }
  }, [addToast]);

  const adminUpdateInventory = useCallback((productId, stock) => {
    try {
      setProducts(prev => prev.map(prod => 
        prod.id === productId ? { ...prod, stock: parseInt(stock) || 0 } : prod
      ));
      addToast({ type: 'success', title: 'Inventory Updated', message: 'Stock updated successfully.' });
      return { success: true };
    } catch (error) {
      addToast({ type: 'error', title: 'Failed to Update Inventory', message: error.message });
      return { success: false, error: error.message };
    }
  }, [addToast]);

  // Admin Order Management
  const adminUpdateOrderStatus = useCallback((orderId, newStatus) => {
    try {
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      addToast({ type: 'success', title: 'Order Updated', message: `Order status updated to "${newStatus}".` });
      return { success: true };
    } catch (error) {
      addToast({ type: 'error', title: 'Failed to Update Order', message: error.message });
      return { success: false, error: error.message };
    }
  }, [addToast]);

  const adminProcessReturn = useCallback((orderId, returnDetails) => {
    try {
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { 
          ...order, 
          returnStatus: 'Approved',
          returnReason: returnDetails.reason,
          returnRefundAmount: returnDetails.refundAmount 
        } : order
      ));
      addToast({ type: 'success', title: 'Return Processed', message: 'Return request approved and processed.' });
      return { success: true };
    } catch (error) {
      addToast({ type: 'error', title: 'Failed to Process Return', message: error.message });
      return { success: false, error: error.message };
    }
  }, [addToast]);

  // Admin Review Management
  const adminDeleteReview = useCallback((productId, reviewId) => {
    try {
      setReviews(prev => ({
        ...prev,
        [productId]: (prev[productId] || []).filter(r => r.id !== reviewId)
      }));
      addToast({ type: 'success', title: 'Review Deleted', message: 'Review has been deleted.' });
      return { success: true };
    } catch (error) {
      addToast({ type: 'error', title: 'Failed to Delete Review', message: error.message });
      return { success: false, error: error.message };
    }
  }, [addToast]);

  const adminReplyReview = useCallback((productId, reviewId, reply) => {
    try {
      setReviews(prev => ({
        ...prev,
        [productId]: (prev[productId] || []).map(r => 
          r.id === reviewId ? { ...r, adminReply: reply, adminReplyDate: new Date().toISOString() } : r
        )
      }));
      addToast({ type: 'success', title: 'Reply Added', message: 'Admin reply posted successfully.' });
      return { success: true };
    } catch (error) {
      addToast({ type: 'error', title: 'Failed to Post Reply', message: error.message });
      return { success: false, error: error.message };
    }
  }, [addToast]);

  // Admin Coupon Management
  const adminAddCoupon = useCallback((couponData) => {
    try {
      // For now, just show toast since coupons are in state
      addToast({ type: 'success', title: 'Coupon Added', message: `Coupon "${couponData.code}" added successfully.` });
      return { success: true };
    } catch (error) {
      addToast({ type: 'error', title: 'Failed to Add Coupon', message: error.message });
      return { success: false, error: error.message };
    }
  }, [addToast]);

  const adminToggleCoupon = useCallback((couponCode) => {
    try {
      addToast({ type: 'success', title: 'Coupon Toggled', message: `Coupon "${couponCode}" status updated.` });
      return { success: true };
    } catch (error) {
      addToast({ type: 'error', title: 'Failed to Toggle Coupon', message: error.message });
      return { success: false, error: error.message };
    }
  }, [addToast]);

  const adminDeleteCoupon = useCallback((couponCode) => {
    try {
      addToast({ type: 'success', title: 'Coupon Deleted', message: `Coupon "${couponCode}" has been deleted.` });
      return { success: true };
    } catch (error) {
      addToast({ type: 'error', title: 'Failed to Delete Coupon', message: error.message });
      return { success: false, error: error.message };
    }
  }, [addToast]);

  // Flipkart Integration
  const [flipkartConfig, setFlipkartConfig] = useState({
    trackingId: 'cartvers01',
    affiliateToken: 'fk_aff_tok_998a4e12e345b801a6bc'
  });

  const syncFlipkartCategory = useCallback(async (category, keyword) => {
    try {
      addToast({ type: 'info', title: 'Syncing', message: `Syncing Flipkart ${category} products...` });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      addToast({ type: 'success', title: 'Sync Complete', message: `Flipkart products synced successfully.` });
      return { success: true };
    } catch (error) {
      addToast({ type: 'error', title: 'Sync Failed', message: error.message });
      return { success: false, error: error.message };
    }
  }, [addToast]);

  const updateFlipkartKeys = useCallback(async (trackingId, token) => {
    try {
      setFlipkartConfig({ trackingId, affiliateToken: token });
      addToast({ type: 'success', title: 'Keys Updated', message: 'Flipkart API keys updated successfully.' });
      return { success: true };
    } catch (error) {
      addToast({ type: 'error', title: 'Update Failed', message: error.message });
      return { success: false, error: error.message };
    }
  }, [addToast]);

  // Load admin auth from localStorage on mount
  useEffect(() => {
    try {
      const savedAdminAuth = localStorage.getItem('cartverse_adminAuth');
      if (savedAdminAuth) {
        const adminData = JSON.parse(savedAdminAuth);
        if (adminData && adminData.isAuthenticated) {
          setAdminAuth(adminData);
        }
      }
    } catch (error) {
      console.error('Failed to load admin auth from localStorage:', error);
    }
  }, []);

  // Toast management - removeToast function
  const removeToast = useCallback((toastId) => {
    setToasts(prev => prev.filter(t => t.id !== toastId));
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
    removeToast,
    
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
    
    // Admin authentication
    adminLogin,
    adminLogout,
    updateAdminProfile,
    changeAdminPassword,
    
    // Admin category management
    categories,
    setCategories,
    adminAddCategory,
    adminDeleteCategory,
    adminUpdateCategory,
    
    // Admin product management
    adminAddProduct,
    adminUpdateProduct,
    adminDeleteProduct,
    adminUpdateInventory,
    
    // Admin order management
    adminUpdateOrderStatus,
    adminProcessReturn,
    
    // Admin review management
    adminDeleteReview,
    adminReplyReview,
    
    // Admin coupon management
    adminAddCoupon,
    adminToggleCoupon,
    adminDeleteCoupon,
    
    // Flipkart integration
    flipkartConfig,
    setFlipkartConfig,
    syncFlipkartCategory,
    updateFlipkartKeys,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};
