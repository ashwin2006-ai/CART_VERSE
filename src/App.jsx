import React, { useMemo, useState, useEffect } from 'react';
import { useShop } from './context/ShopContext';
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
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';
import { AiAssistant } from './components/AiAssistant';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import {
  ChevronRight, Search, X, Loader2, ChevronDown, ArrowUp, HelpCircle
} from 'lucide-react';

// â”€â”€â”€ Back to Top â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
        position: 'fixed', bottom: '76px', left: '16px', zIndex: 1300,
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


// â”€â”€â”€ Section Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ Product Grid â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ProductGrid = ({ products: prods, isLoading, hasMore, onLoadMore, totalCount, isDark }) => (
  <section>
    {isLoading && prods.length === 0 ? (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <Loader2 size={32} style={{ color: '#6C63FF', animation: 'spin 1s linear infinite', marginBottom: '12px' }} />
        <p style={{ color: isDark ? '#64748b' : '#9ca3af', fontSize: '0.88rem' }}>Loading products...</p>
      </div>
    ) : prods.length === 0 ? (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>ðŸ”</div>
        <h3 style={{ fontWeight: 700, color: isDark ? '#f1f5f9' : '#111827', marginBottom: '6px' }}>No Products Found</h3>
        <p style={{ color: isDark ? '#64748b' : '#9ca3af', fontSize: '0.84rem' }}>Try adjusting your search or filters.</p>
      </div>
    ) : (
      <>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px',
          '@media (max-width: 768px)': {
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '12px',
          },
          '@media (max-width: 480px)': {
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '10px',
          }
        }}>
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

// â”€â”€â”€ Help Widget â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const HelpWidget = ({ isDark }) => {
  const [open, setOpen] = useState(false);
  const bg = isDark ? '#1e293b' : '#ffffff';
  const border = isDark ? '#334155' : '#e5e7eb';
  const text = isDark ? '#f1f5f9' : '#111827';
  const muted = isDark ? '#64748b' : '#9ca3af';

  const options = [
    { icon: MessageCircle, label: 'Live Chat', sub: 'Avg response: 2 min', color: '#6C63FF', action: () => alert('Chat support coming soon!') },
    { icon: Phone, label: 'Call Us', sub: '1800-XXX-XXXX (Toll free)', color: '#10b981', action: () => window.open('tel:18001234567') },
    { icon: Mail, label: 'Email Support', sub: 'support@cartverse.io', color: '#f59e0b', action: () => window.open('mailto:support@cartverse.io') },
  ];

  return (
    <div style={{ position: 'fixed', bottom: '76px', right: '16px', zIndex: 1300 }}>
      {open && (
        <div style={{
          position: 'absolute', bottom: '56px', right: 0,
          background: bg, border: `1px solid ${border}`,
          borderRadius: '16px', minWidth: '240px',
          boxShadow: isDark ? '0 12px 40px rgba(0,0,0,0.5)' : '0 12px 40px rgba(0,0,0,0.12)',
          overflow: 'hidden', animation: 'slideUp 0.2s ease',
        }}>
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${border}` }}>
            <div style={{ fontWeight: 800, color: text, fontSize: '0.88rem' }}>How can we help?</div>
            <div style={{ fontSize: '0.74rem', color: muted, marginTop: '2px' }}>We typically respond within minutes</div>
          </div>
          {options.map(opt => {
            const Icon = opt.icon;
            return (
              <button key={opt.label} onClick={opt.action}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 16px', textAlign: 'left', transition: 'background 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = isDark ? '#334155' : '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: `${opt.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={16} color={opt.color} />
                </div>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: text }}>{opt.label}</div>
                  <div style={{ fontSize: '0.72rem', color: muted, marginTop: '1px' }}>{opt.sub}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '46px', height: '46px', borderRadius: '50%',
          background: open ? '#374151' : '#6C63FF',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(108,99,255,0.4)',
          transition: 'all 0.2s',
          transform: open ? 'rotate(45deg)' : 'rotate(0)',
        }}
        title="Help & Support"
      >
        {open ? <X size={20} /> : <HelpCircle size={20} />}
      </button>
      <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

