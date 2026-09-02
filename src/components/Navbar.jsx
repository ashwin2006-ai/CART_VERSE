import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Search, ShoppingCart, Heart, User, X,
  LogOut, Sun, Moon, ShoppingBag, MessageSquare
} from 'lucide-react';
import { CustomerAuthModal } from './CustomerAuthModal';

export const Navbar = () => {
  const {
    theme, toggleTheme, currentView, setCurrentView,
    cart, wishlist, searchQuery, setSearchQuery,
    products, setIsCartOpen, setActiveProductId, user, setUser, addToast
  } = useShop();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef(null);
  const menuRef = useRef(null);

  const cartCount = cart.reduce((t, i) => t + i.quantity, 0);
  const wishlistCount = wishlist.length;

  const suggestions = searchQuery.trim()
    ? (products || []).filter(p => p && p?.name && (
        (p?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(searchQuery.toLowerCase())
      )).slice(0, 6)
    : [];

  useEffect(() => {
    const h = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setIsSearchFocused(false);
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        window.location.hash = '#admin';
        setCurrentView('admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('cartverse_token');
    localStorage.removeItem('aura_user');
    localStorage.removeItem('cartverse_local_users');
    setShowUserMenu(false);
    
    addToast({
      type: 'success',
      title: 'Signed Out',
      message: 'You have been signed out successfully'
    });
    
    setCurrentView('store');
    window.location.hash = '';
    window.location.reload();
  };

  const getInitials = (n) => {
    if (!n) return 'U';
    const p = n.trim().split(' ');
    return p.length >= 2 ? `${p[0][0]}${p[1][0]}`.toUpperCase() : n.slice(0, 2).toUpperCase();
  };

  const isDark = theme === 'dark';
  const bg = isDark ? '#0f172a' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb';
  const textPrimary = isDark ? '#f1f5f9' : '#111827';
  const textMuted = isDark ? '#94a3b8' : '#6b7280';
  const searchBg = isDark ? '#1e293b' : '#f3f4f6';
  const accent = '#6C63FF';

  return (
    <>
      <CustomerAuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <style>{`
        @media (max-width: 768px) {
          .navbar-logo-text { display: none !important; }
          .navbar-search { max-width: 200px !important; }
        }
        @media (max-width: 480px) {
          .navbar-container { padding: 0 10px !important; gap: 6px !important; height: 56px !important; }
          .navbar-left-actions button { width: 32px !important; height: 32px !important; }
          .navbar-search { max-width: 150px !important; }
          .navbar-search input { font-size: 0.8rem !important; }
        }
      `}</style>

      <header style={{
        position: 'sticky', top: 0, zIndex: 999,
        background: bg,
        borderBottom: `1px solid ${border}`,
        boxShadow: isDark ? '0 1px 12px rgba(0,0,0,0.4)' : '0 1px 8px rgba(0,0,0,0.06)',
      }}>
        <div className="navbar-container" style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '0 clamp(10px, 3vw, 20px)', height: '60px',
          width: '100%', justifyContent: 'space-between',
        }}>
          {/* LEFT: Logo */}
          <button
            onClick={() => { setCurrentView('store'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}
          >
            <div style={{
              width: 'clamp(28px, 4vw, 32px)', height: 'clamp(28px, 4vw, 32px)', borderRadius: '10px',
              background: `linear-gradient(135deg, ${accent} 0%, #a855f7 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShoppingBag size={14} color="#fff" />
            </div>
            <span className="navbar-logo-text" style={{
              fontSize: 'clamp(0.95rem, 2vw, 1.2rem)', fontWeight: 900,
              color: textPrimary, letterSpacing: '-0.03em',
              fontFamily: "'Inter', sans-serif",
            }}>
              Cart<span style={{ color: accent }}>Verse</span>
            </span>
          </button>

          {/* CENTER: Search Bar - Permanently Centered */}
          <div className="navbar-search" ref={searchRef} style={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative', minWidth: '150px', maxWidth: '500px', justifyContent: 'center' }}>
              <div style={{
                flex: 1, display: 'flex', alignItems: 'center', background: searchBg,
                borderRadius: '10px', padding: '0 12px', border: isSearchFocused ? `2px solid ${accent}` : `1px solid ${border}`,
                position: 'relative', transition: 'all 0.2s'
              }}>
                <Search size={16} style={{ color: textMuted, marginRight: '8px', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  style={{
                    flex: 1, border: 'none', background: 'transparent',
                    padding: '8px 0', fontSize: '0.9rem', outline: 'none', color: textPrimary, minWidth: '80px'
                  }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} style={{ color: textMuted, padding: '4px', flexShrink: 0, background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <X size={16} />
                  </button>
                )}

                {/* Search Suggestions */}
                {isSearchFocused && suggestions.length > 0 && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px',
                    background: bg, border: `1px solid ${border}`, borderRadius: '10px',
                    boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.1)',
                    zIndex: 100, maxHeight: '300px', overflowY: 'auto'
                  }}>
                    {suggestions.map(p => (
                      <button
                        key={p.id}
                        onClick={() => { setActiveProductId(p.id); setIsSearchFocused(false); }}
                        style={{
                          width: '100%', textAlign: 'left', padding: '10px 12px',
                          fontSize: '0.85rem', color: textPrimary, border: 'none',
                          background: 'transparent', cursor: 'pointer',
                          borderBottom: `1px solid ${border}`, transition: 'background 0.1s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = isDark ? '#1e293b' : '#f3f4f6'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        {p?.name || 'Product'} — ₹{p?.price || 0}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

          {/* RIGHT: Wishlist, Cart, Theme, Profile */}
          <div className="navbar-left-actions" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 2vw, 10px)', marginLeft: 'auto' }}>
            {/* Wishlist */}
            <button
              onClick={() => setCurrentView('account')}
              style={{
                width: 'clamp(32px, 5vw, 36px)', height: 'clamp(32px, 5vw, 36px)', borderRadius: '8px',
                background: searchBg, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', transition: 'all 0.2s'
              }}
              title="Wishlist"
            >
              <Heart size={18} color={wishlistCount > 0 ? '#ef4444' : textMuted} />
              {wishlistCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-4px', right: '-4px',
                  background: '#ef4444', color: '#fff', fontSize: '0.65rem',
                  fontWeight: 800, padding: '2px 5px', borderRadius: '10px'
                }}>
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                width: 'clamp(32px, 5vw, 36px)', height: 'clamp(32px, 5vw, 36px)', borderRadius: '8px',
                background: searchBg, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', transition: 'all 0.2s'
              }}
              title="Shopping Cart"
            >
              <ShoppingCart size={18} color={cartCount > 0 ? accent : textMuted} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-4px', right: '-4px',
                  background: accent, color: '#fff', fontSize: '0.65rem',
                  fontWeight: 800, padding: '2px 5px', borderRadius: '10px'
                }}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              style={{
                width: 'clamp(32px, 5vw, 36px)', height: 'clamp(32px, 5vw, 36px)', borderRadius: '8px',
                background: searchBg, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} color={textMuted} />}
            </button>

            {/* User Menu */}
            <div ref={menuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  width: 'clamp(32px, 5vw, 36px)', height: 'clamp(32px, 5vw, 36px)', borderRadius: '50%',
                  background: accent, border: 'none', cursor: 'pointer',
                  color: '#fff', fontWeight: 800, fontSize: '0.75rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                title={user?.name || 'User Menu'}
              >
                {getInitials(user?.name)}
              </button>

              {showUserMenu && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: '8px',
                  background: bg, border: `1px solid ${border}`, borderRadius: '10px',
                  boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.1)',
                  minWidth: '220px', overflow: 'hidden', zIndex: 9999, maxHeight: '400px', overflowY: 'auto'
                }}>
                  {/* Profile Header */}
                  <div style={{ padding: '12px 16px', borderBottom: `1px solid ${border}` }}>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: textPrimary }}>
                      {user?.isLoggedIn ? (user?.name || 'User') : 'Guest User'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: textMuted, marginTop: '2px' }}>
                      {user?.isLoggedIn ? (user?.email || 'Not set') : 'Not logged in'}
                    </div>
                  </div>

                  {/* Menu Items */}
                  {user?.isLoggedIn && (
                    <button
                      onClick={() => { setCurrentView('account'); setShowUserMenu(false); }}
                      style={{
                        width: '100%', textAlign: 'left', padding: '11px 16px', fontSize: '0.84rem',
                        color: textPrimary, fontWeight: 600, borderTop: `1px solid ${border}`,
                        display: 'flex', alignItems: 'center', gap: '10px', transition: 'background 0.1s', background: 'transparent', border: 'none', cursor: 'pointer'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = isDark ? '#1e293b' : '#f9fafb'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <User size={15} /> My Account
                    </button>
                  )}

                  {!user?.isLoggedIn && (
                    <>
                      <button
                        onClick={() => {
                          setUser({
                            id: 'demo-user',
                            name: 'Demo User',
                            email: 'demo@cartverse.io',
                            phone: '9876543210',
                            addresses: [
                              {
                                id: 'addr-1',
                                title: 'Home',
                                fullName: 'Demo User',
                                phone: '9876543210',
                                street: '123 Demo Street',
                                landmark: 'Near Demo Park',
                                city: 'Demo City',
                                state: 'Demo State',
                                pincode: '123456'
                              }
                            ],
                            isLoggedIn: true
                          });
                          localStorage.setItem('aura_user', JSON.stringify({
                            id: 'demo-user',
                            name: 'Demo User',
                            email: 'demo@cartverse.io',
                            phone: '9876543210',
                            addresses: [
                              {
                                id: 'addr-1',
                                title: 'Home',
                                fullName: 'Demo User',
                                phone: '9876543210',
                                street: '123 Demo Street',
                                landmark: 'Near Demo Park',
                                city: 'Demo City',
                                state: 'Demo State',
                                pincode: '123456'
                              }
                            ],
                            isLoggedIn: true
                          }));
                          setShowUserMenu(false);
                          addToast({
                            type: 'success',
                            title: 'Demo Account Loaded',
                            message: 'Welcome! You are logged in as Demo User'
                          });
                        }}
                        style={{
                          width: '100%', textAlign: 'left', padding: '11px 16px', fontSize: '0.84rem',
                          color: '#10b981', fontWeight: 700, borderTop: `1px solid ${border}`,
                          display: 'flex', alignItems: 'center', gap: '10px', transition: 'background 0.1s', background: 'transparent', border: 'none', cursor: 'pointer'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <User size={15} /> 📌 Demo Login
                      </button>

                      <button
                        onClick={() => { setIsAuthModalOpen(true); setShowUserMenu(false); }}
                        style={{
                          width: '100%', textAlign: 'left', padding: '11px 16px', fontSize: '0.84rem',
                          color: textPrimary, fontWeight: 600, borderTop: `1px solid ${border}`,
                          display: 'flex', alignItems: 'center', gap: '10px', transition: 'background 0.1s', background: 'transparent', border: 'none', cursor: 'pointer'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = isDark ? '#1e293b' : '#f9fafb'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <User size={15} /> Sign In / Register
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => { setIsAuthModalOpen(true); setShowUserMenu(false); }}
                    style={{
                      width: '100%', textAlign: 'left', padding: '11px 16px', fontSize: '0.84rem',
                      color: textPrimary, fontWeight: 600,
                      display: 'flex', alignItems: 'center', gap: '10px', transition: 'background 0.1s', background: 'transparent', border: 'none', cursor: 'pointer'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = isDark ? '#1e293b' : '#f9fafb'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <MessageSquare size={15} /> Help & Support
                  </button>

                  {user?.isLoggedIn && (
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%', textAlign: 'left', padding: '11px 16px', fontSize: '0.84rem',
                        color: '#ef4444', fontWeight: 700, borderTop: `1px solid ${border}`,
                        display: 'flex', alignItems: 'center', gap: '10px', transition: 'background 0.1s', background: 'transparent', border: 'none', cursor: 'pointer'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
