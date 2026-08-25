import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Search, ShoppingCart, Heart, User, X,
  LogOut, ChevronDown, Sun, Moon, Package, Menu, ShoppingBag
} from 'lucide-react';
import { CustomerAuthModal } from './CustomerAuthModal';

export const Navbar = () => {
  const {
    theme, toggleTheme, currentView, setCurrentView,
    cart, wishlist, searchQuery, setSearchQuery,
    products, setIsCartOpen, setActiveProductId, user, setUser
  } = useShop();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const menuRef = useRef(null);

  const cartCount = cart.reduce((t, i) => t + i.quantity, 0);
  const wishlistCount = wishlist.length;

  const suggestions = searchQuery.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  useEffect(() => {
    const h = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setIsSearchFocused(false);
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleLogout = () => {
    // Reset user to guest state instead of null to prevent crashes
    setUser({
      id: 'user-guest',
      name: 'Guest User',
      email: '',
      phone: '',
      addresses: [],
      isLoggedIn: false
    });
    localStorage.removeItem('cartverse_token');
    localStorage.removeItem('aura_user');
    setShowUserMenu(false);
    // Navigate to store instead of reload to avoid full page refresh
    setCurrentView('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

      <header style={{
        position: 'sticky', top: 0, zIndex: 1000,
        background: bg,
        borderBottom: `1px solid ${border}`,
        boxShadow: isDark ? '0 1px 12px rgba(0,0,0,0.4)' : '0 1px 8px rgba(0,0,0,0.06)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '16px',
          padding: '0 16px', height: '60px',
          maxWidth: '1400px', margin: '0 auto',
        }}>
          {/* Logo */}
          <button
            onClick={() => { setCurrentView('store'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}
          >
            <div style={{
              width: '32px', height: '32px', borderRadius: '10px',
              background: `linear-gradient(135deg, ${accent} 0%, #a855f7 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShoppingBag size={16} color="#fff" />
            </div>
            <span style={{
              fontSize: '1.2rem', fontWeight: 900,
              color: textPrimary, letterSpacing: '-0.03em',
              fontFamily: "'Inter', sans-serif",
            }}>
              Cart<span style={{ color: accent }}>Verse</span>
            </span>
          </button>

          {/* Search Bar — desktop */}
          <div ref={searchRef} style={{ flex: 1, position: 'relative', maxWidth: '560px' }}
            className="hide-mobile">
            <div style={{
              display: 'flex', alignItems: 'center',
              background: searchBg,
              borderRadius: '10px',
              border: `1.5px solid ${isSearchFocused ? accent : 'transparent'}`,
              transition: 'border 0.15s',
              overflow: 'hidden',
            }}>
              <Search size={16} style={{ marginLeft: '12px', color: textMuted, flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search products, brands..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                style={{
                  flex: 1, border: 'none', outline: 'none',
                  padding: '10px 10px', fontSize: '0.88rem',
                  color: textPrimary, background: 'transparent',
                  minWidth: 0,
                }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ padding: '0 10px', color: textMuted }}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Suggestions dropdown */}
            {isSearchFocused && suggestions.length > 0 && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
                background: isDark ? '#1e293b' : '#fff',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                zIndex: 2000, overflow: 'hidden',
                border: `1px solid ${border}`,
              }}>
                {suggestions.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { setActiveProductId(p.id); setIsSearchFocused(false); setSearchQuery(''); }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center',
                      gap: '12px', padding: '10px 14px', textAlign: 'left',
                      color: textPrimary, transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = searchBg}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <img
                      src={Array.isArray(p.images) ? p.images[0] : p.images}
                      alt={p.name}
                      style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0, border: `1px solid ${border}` }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.84rem', fontWeight: 600, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: accent, fontWeight: 700, marginTop: '2px' }}>₹{p.price.toLocaleString('en-IN')}</div>
                    </div>
                    <Search size={13} style={{ color: textMuted, flexShrink: 0 }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Nav Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
            {/* Theme toggle */}
            <button onClick={toggleTheme} className="hide-mobile"
              style={{ padding: '8px', color: textMuted, borderRadius: '8px', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = searchBg}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Wishlist */}
            <button
              onClick={() => { setCurrentView('account'); }}
              style={{ padding: '8px', color: textMuted, borderRadius: '8px', position: 'relative', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = searchBg}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              title="Wishlist"
              className="hide-mobile"
            >
              <Heart size={20} strokeWidth={1.8} />
              {wishlistCount > 0 && (
                <span style={{
                  position: 'absolute', top: '4px', right: '4px',
                  background: '#ef4444', color: '#fff',
                  width: '14px', height: '14px', borderRadius: '50%',
                  fontSize: '0.55rem', fontWeight: 900,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{wishlistCount > 9 ? '9+' : wishlistCount}</span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              style={{ padding: '8px', color: textMuted, borderRadius: '8px', position: 'relative', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = searchBg}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              title="Cart"
            >
              <ShoppingCart size={20} strokeWidth={1.8} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '4px', right: '4px',
                  background: accent, color: '#fff',
                  width: '16px', height: '16px', borderRadius: '50%',
                  fontSize: '0.58rem', fontWeight: 900,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{cartCount > 9 ? '9+' : cartCount}</span>
              )}
            </button>

            {/* User/Account */}
            <div ref={menuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => user ? setShowUserMenu(!showUserMenu) : setIsAuthModalOpen(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  padding: '7px 12px', borderRadius: '10px',
                  background: user ? searchBg : accent,
                  color: user ? textPrimary : '#fff',
                  fontSize: '0.82rem', fontWeight: 700,
                  transition: 'all 0.15s',
                  border: `1.5px solid ${user ? border : accent}`,
                }}
                onMouseEnter={e => { if (!user) e.currentTarget.style.opacity = '0.9'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
              >
                {user ? (
                  <>
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      background: `linear-gradient(135deg, ${accent}, #a855f7)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.65rem', fontWeight: 900, color: '#fff', flexShrink: 0,
                    }}>{getInitials(user.name)}</div>
                    <span className="hide-mobile">{user.name?.split(' ')[0].slice(0, 10)}</span>
                    <ChevronDown size={13} />
                  </>
                ) : (
                  <>
                    <User size={15} />
                    <span>Sign In</span>
                  </>
                )}
              </button>

              {showUserMenu && user && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: isDark ? '#1e293b' : '#fff',
                  borderRadius: '14px', minWidth: '220px',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                  zIndex: 2000, overflow: 'hidden',
                  border: `1px solid ${border}`,
                }}>
                  <div style={{ padding: '14px 16px', borderBottom: `1px solid ${border}` }}>
                    <div style={{ fontWeight: 800, color: textPrimary, fontSize: '0.9rem' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: textMuted, marginTop: '2px' }}>{user.email}</div>
                    <div style={{ marginTop: '6px', display: 'inline-flex', alignItems: 'center', gap: '5px', background: `rgba(108,99,255,0.1)`, borderRadius: '20px', padding: '3px 10px', fontSize: '0.7rem', fontWeight: 700, color: accent }}>
                      🎁 {user.rewardPoints || 0} pts
                    </div>
                  </div>
                  {[
                    { label: 'My Account', icon: User, action: () => { setCurrentView('account'); setShowUserMenu(false); } },
                    { label: 'My Orders', icon: Package, action: () => { setCurrentView('account'); setShowUserMenu(false); } },
                    { label: 'Wishlist', icon: Heart, action: () => { setCurrentView('account'); setShowUserMenu(false); } },
                  ].map(item => {
                    const Icon = item.icon;
                    return (
                      <button key={item.label} onClick={item.action}
                        style={{ width: '100%', textAlign: 'left', padding: '11px 16px', fontSize: '0.84rem', color: textPrimary, fontWeight: 500, display: 'flex', alignItems: 'center', gap: '10px', transition: 'background 0.1s' }}
                        onMouseEnter={e => e.currentTarget.style.background = searchBg}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <Icon size={15} style={{ color: textMuted }} /> {item.label}
                      </button>
                    );
                  })}
                  <button onClick={handleLogout}
                    style={{ width: '100%', textAlign: 'left', padding: '11px 16px', fontSize: '0.84rem', color: '#ef4444', fontWeight: 700, borderTop: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: '10px', transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="show-mobile" style={{
          padding: '0 12px 10px',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center',
            background: searchBg, borderRadius: '10px',
            border: `1.5px solid ${border}`, overflow: 'hidden',
          }}>
            <Search size={15} style={{ marginLeft: '10px', color: textMuted, flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                flex: 1, border: 'none', outline: 'none',
                padding: '9px 8px', fontSize: '0.85rem',
                color: textPrimary, background: 'transparent', minWidth: 0,
              }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ padding: '0 8px', color: textMuted }}>
                <X size={13} />
              </button>
            )}
          </div>
        </div>
      </header>

      <style>{`
        @media (max-width: 640px) { .hide-mobile { display: none !important; } }
        @media (min-width: 641px) { .show-mobile { display: none !important; } }
      `}</style>
    </>
  );
};