// â”€â”€â”€ Main App â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function App() {
  const {
    currentView, adminAuth, user, products, theme,
    searchQuery, setSearchQuery,
    selectedCategory, setSelectedCategory,
    minRating, setMinRating,
    inStockOnly, setInStockOnly,
    sortBy, setSortBy,
    recentlyViewed,
    isLoadingProducts, totalProducts, hasMoreProducts, loadMoreProducts,
    setCurrentView,
  } = useShop();

  // Check URL on mount and update view accordingly
  useEffect(() => {
    const checkPath = () => {
      if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
        setCurrentView('admin');
      } else if (window.location.pathname === '/account' || window.location.hash === '#account') {
        setCurrentView('account');
      } else {
        setCurrentView('store');
      }
    };
    checkPath();
    window.addEventListener('hashchange', checkPath);
    return () => window.removeEventListener('hashchange', checkPath);
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
    let list = [...products];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== 'all') list = list.filter(p => p.category === selectedCategory);
    if (minRating > 0) list = list.filter(p => p.rating >= minRating);
    if (inStockOnly) list = list.filter(p => p.stock > 0);
    switch (sortBy) {
      case 'price-low':  list.sort((a, b) => a.price - b.price); break;
      case 'price-high': list.sort((a, b) => b.price - a.price); break;
      case 'rating':     list.sort((a, b) => b.rating - a.rating); break;
      case 'newest':     list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      default: break;
    }
    return list;
  }, [products, searchQuery, selectedCategory, minRating, inStockOnly, sortBy]);

  const isFiltered = !!(searchQuery || (selectedCategory && selectedCategory !== 'all'));

  const featured   = useMemo(() => products.filter(p => p.featured).slice(0, 8), [products]);
  const dealProds  = useMemo(() => products.filter(p => p.dealOfTheDay || p.discount >= 25).slice(0, 8), [products]);
  const bestSell   = useMemo(() => products.filter(p => p.bestSeller).slice(0, 8), [products]);
  const newArrivals= useMemo(() => products.filter(p => p.isNew).slice(0, 8), [products]);
  const recentProds= useMemo(() => products.filter(p => recentlyViewed.includes(p.id)).slice(0, 4), [products, recentlyViewed]);

  // Admin portal on /admin route
  if (currentView === 'admin') {
    return (
      <>
        <ToastContainer />
        {adminAuth.isAuthenticated ? <AdminPanel /> : <AdminLogin />}
      </>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, paddingBottom: '68px', fontFamily: "'Inter', sans-serif" }}>
      <ToastContainer />
      <Navbar />

      <main>
        {currentView === 'store' && (
          <>
            <CategoryBar />

            {/* â”€â”€ Filtered / Search Results â”€â”€ */}
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
                      <option value="price-low">Price â†‘</option>
                      <option value="price-high">Price â†“</option>
                      <option value="rating">Top Rated</option>
                      <option value="newest">Newest</option>
                    </select>
                    <select value={minRating} onChange={e => setMinRating(Number(e.target.value))}
                      style={{ padding: '7px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, border: `1px solid ${border}`, background: cardBg, color: text, outline: 'none' }}>
                      <option value={0}>All Ratings</option>
                      <option value={4}>4â˜… & above</option>
                      <option value={4.5}>4.5â˜… & above</option>
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
              /* â”€â”€ Homepage â”€â”€ */
              <>
                <HeroBanner />

                <div style={{ padding: '16px 12px 0', maxWidth: '1400px', margin: '0 auto' }}>

                  {/* Recently Viewed */}
                  {recentProds.length > 0 && (
                    <section style={{ marginBottom: '28px' }}>
                      <SectionHeader title="Recently Viewed" subtitle="Continue where you left off" isDark={isDark} />
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
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
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                        {featured.map(p => <ProductCard key={p.id} product={p} />)}
                      </div>
                    </section>
                  )}

                  {/* Flash Deals Banner */}
                  {dealProds.length > 0 && (
                    <section style={{ marginBottom: '28px' }}>
                      <div style={{
                        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                        borderRadius: '14px', padding: '14px 16px', marginBottom: '14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                            <span style={{ fontSize: '1rem' }}>âš¡</span>
                            <span style={{ fontWeight: 900, color: '#fff', fontSize: '0.95rem' }}>Flash Deals</span>
                            <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.62rem', fontWeight: 800, padding: '2px 8px', borderRadius: '100px' }}>LIVE</span>
                          </div>
                          <p style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.55)', margin: 0 }}>Limited time â€” up to 80% off</p>
                        </div>
                        <button onClick={() => setSelectedCategory('all')} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6C63FF', fontSize: '0.78rem', fontWeight: 700 }}>
                          See all <ChevronRight size={13} />
                        </button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                        {dealProds.map(p => <ProductCard key={p.id} product={p} />)}
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
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
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
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
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
                        <option value="price-low">Price â†‘</option>
                        <option value="price-high">Price â†“</option>
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
  );
}

export default App;
