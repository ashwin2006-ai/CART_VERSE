import React, { useMemo, useState, useEffect } from 'react';
import { useShop } from './context/ShopContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryBar } from './components/CategoryBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ReviewModal } from './components/ReviewModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AccountView } from './components/AccountView';
import { UserLoginPage } from './components/UserLoginPage';
import { AiAssistant } from './components/AiAssistant';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { SupportCenter } from './components/SupportCenter';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';
import {
  ChevronRight, Search, X, Loader2, ChevronDown, ArrowUp
} from 'lucide-react';

// ├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼ Back to Top ├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼
const BackToTop = ({ isDark }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const h = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  if (!visible) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        position: 'fixed', bottom: 'calc(60px + env(safe-area-inset-bottom, 0px) + 16px)', left: '16px', zIndex: 1200,
        width: '40px', height: '40px', borderRadius: '50%',
        background: isDark ? '#1e293b' : '#ffffff',
        border: `1.5px solid ${isDark ? '#334155' : '#e5e7eb'}`,
        color: isDark ? '#94a3b8' : '#374151',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.1)',
        transition: 'all 0.2s',
      }}
      title="Back to top"
    >
      <ArrowUp size={17} />
    </button>
  );
};


// ├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼ Section Header ├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼
const SectionHeader = ({ title, subtitle, onViewAll, isDark }) => (
  <div style={{
    display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
    marginBottom: '16px', padding: '0 2px',
  }}>
    <div>
      <h2 style={{
        fontSize: 'clamp(1rem, 3vw, 1.2rem)', fontWeight: 800,
        color: isDark ? '#f1f5f9' : '#111827',
        letterSpacing: '-0.02em', margin: 0,
        fontFamily: "'Inter', sans-serif",
      }}>{title}</h2>
      {subtitle && (
        <p style={{ fontSize: '0.78rem', color: isDark ? '#64748b' : '#9ca3af', margin: '3px 0 0', fontWeight: 400 }}>{subtitle}</p>
      )}
    </div>
    {onViewAll && (
      <button onClick={onViewAll} style={{
        display: 'flex', alignItems: 'center', gap: '4px',
        color: '#6C63FF', fontSize: '0.8rem', fontWeight: 700,
        flexShrink: 0, paddingBottom: '2px',
      }}>
        View all <ChevronRight size={14} />
      </button>
    )}
  </div>
);

// ├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼ Product Grid ├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼
const ProductGrid = ({ products: prods, isLoading, hasMore, onLoadMore, totalCount, isDark }) => (
  <section>
    {isLoading && prods.length === 0 ? (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <Loader2 size={32} style={{ color: '#6C63FF', animation: 'spin 1s linear infinite', marginBottom: '12px' }} />
        <p style={{ color: isDark ? '#64748b' : '#9ca3af', fontSize: '0.88rem' }}>Loading products...</p>
      </div>
    ) : prods.length === 0 ? (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>├░┼╕ΓÇ¥┬ì</div>
        <h3 style={{ fontWeight: 700, color: isDark ? '#f1f5f9' : '#111827', marginBottom: '6px' }}>No Products Found</h3>
        <p style={{ color: isDark ? '#64748b' : '#9ca3af', fontSize: '0.84rem' }}>Try adjusting your search or filters.</p>
      </div>
    ) : (
      <>
        <div className="product-grid">
          {prods.map(p => <ProductCard key={p.id} product={p} />)}
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.78rem', color: isDark ? '#64748b' : '#9ca3af' }}>
          Showing <strong style={{ color: isDark ? '#f1f5f9' : '#111827' }}>{prods.length}</strong> of <strong style={{ color: isDark ? '#f1f5f9' : '#111827' }}>{totalCount}</strong> products
        </div>

        {hasMore && (
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button
              onClick={onLoadMore}
              disabled={isLoading}
              style={{
                padding: '11px 32px', borderRadius: '10px',
                background: '#6C63FF', color: '#fff',
                fontWeight: 700, fontSize: '0.88rem',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                opacity: isLoading ? 0.7 : 1,
                boxShadow: '0 4px 16px rgba(108,99,255,0.3)',
              }}
            >
              {isLoading ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <ChevronDown size={15} />}
              {isLoading ? 'Loading...' : 'Load More Products'}
            </button>
          </div>
        )}
      </>
    )}
  </section>
);

