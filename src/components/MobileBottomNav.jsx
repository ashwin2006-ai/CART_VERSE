import React from 'react';
import { useShop } from '../context/ShopContext';
import {
  ShoppingBag,
  Home,
  Heart,
  User,
  LayoutGrid
} from 'lucide-react';

export const MobileBottomNav = () => {
  const {
    currentView,
    setCurrentView,
    cart,
    wishlist,
    setIsCartOpen,
    user
  } = useShop();

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Helper for user initials if no avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div
      className="mobile-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 1400,
        padding: '0 8px',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.4)'
      }}
    >
      {/* Home / Shop */}
      <button
        onClick={() => {
          setCurrentView('store');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          flex: 1,
          height: '100%',
          color: currentView === 'store' ? 'var(--primary)' : 'var(--text-muted)',
          transition: 'color var(--transition-fast)'
        }}
      >
        <div style={{
          padding: '4px 12px',
          borderRadius: '12px',
          background: currentView === 'store' ? 'var(--primary-light)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Home size={20} strokeWidth={currentView === 'store' ? 2.5 : 2} />
        </div>
        <span style={{ fontSize: '0.68rem', fontWeight: currentView === 'store' ? 800 : 600 }}>Shop</span>
      </button>

      {/* Categories / Explore */}
      <button
        onClick={() => {
          setCurrentView('store');
          const catEl = document.getElementById('category-bar-section');
          if (catEl) {
            catEl.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 350, behavior: 'smooth' });
          }
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          flex: 1,
          height: '100%',
          color: 'var(--text-muted)'
        }}
      >
        <div style={{
          padding: '4px 12px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <LayoutGrid size={20} />
        </div>
        <span style={{ fontSize: '0.68rem', fontWeight: 600 }}>Categories</span>
      </button>

      {/* Wishlist */}
      <button
        onClick={() => {
          setCurrentView('account');
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          flex: 1,
          height: '100%',
          position: 'relative',
          color: wishlist.length > 0 ? '#fb7185' : 'var(--text-muted)'
        }}
      >
        <div style={{
          padding: '4px 12px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <Heart size={20} fill={wishlist.length > 0 ? '#fb7185' : 'none'} strokeWidth={2} />
          {wishlist.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '0px',
              right: '4px',
              background: 'var(--accent-rose)',
              color: '#fff',
              fontSize: '0.62rem',
              fontWeight: 800,
              width: '15px',
              height: '15px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {wishlist.length}
            </span>
          )}
        </div>
        <span style={{ fontSize: '0.68rem', fontWeight: 600 }}>Wishlist</span>
      </button>

      {/* Cart Drawer */}
      <button
        onClick={() => setIsCartOpen(true)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          flex: 1,
          height: '100%',
          color: cartItemCount > 0 ? 'var(--primary)' : 'var(--text-muted)'
        }}
      >
        <div style={{
          padding: '4px 12px',
          borderRadius: '12px',
          background: cartItemCount > 0 ? 'var(--primary-light)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <ShoppingBag size={20} strokeWidth={2} />
          {cartItemCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '0px',
              right: '4px',
              background: 'var(--primary)',
              color: '#fff',
              fontSize: '0.62rem',
              fontWeight: 800,
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {cartItemCount}
            </span>
          )}
        </div>
        <span style={{ fontSize: '0.68rem', fontWeight: cartItemCount > 0 ? 800 : 600 }}>Bag</span>
      </button>

      {/* Profile / Account */}
      <button
        onClick={() => setCurrentView('account')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          flex: 1,
          height: '100%',
          color: currentView === 'account' ? 'var(--primary)' : 'var(--text-muted)'
        }}
      >
        <div style={{
          padding: '2px',
          borderRadius: '50%',
          border: currentView === 'account' ? '2px solid var(--primary)' : '2px solid transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {user && user.avatar ? (
            <img
              src={user.avatar}
              alt="user"
              style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              background: 'var(--primary-gradient)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.65rem',
              fontWeight: 800
            }}>
              {getInitials(user?.name)}
            </div>
          )}
        </div>
        <span style={{ fontSize: '0.68rem', fontWeight: currentView === 'account' ? 800 : 600 }}>Account</span>
      </button>
    </div>
  );
};
