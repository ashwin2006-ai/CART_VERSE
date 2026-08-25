import React, { useMemo } from 'react';
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

import {
  SlidersHorizontal,
  Flame,
  Sparkles,
  TrendingUp,
  Clock,
  RotateCcw,
  Star,
  Search,
  Filter,
  CheckCircle2,
  X
} from 'lucide-react';

export function App() {
  const {
    currentView,
    adminAuth,
    products,
    flipkartProducts,
    catalogSource,
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
    recentlyViewed,
    setActiveProductId
  } = useShop();

  // Combine Cartverse direct products with live/cached Flipkart catalog
  const combinedCatalog = useMemo(() => {
    const normalizedFk = (flipkartProducts || []).map(fk => ({
      id: fk.id,
      name: fk.title || fk.name,
      category: fk.category || 'electronics',
      price: fk.price,
      originalPrice: fk.mrp || (fk.price * 1.25),
      discount: fk.discount || 10,
      rating: fk.rating || 4.6,
      reviewCount: fk.reviewCount || 120,
      stock: fk.inStock ? 50 : 0,
      featured: false,
      bestSeller: true,
      isNew: false,
      images: fk.imageUrl ? [fk.imageUrl] : (fk.images || ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80']),
      description: fk.title,
      specs: fk.specs || {},
      offers: fk.offers || [],
      brand: fk.brand,
      productUrl: fk.productUrl,
      affiliateUrl: fk.affiliateUrl,
      isFlipkart: true
    }));

    if (catalogSource === 'flipkart') return normalizedFk;
    if (catalogSource === 'cartverse') return products;
    return [...products, ...normalizedFk];
  }, [products, flipkartProducts, catalogSource]);

  // Filtered and Sorted Products computation
  const filteredProducts = useMemo(() => {
    return combinedCatalog.filter((p) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchCat = p.category ? p.category.toLowerCase().includes(q) : false;
        const matchDesc = p.description ? p.description.toLowerCase().includes(q) : false;
        const matchBrand = p.brand ? p.brand.toLowerCase().includes(q) : false;
        if (!matchName && !matchCat && !matchDesc && !matchBrand) return false;
      }

      // Category
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Min Rating
      if (minRating > 0 && p.rating < minRating) {
        return false;
      }

      // Stock
      if (inStockOnly && p.stock <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return 0; // default featured
    });
  }, [combinedCatalog, searchQuery, selectedCategory, minRating, inStockOnly, sortBy]);

  // Curated Subsections
  const bestSellers = products.filter(p => p.bestSeller);
  const deals = products.filter(p => p.dealOfTheDay || p.discount >= 25);
  const recentlyViewedProducts = products.filter(p => recentlyViewed.includes(p.id));

  // IF ADMIN ROUTE SELECTED:
  if (currentView === 'admin') {
    return (
      <>
        <ToastContainer />
        {adminAuth.isAuthenticated ? <AdminPanel /> : <AdminLogin />}
      </>
    );
  }

  // CUSTOMER STOREFRONT & ACCOUNT EXPERIENCE:
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Alerts System */}
      <ToastContainer />

      {/* Sticky Glass Navbar */}
      <Navbar />

      {/* Main View Switcher */}
      <main style={{ flex: 1 }}>
        {/* CUSTOMER STOREFRONT */}
        {currentView === 'store' && (
          <div>
            {/* Hero Carousel & Trust Badges */}
            {!searchQuery && selectedCategory === 'all' && <HeroBanner />}

            {/* Visual Category Filter Bar */}
            <CategoryBar />

            {/* Discovery & Products Grid Section */}
            <section style={{ marginBottom: '48px' }}>
              <div className="container">
                {/* Search / Filter Control Header */}
                <div
                  className="glass-panel"
                  style={{
                    padding: '20px 24px',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: '28px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}
                >
                  {/* Left: Active Title & Results Count */}
                  <div>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {searchQuery ? (
                        <>Results for "{searchQuery}"</>
                      ) : selectedCategory === 'all' ? (
                        <>All Curated Products</>
                      ) : (
                        <span style={{ textTransform: 'capitalize' }}>{selectedCategory} Collection</span>
                      )}
                    </h2>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Showing <strong>{filteredProducts.length}</strong> items found
                    </span>
                  </div>

                  {/* Right: Filters & Sorters */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px' }}>
                    {/* Price Slider Filter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Max Price:</span>
                      <input
                        type="range"
                        min="50"
                        max="600"
                        step="25"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                        style={{ width: '100px', accentColor: 'var(--primary)' }}
                      />
                      <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>${priceRange[1]}</span>
                    </div>

                    {/* Min Rating Filter */}
                    <select
                      value={minRating}
                      onChange={(e) => setMinRating(Number(e.target.value))}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.82rem',
                        fontWeight: 600
                      }}
                    >
                      <option value={0}>All Ratings</option>
                      <option value={4.5}>4.5★ & Above</option>
                      <option value={4.8}>4.8★ & Above</option>
                    </select>

                    {/* In Stock Only Checkbox */}
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}>
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        style={{ accentColor: 'var(--primary)' }}
                      />
                      <span>In Stock Only</span>
                    </label>

                    {/* Sort By Dropdown */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        background: 'var(--bg-surface)'
                      }}
                    >
                      <option value="featured">Sort: Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="newest">New Arrivals</option>
                    </select>

                    {/* Clear Filters Button */}
                    {(searchQuery || selectedCategory !== 'all' || minRating > 0 || inStockOnly || priceRange[1] < 600) && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('all');
                          setMinRating(0);
                          setInStockOnly(false);
                          setPriceRange([0, 600]);
                          setSortBy('featured');
                        }}
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.78rem' }}
                      >
                        <X size={14} /> Reset Filters
                      </button>
                    )}
                  </div>
                </div>

                {/* Primary Products Grid */}
                {filteredProducts.length === 0 ? (
                  <div className="glass-panel" style={{
                    padding: '60px 20px',
                    textAlign: 'center',
                    borderRadius: 'var(--radius-lg)'
                  }}>
                    <Search size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>No Matching Products Found</h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                      Try adjusting your search terms, removing filters, or checking a different category.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                        setMinRating(0);
                        setPriceRange([0, 600]);
                      }}
                      className="btn btn-primary"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '24px'
                  }}>
                    {filteredProducts.map((prod) => (
                      <ProductCard key={prod.id} product={prod} />
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Special Highlight Feeds when browsing Home */}
            {!searchQuery && selectedCategory === 'all' && (
              <>
                {/* Flash Deals of the Day */}
                {deals.length > 0 && (
                  <section style={{ marginBottom: '48px' }}>
                    <div className="container">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <Flame size={24} style={{ color: '#f59e0b' }} />
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 900 }}>Deals of the Day</h2>
                        <span className="badge badge-rose">Up to 33% Off</span>
                      </div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: '24px'
                      }}>
                        {deals.slice(0, 4).map((p) => (
                          <ProductCard key={p.id} product={p} />
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* Best Sellers */}
                {bestSellers.length > 0 && (
                  <section style={{ marginBottom: '48px' }}>
                    <div className="container">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <TrendingUp size={24} style={{ color: 'var(--primary)' }} />
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 900 }}>Trending Best-Sellers</h2>
                        <span className="badge badge-gold">Community Favorites</span>
                      </div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: '24px'
                      }}>
                        {bestSellers.slice(0, 4).map((p) => (
                          <ProductCard key={p.id} product={p} />
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* Recently Viewed Products */}
                {recentlyViewedProducts.length > 0 && (
                  <section style={{ marginBottom: '48px' }}>
                    <div className="container">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <Clock size={20} style={{ color: 'var(--text-muted)' }} />
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Recently Viewed</h3>
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '16px',
                        overflowX: 'auto',
                        paddingBottom: '8px'
                      }}>
                        {recentlyViewedProducts.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => setActiveProductId(p.id)}
                            className="glass-panel"
                            style={{
                              minWidth: '180px',
                              maxWidth: '180px',
                              borderRadius: 'var(--radius-md)',
                              overflow: 'hidden',
                              cursor: 'pointer',
                              border: '1px solid var(--border-subtle)'
                            }}
                          >
                            <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                            <div style={{ padding: '10px' }}>
                              <div style={{ fontSize: '0.78rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {p.name}
                              </div>
                              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
                                ${p.price.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        )}

        {/* CUSTOMER ACCOUNT DASHBOARD */}
        {currentView === 'account' && <AccountView />}
      </main>

      {/* Global Modals & Drawers */}
      <ProductDetailModal />
      <ReviewModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderConfirmationModal />
      <OrderTrackingModal />

      {/* AI Assistant Chatbot */}
      <AiAssistant />

      {/* Universal Customer Footer */}
      <Footer />
    </div>
  );
}
export default App;