// ├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼ Main App ├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼├óΓÇ¥Γé¼
export function App() {
  const {
    currentView, user, products, theme,
    searchQuery, setSearchQuery,
    selectedCategory, setSelectedCategory,
    minRating, setMinRating,
    inStockOnly, setInStockOnly,
    sortBy, setSortBy,
    recentlyViewed,
    isLoadingProducts, totalProducts, hasMoreProducts, loadMoreProducts,
    setCurrentView,
  } = useShop();

  // Admin state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [adminView, setAdminView] = useState('dashboard');

  // Check if admin is logged in on mount
  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token');
    const adminUserData = localStorage.getItem('admin_user');
    
    if (adminToken && adminUserData) {
      try {
        setIsAdminLoggedIn(true);
        setAdminUser(JSON.parse(adminUserData));
      } catch (e) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      }
    }
  }, []);

  // Check URL on mount and update view accordingly
  useEffect(() => {
    const checkPath = () => {
      const pathname = window.location.pathname;
      const hash = window.location.hash.replace('#', '').toLowerCase().trim();
      
      // Handle admin route - MUST BE CHECKED FIRST
      if (pathname === '/admin' || pathname.endsWith('/admin')) {
        // Admin route - check if logged in
        const adminToken = localStorage.getItem('admin_token');
        if (!adminToken) {
          // Not logged in, redirect to admin login
          window.location.pathname = '/admin';
          return;
        }
        // Logged in, show admin panel (handled in return statement)
        return;
      }
      
      // Check pathname for customer routes
      if (pathname === '/account' || pathname.endsWith('/account')) {
        setCurrentView('account');
      } else if (pathname === '/support' || pathname.endsWith('/support')) {
        setCurrentView('support');
      } else if (pathname === '/debug-env' || pathname.endsWith('/debug-env')) {
        setCurrentView('debug-env');
      } 
      // Check hash for backwards compatibility (#account, etc)
      else if (hash === 'account') {
        setCurrentView('account');
      } else if (hash === 'support') {
        setCurrentView('support');
      } else if (hash === 'debug-env') {
        setCurrentView('debug-env');
      } else {
        // Default to store view for empty hash or root
        setCurrentView('store');
      }
    };
    checkPath();
    window.addEventListener('hashchange', checkPath);
    window.addEventListener('popstate', checkPath);
    return () => {
      window.removeEventListener('hashchange', checkPath);
      window.removeEventListener('popstate', checkPath);
    };
  }, [setCurrentView]);

  const isDark = theme === 'dark';
  const bg = isDark ? '#0b0f1a' : '#f7f8fa';
  const cardBg = isDark ? '#0f172a' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.07)' : '#e5e7eb';
  const text = isDark ? '#f1f5f9' : '#111827';
  const muted = isDark ? '#64748b' : '#9ca3af';

  const [showAuthModal, setShowAuthModal] = useState(false);
  useEffect(() => {
    const handler = () => setShowAuthModal(true);
    window.addEventListener('cartverse:open-auth', handler);
    return () => window.removeEventListener('cartverse:open-auth', handler);
  }, []);

  const filteredProducts = useMemo(() => {
    let list = [...(products || [])];
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p && p.name && (
        p.name.toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
      ));
    }
    if (selectedCategory && selectedCategory !== 'all') list = list.filter(p => p && p.category === selectedCategory);
    if (minRating > 0) list = list.filter(p => p && p.rating >= minRating);
    if (inStockOnly) list = list.filter(p => p && p.stock > 0);
    switch (sortBy) {
      case 'price-low':  list.sort((a, b) => (a?.price || 0) - (b?.price || 0)); break;
      case 'price-high': list.sort((a, b) => (b?.price || 0) - (a?.price || 0)); break;
      case 'rating':     list.sort((a, b) => (b?.rating || 0) - (a?.rating || 0)); break;
      case 'newest':     list.sort((a, b) => (b?.isNew ? 1 : 0) - (a?.isNew ? 1 : 0)); break;
      default: break;
    }
    return list;
  }, [products, searchQuery, selectedCategory, minRating, inStockOnly, sortBy]);

  const isFiltered = !!(searchQuery || (selectedCategory && selectedCategory !== 'all'));

  const featured   = useMemo(() => (products || []).filter(p => p && p.featured).slice(0, 8), [products]);
  const dealProds  = useMemo(() => (products || []).filter(p => p && (p.dealOfTheDay || p.discount >= 25)).slice(0, 8), [products]);
  const bestSell   = useMemo(() => (products || []).filter(p => p && p.bestSeller).slice(0, 8), [products]);
  const newArrivals= useMemo(() => (products || []).filter(p => p && p.isNew).slice(0, 8), [products]);
  const recentProds= useMemo(() => (products || []).filter(p => p && recentlyViewed.includes(p.id)).slice(0, 4), [products, recentlyViewed]);

  // No debug page needed - using localStorage only

  // Admin routes
  const adminPath = window.location.pathname === '/admin' || window.location.pathname.endsWith('/admin');
  
  if (adminPath) {
    if (!isAdminLoggedIn) {
      return <AdminLogin onLoginSuccess={(userData) => {
        setIsAdminLoggedIn(true);
        setAdminUser(userData);
        window.history.pushState(null, '', '/admin');
      }} />;
    }
    
    return <AdminPanel 
      adminUser={adminUser} 
      onLogout={() => {
        setIsAdminLoggedIn(false);
        setAdminUser(null);
        window.location.href = '/';
      }} 
    />;
  }

  return (
    <ErrorBoundary>
      <div style={{ minHeight: '100vh', background: bg, paddingBottom: 'clamp(68px, 60px + env(safe-area-inset-bottom), 100px)', fontFamily: "'Inter', sans-serif" }}>
        <ToastContainer />
        <Navbar />

      <main>
        {currentView === 'store' && (
          <>
            <CategoryBar />

            {/* ├óΓÇ¥Γé¼├óΓÇ¥Γé¼ Filtered / Search Results ├óΓÇ¥Γé¼├óΓÇ¥Γé¼ */}
            {isFiltered ? (
              <div style={{ padding: '16px 12px', maxWidth: '1400px', margin: '0 auto' }}>
                {/* Filter bar */}
                <div style={{
                  background: cardBg,
                  borderRadius: '12px',
                  padding: '12px 16px',
                  marginBottom: '16px',
                  border: `1px solid ${border}`,
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px',
                }}>
                  <div>
                    <h2 style={{ fontSize: '0.98rem', fontWeight: 700, color: text, margin: 0 }}>
                      {searchQuery ? `Results for "${searchQuery}"` : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                    </h2>
                    <span style={{ fontSize: '0.76rem', color: muted }}>
                      {filteredProducts.length.toLocaleString()} products found
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                      style={{ padding: '7px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, border: `1px solid ${border}`, background: cardBg, color: text, outline: 'none' }}>
                      <option value="featured">Relevance</option>
                      <option value="price-low">Price ├óΓÇáΓÇÿ</option>
                      <option value="price-high">Price ├óΓÇáΓÇ£</option>
                      <option value="rating">Top Rated</option>
                      <option value="newest">Newest</option>
                    </select>
                    <select value={minRating} onChange={e => setMinRating(Number(e.target.value))}
                      style={{ padding: '7px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, border: `1px solid ${border}`, background: cardBg, color: text, outline: 'none' }}>
                      <option value={0}>All Ratings</option>
                      <option value={4}>4├ó╦£ΓÇª & above</option>
                      <option value={4.5}>4.5├ó╦£ΓÇª & above</option>
                    </select>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', color: text }}>
                      <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} style={{ accentColor: '#6C63FF' }} />
                      In Stock
                    </label>
                    <button
                      onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setMinRating(0); setInStockOnly(false); setSortBy('featured'); }}
                      style={{ fontSize: '0.76rem', color: '#6C63FF', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}
                    >
                      <X size={13} /> Clear
                    </button>
                  </div>
                </div>

                <ProductGrid
                  products={filteredProducts}
                  isLoading={isLoadingProducts}
                  hasMore={false}
                  totalCount={filteredProducts.length}
                  isDark={isDark}
                />
              </div>

            ) : (
              /* ├óΓÇ¥Γé¼├óΓÇ¥Γé¼ Homepage ├óΓÇ¥Γé¼├óΓÇ¥Γé¼ */
              <>
                <HeroBanner />

                <div style={{ padding: '16px 12px 0', maxWidth: '1400px', margin: '0 auto' }}>

                  {/* Recently Viewed */}
                  {recentProds.length > 0 && (
                    <section style={{ marginBottom: '28px' }}>
                      <SectionHeader title="Recently Viewed" subtitle="Continue where you left off" isDark={isDark} />
                      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 480 ? 'repeat(2, 1fr)' : window.innerWidth < 768 ? 'repeat(3, 1fr)' : 'repeat(auto-fill, minmax(200px, 1fr))', gap: window.innerWidth < 480 ? '12px' : '16px' }}>
                        {recentProds.map(p => <ProductCard key={p.id} product={p} compact />)}
                      </div>
                    </section>
                  )}

                  {/* Top Picks */}
                  {featured.length > 0 && (
                    <section style={{ marginBottom: '28px' }}>
                      <SectionHeader
                        title="Top Picks For You"
                        subtitle="Handpicked premium selections"
                        onViewAll={() => setSelectedCategory('all')}
                        isDark={isDark}
                      />
                      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 480 ? 'repeat(2, 1fr)' : window.innerWidth < 768 ? 'repeat(3, 1fr)' : 'repeat(auto-fill, minmax(200px, 1fr))', gap: window.innerWidth < 480 ? '12px' : '16px' }}>
                        {featured.map(p => <ProductCard key={p.id} product={p} />)}
                      </div>
                    </section>
                  )}



                  {/* Best Sellers */}
                  {bestSell.length > 0 && (
                    <section style={{ marginBottom: '28px' }}>
                      <SectionHeader
                        title="Best Sellers"
                        subtitle="What everyone is buying"
                        onViewAll={() => setSelectedCategory('all')}
                        isDark={isDark}
                      />
                      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 480 ? 'repeat(2, 1fr)' : window.innerWidth < 768 ? 'repeat(3, 1fr)' : 'repeat(auto-fill, minmax(200px, 1fr))', gap: window.innerWidth < 480 ? '12px' : '16px' }}>
                        {bestSell.map(p => <ProductCard key={p.id} product={p} />)}
                      </div>
                    </section>
                  )}

                  {/* New Arrivals */}
                  {newArrivals.length > 0 && (
                    <section style={{ marginBottom: '28px' }}>
                      <SectionHeader
                        title="New Arrivals"
                        subtitle="Fresh products just landed"
                        onViewAll={() => setSortBy('newest')}
                        isDark={isDark}
                      />
                      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 480 ? 'repeat(2, 1fr)' : window.innerWidth < 768 ? 'repeat(3, 1fr)' : 'repeat(auto-fill, minmax(200px, 1fr))', gap: window.innerWidth < 480 ? '12px' : '16px' }}>
                        {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
                      </div>
                    </section>
                  )}

                  {/* Divider */}
                  <div style={{ height: '1px', background: border, margin: '4px 0 20px' }} />

                  {/* All Products */}
                  <section style={{ marginBottom: '28px' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      marginBottom: '16px', flexWrap: 'wrap', gap: '10px',
                    }}>
                      <div>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: text, margin: 0, letterSpacing: '-0.02em', fontFamily: "'Inter', sans-serif" }}>
                          All Products
                        </h2>
                        <span style={{ fontSize: '0.76rem', color: muted }}>
                          {(totalProducts || products.length).toLocaleString()} items available
                        </span>
                      </div>
                      <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                        style={{ padding: '7px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, border: `1px solid ${border}`, background: cardBg, color: text, outline: 'none' }}>
                        <option value="featured">Featured</option>
                        <option value="price-low">Price ├óΓÇáΓÇÿ</option>
                        <option value="price-high">Price ├óΓÇáΓÇ£</option>
                        <option value="rating">Top Rated</option>
                        <option value="newest">Newest</option>
                      </select>
                    </div>
                    <ProductGrid
                      products={filteredProducts.length > 0 ? filteredProducts : products}
                      isLoading={isLoadingProducts}
                      hasMore={hasMoreProducts}
                      onLoadMore={loadMoreProducts}
                      totalCount={totalProducts || products.length}
                      isDark={isDark}
                    />
                  </section>

                </div>
              </>
            )}
          </>
        )}

        {currentView === 'account' && <AccountView />}
        {currentView === 'support' && <SupportCenter />}
      </main>

      {/* Modals */}
      <ProductDetailModal />
      <ReviewModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderConfirmationModal />
      <OrderTrackingModal />
      <AiAssistant />
      <MobileBottomNav />
      <Footer />

      {/* Auth modal triggered from checkout guard */}
      <CustomerAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="login"
      />

      {/* Back to top */}
      <BackToTop isDark={isDark} />
      
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        button { background: none; border: none; cursor: pointer; font-family: 'Inter', sans-serif; }
        input, select, textarea { font-family: 'Inter', sans-serif; }
      `}</style>
      </div>
    </ErrorBoundary>
  );
}

export default App;
