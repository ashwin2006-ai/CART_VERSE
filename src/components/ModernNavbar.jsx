import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Search, ShoppingCart, Heart, User, Menu, X, Home, LogOut, LogIn } from 'lucide-react';

export const ModernNavbar = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    cart, 
    wishlist, 
    user, 
    setCurrentView, 
    setIsCartOpen,
    adminAuth,
    setAdminAuth,
    theme,
    toggleTheme
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLogout = () => {
    setAdminAuth({
      isAuthenticated: false,
      token: null,
      adminUser: null,
      passwordHash: null
    });
    setUserMenuOpen(false);
  };

  return (
    <nav style={{
      background: 'var(--bg-card-solid)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 var(--space-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
        gap: 'var(--space-lg)'
      }}>
        {/* Logo */}
        <div 
          onClick={() => setCurrentView('store')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            cursor: 'pointer',
            flex: '0 0 auto'
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '20px',
            fontWeight: 'bold'
          }}>
            🛍️
          </div>
          <div style={{ display: { xs: 'none', md: 'block' } }}>
            <h1 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--primary)',
              margin: 0
            }}>
              CARTVERSE
            </h1>
            <p style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)',
              margin: 0
            }}>
              Modern Commerce
            </p>
          </div>
        </div>

        {/* Search Bar - Hidden on mobile */}
        <div style={{
          flex: 1,
          maxWidth: '500px',
          display: 'none',
          '@media (min-width: 768px)': { display: 'block' }
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-full)',
            padding: '8px 16px',
            border: '2px solid var(--border-subtle)',
            transition: 'all var(--transition-normal)'
          }}>
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search products, categories..."
              value={searchQuery}
              onChange={handleSearch}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-family)'
              }}
            />
          </div>
        </div>

        {/* Right Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-md)',
          flex: '0 0 auto'
        }}>
          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              position: 'relative',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              borderRadius: 'var(--radius-lg)',
              transition: 'all var(--transition-normal)',
              color: 'var(--text-primary)',
              fontSize: '18px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <ShoppingCart size={20} />
            {cart.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--primary)',
                color: 'white',
                borderRadius: 'var(--radius-full)',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-bold)'
              }}>
                {cart.length}
              </span>
            )}
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => setCurrentView('store')}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              borderRadius: 'var(--radius-lg)',
              transition: 'all var(--transition-normal)',
              color: 'var(--text-primary)',
              fontSize: '18px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <Heart size={20} fill={wishlist.length > 0 ? '#ec4899' : 'none'} color={wishlist.length > 0 ? '#ec4899' : 'currentColor'} />
          </button>

          {/* User Menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              style={{
                background: 'var(--primary)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 12px',
                borderRadius: 'var(--radius-lg)',
                transition: 'all var(--transition-normal)',
                color: 'white'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-dark)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--primary)'}
            >
              <User size={20} />
            </button>

            {userMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                background: 'var(--bg-card-solid)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                minWidth: '200px',
                marginTop: '8px',
                border: '1px solid var(--border-subtle)',
                zIndex: 1001
              }}>
                {user ? (
                  <>
                    <div style={{ padding: 'var(--space-md)', borderBottom: '1px solid var(--border-subtle)' }}>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', margin: 0 }}>
                        {user.name}
                      </p>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0 }}>
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={() => { setCurrentView('account'); setUserMenuOpen(false); }}
                      style={{
                        width: '100%',
                        padding: 'var(--space-md)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-primary)',
                        transition: 'all var(--transition-normal)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      👤 My Account
                    </button>
                    <button
                      onClick={() => { setCurrentView('store'); setUserMenuOpen(false); }}
                      style={{
                        width: '100%',
                        padding: 'var(--space-md)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-primary)',
                        transition: 'all var(--transition-normal)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <Home size={16} style={{ marginRight: '8px', display: 'inline' }} />
                      Home
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { setCurrentView('store'); setUserMenuOpen(false); }}
                    style={{
                      width: '100%',
                      padding: 'var(--space-md)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-primary)',
                      transition: 'all var(--transition-normal)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <LogIn size={16} style={{ marginRight: '8px', display: 'inline' }} />
                    Sign In
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Admin Link */}
          <button
            onClick={() => setCurrentView('admin')}
            style={{
              background: 'var(--secondary)',
              border: 'none',
              color: 'white',
              padding: '6px 12px',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-semibold)',
              transition: 'all var(--transition-normal)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Admin
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div style={{
        display: 'none',
        '@media (max-width: 768px)': { display: 'block' },
        padding: '8px var(--space-lg)',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-full)',
          padding: '8px 12px',
          border: '2px solid var(--border-subtle)'
        }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: 'var(--text-sm)',
              fontFamily: 'var(--font-family)'
            }}
          />
        </div>
      </div>
    </nav>
  );
};
