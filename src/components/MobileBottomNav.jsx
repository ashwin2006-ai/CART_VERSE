import React from 'react';
import { useShop } from '../context/ShopContext';
import { Home, Search, LayoutGrid, Heart, User, ShoppingCart, X } from 'lucide-react';

export const MobileBottomNav = () => {
  const {
    currentView, setCurrentView,
    cart, wishlist, setIsCartOpen,
    setSelectedCategory, setSearchQuery, searchQuery, theme,
  } = useShop();

  const [searchOpen, setSearchOpen] = React.useState(false);
  const [localSearch, setLocalSearch] = React.useState('');
  const isDark = theme === 'dark';
  const isMobile = window.innerWidth < 768;
  const isUltraMobile = window.innerWidth < 480;
  const isExtraSmall = window.innerWidth < 360;

  // Prevent scroll when search overlay is open
  React.useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [searchOpen]);

  const cartCount = (Array.isArray(cart) ? cart : []).reduce((t, i) => t + (i?.quantity || 0), 0);
  const wishCount = Array.isArray(wishlist) ? wishlist.length : 0;

  const accent = '#6C63FF';
  const navBg = isDark ? '#0f172a' : '#ffffff';
  const navBorder = isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb';
  const inactiveColor = isDark ? '#64748b' : '#6b7280';

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      setCurrentView('store');
    }
    setSearchOpen(false);
  };

  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      action: () => {
        setCurrentView('store');
        setSelectedCategory('all');
        setSearchQuery('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      active: currentView === 'store',
    },
    {
      id: 'search',
      label: 'Search',
      icon: Search,
      action: () => setSearchOpen(true),
      active: !!searchQuery,
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: LayoutGrid,
      action: () => {
        setCurrentView('store');
        setSelectedCategory('all');
        setTimeout(() => {
          document.getElementById('category-bar-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
      active: false,
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: Heart,
      action: () => setCurrentView('account'),
      active: false,
      badge: wishCount,
    },
    {
      id: 'account',
      label: 'Account',
      icon: User,
      action: () => setCurrentView('account'),
      active: currentView === 'account',
    },
  ];

  return (
    <>
      {/* Search overlay */}
      {searchOpen && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            zIndex: 1600,
            display: 'flex', alignItems: 'flex-start', paddingTop: '12px',
          }}
          onClick={() => setSearchOpen(false)}
        >
          <form
            onSubmit={handleSearchSubmit}
            onClick={e => e.stopPropagation()}
            style={{
              width: 'calc(100% - 24px)', margin: '0 12px',
              background: isDark ? '#1e293b' : '#fff',
              borderRadius: '14px',
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 14px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
              border: `1.5px solid ${isDark ? '#334155' : '#e5e7eb'}`,
            }}
          >
            <Search size={18} color={accent} />
            <input
              autoFocus
              type="text"
              placeholder="Search products, brands..."
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              style={{
                flex: 1, border: 'none', outline: 'none',
                fontSize: '0.95rem',
                color: isDark ? '#f1f5f9' : '#111827',
                background: 'transparent',
              }}
            />
            {localSearch && (
              <button type="button" onClick={() => setLocalSearch('')}>
                <X size={16} color={inactiveColor} />
              </button>
            )}
            <button
              type="submit"
              style={{
                background: accent, color: '#fff',
                borderRadius: '8px', padding: '7px 16px',
                fontSize: '0.82rem', fontWeight: 700,
                boxShadow: '0 3px 10px rgba(108,99,255,0.35)',
              }}
            >
              Go
            </button>
          </form>
        </div>
      )}

      {/* Bottom nav bar */}
      <nav style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        height: isExtraSmall ? '52px' : isUltraMobile ? '56px' : '60px',
        background: navBg,
        borderTop: `1px solid ${navBorder}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 1400,
        paddingBottom: `max(0px, env(safe-area-inset-bottom, 0px))`,
        boxShadow: isDark ? '0 -4px 20px rgba(0,0,0,0.3)' : '0 -2px 16px rgba(0,0,0,0.07)',
      }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={tab.action}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: isExtraSmall ? '1px' : '2px',
                flex: 1,
                height: '100%',
                color: tab.active ? accent : inactiveColor,
                position: 'relative',
                padding: isExtraSmall ? '2px 0 4px' : isUltraMobile ? '3px 0 5px' : '4px 0 6px',
                transition: 'color 0.15s',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                minHeight: '44px',
              }}
            >
              {/* Active indicator bar */}
              {tab.active && (
                <div style={{
                  position: 'absolute', top: 0, left: '25%', right: '25%',
                  height: isExtraSmall ? '1.5px' : '2px', borderRadius: '0 0 4px 4px',
                  background: accent,
                }} />
              )}

              <div style={{ position: 'relative' }}>
                <Icon
                  size={isExtraSmall ? 18 : isUltraMobile ? 20 : 21}
                  strokeWidth={tab.active ? 2.5 : 1.8}
                  fill={tab.id === 'wishlist' && tab.badge > 0 ? '#ef4444' : 'none'}
                  stroke={tab.id === 'wishlist' && tab.badge > 0 ? '#ef4444' : 'currentColor'}
                />
                {tab.badge > 0 && (
                  <span style={{
                    position: 'absolute', top: '-5px', right: '-7px',
                    background: tab.id === 'wishlist' ? '#ef4444' : accent,
                    color: '#fff',
                    width: isExtraSmall ? '14px' : '15px',
                    height: isExtraSmall ? '14px' : '15px',
                    borderRadius: '50%',
                    fontSize: isExtraSmall ? '0.48rem' : '0.56rem',
                    fontWeight: 900,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1.5px solid ' + navBg,
                  }}>
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
              </div>

              {/* Tab label */}
              <span style={{
                fontSize: isExtraSmall ? '0.5rem' : isUltraMobile ? '0.55rem' : '0.6rem',
                fontWeight: tab.active ? 800 : 500,
                lineHeight: 1,
                whiteSpace: 'nowrap',
              }}>
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Cart FAB in the center */}
        <button
          onClick={() => setIsCartOpen(true)}
          style={{
            position: 'absolute',
            bottom: '14px',
            right: '12px',
            width: '42px', height: '42px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${accent} 0%, #a855f7 100%)`,
            color: '#fff',
            display: 'none', // only show on very small screens when needed
            alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(108,99,255,0.4)',
          }}
        >
          <ShoppingCart size={18} />
          {cartCount > 0 && (
            <span style={{
              position: 'absolute', top: '0', right: '0',
              background: '#ef4444', color: '#fff',
              width: '16px', height: '16px', borderRadius: '50%',
              fontSize: '0.58rem', fontWeight: 900,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{cartCount}</span>
          )}
        </button>
      </nav>
    </>
  );
};
