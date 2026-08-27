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
  
  // Toast notifications
  const [toasts, setToasts] = useState([]);

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
    
    // Utility functions
    loadMoreProducts,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};
