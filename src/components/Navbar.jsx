import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Sun,
  Moon,
  Sparkles,
  X,
  ArrowRight,
  LogIn,
  ShieldCheck
} from 'lucide-react';
import { CustomerAuthModal } from './CustomerAuthModal';

export const Navbar = () => {
  const {
    theme,
    toggleTheme,
    currentView,
    setCurrentView,
    cart,
    wishlist,
    searchQuery,
    setSearchQuery,
    products,
    setIsCartOpen,
    setActiveProductId,
    setIsAiAssistantOpen,
    user
  } = useShop();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchRef = useRef(null);

  // Helper for user initials
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  // Cart total items count
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Filter autocomplete suggestions
  const searchSuggestions = searchQuery.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <CustomerAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        transition: 'background var(--transition-smooth)'
      }}>
        {/* Top Banner Notice */}
        <div style={{
          background: 'var(--primary-gradient)',
          color: '#ffffff',
          padding: '6px 12px',
          fontSize: 'clamp(0.7rem, 2vw, 0.78rem)',
          fontWeight: 600,
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          letterSpacing: '0.02em',
          flexWrap: 'wrap'
        }}>
          <span>⚡ Welcome to <strong>CARTVERSE</strong>! Use code <span style={{ textDecoration: 'underline', fontWeight: 800 }}>SAVE20</span> for 20% off orders &gt; ₹2,999!</span>
          <button
            onClick={() => {
              setCurrentView('store');
              setIsAiAssistantOpen(true);
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.25)',
              border: 'none',
              color: '#fff',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '0.7rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Sparkles size={11} /> Cartverse AI
          </button>
        </div>

        {/* Main Navbar Container */}
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px',
          gap: '12px'
        }}>
          {/* Brand Logo */}
          <div
            onClick={() => {
              setCurrentView('store');
              setSearchQuery('');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              userSelect: 'none',
              flexShrink: 0
            }}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
            }}>
              <Sparkles size={18} />
            </div>
            <div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.2rem, 3vw, 1.4rem)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)'
              }}>
                CART<span className="gradient-text" style={{ marginLeft: '2px' }}>VERSE</span>
              </span>
            </div>
          </div>

          {/* Desktop Live Search & Autocomplete */}
          <div ref={searchRef} style={{
            flex: 1,
            maxWidth: '520px',
            position: 'relative',
            display: window.innerWidth > 800 ? 'block' : 'none'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-surface)',
              border: isSearchFocused ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              padding: '2px 14px',
              boxShadow: isSearchFocused ? '0 0 0 3px var(--primary-light)' : 'none',
              transition: 'var(--transition-fast)'
            }}>
              <Search size={16} style={{ color: 'var(--text-muted)', marginRight: '8px' }} />
              <input
                type="text"
                placeholder="Search 4K Projectors, Merino Wool, Headphones..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentView !== 'store') setCurrentView('store');
                }}
                onFocus={() => setIsSearchFocused(true)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  padding: '8px 0',
                  fontSize: '0.86rem',
                  color: 'var(--text-primary)',
                  boxShadow: 'none'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ color: 'var(--text-muted)', padding: '4px', display: 'flex', alignItems: 'center' }}
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {isSearchFocused && searchSuggestions.length > 0 && (
              <div
                className="glass-panel animate-fade-in"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  right: 0,
                  background: 'var(--bg-card-solid)',
                  boxShadow: 'var(--shadow-lg)',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px',
                  zIndex: 100
                }}
              >
                {searchSuggestions.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      setActiveProductId(prod.id);
                      setIsSearchFocused(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <img src={prod.images[0]} alt={prod.name} style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.84rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {prod.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
                        ₹{prod.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <ArrowRight size={13} style={{ color: 'var(--text-muted)' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Navigation & Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Mobile Search Toggle Button */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="btn-icon btn-secondary mobile-search-toggle"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-full)'
              }}
              title="Search Products"
            >
              <Search size={16} />
            </button>

            {/* Customer View Switcher (Desktop / Tablet) */}
            <div className="desktop-view-switcher" style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-surface)',
              padding: '3px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)'
            }}>
              <button
                onClick={() => setCurrentView('store')}
                style={{
                  padding: '5px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  background: currentView === 'store' ? 'var(--primary-gradient)' : 'transparent',
                  color: currentView === 'store' ? '#fff' : 'var(--text-secondary)'
                }}
              >
                Shop
              </button>

              <button
                onClick={() => setCurrentView('account')}
                style={{
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: currentView === 'account' ? 'var(--primary-gradient)' : 'transparent',
                  color: currentView === 'account' ? '#fff' : 'var(--text-secondary)'
                }}
              >
                {user && user.avatar ? (
                  <img src={user.avatar} alt="me" style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <span style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'var(--primary-gradient)',
                    color: '#fff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.62rem',
                    fontWeight: 800
                  }}>
                    {getInitials(user?.name)}
                  </span>
                )}
                <span>Account</span>
              </button>
            </div>

            {/* Customer Login / Register trigger */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="btn btn-secondary btn-sm"
              style={{
                borderRadius: 'var(--radius-full)',
                padding: '6px 12px',
                fontSize: '0.78rem',
                gap: '6px'
              }}
              title="Customer Login / Register"
            >
              {user && user.avatar ? (
                <img src={user.avatar} alt="avatar" style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <User size={13} />
              )}
              <span>{user ? user.name.split(' ')[0] : 'Sign In'}</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="btn-icon btn-secondary"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-full)' }}
            >
              {theme === 'dark' ? <Sun size={16} style={{ color: '#fbbf24' }} /> : <Moon size={16} style={{ color: '#6366f1' }} />}
            </button>

            {/* Wishlist Button (Desktop) */}
            <button
              onClick={() => setCurrentView('account')}
              className="btn-icon btn-secondary desktop-header-wishlist"
              title="Wishlist"
              style={{ width: '38px', height: '38px', position: 'relative', borderRadius: 'var(--radius-full)' }}
            >
              <Heart size={16} style={{ color: wishlist.length > 0 ? '#fb7185' : 'inherit' }} />
              {wishlist.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  background: 'var(--accent-rose)',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="btn btn-primary"
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-full)',
                gap: '6px',
                fontWeight: 700,
                fontSize: '0.84rem'
              }}
            >
              <ShoppingBag size={16} />
              <span className="hide-on-small-mobile">Bag</span>
              {cartItemCount > 0 && (
                <span style={{
                  background: '#ffffff',
                  color: '#4f46e5',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: '10px'
                }}>
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Dropdown */}
        {showMobileSearch && (
          <div className="mobile-search-bar animate-fade-in" style={{
            padding: '10px 16px 14px 16px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-glass)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-surface)',
              border: '1px solid var(--primary)',
              borderRadius: 'var(--radius-full)',
              padding: '4px 14px'
            }}>
              <Search size={16} style={{ color: 'var(--primary)', marginRight: '8px' }} />
              <input
                type="text"
                autoFocus
                placeholder="Search products in Cartverse..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentView !== 'store') setCurrentView('store');
                }}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  padding: '8px 0',
                  fontSize: '0.9rem',
                  color: 'var(--text-primary)'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ color: 'var(--text-muted)', padding: '4px' }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
