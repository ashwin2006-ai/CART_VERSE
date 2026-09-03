import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Search, ChevronDown } from 'lucide-react';

export const ModernNavbar = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    setCurrentView,
    theme,
    toggleTheme
  } = useShop();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const isMobile = window.innerWidth < 768;

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
    }}>
      {/* Main navbar container */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: isMobile ? '10px 12px' : '12px var(--space-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: isMobile ? '8px' : 'var(--space-lg)',
        minHeight: isMobile ? '60px' : '70px',
        flexWrap: isMobile ? 'wrap' : 'nowrap'
      }}>
        {/* Left: Logo and Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '4px' : 'var(--space-md)',
          flex: isMobile ? '1 1 auto' : '0 1 auto',
          order: 1
        }}>
          {/* Logo */}
          <div 
            onClick={() => setCurrentView('store')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '4px' : '8px',
              cursor: 'pointer',
              flex: '0 0 auto',
              padding: isMobile ? '6px 8px' : '8px 12px',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(99, 102, 241, 0.15)',
              transition: 'all var(--transition-fast)',
              border: '1px solid rgba(99, 102, 241, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.25)';
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.6)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
              }
            }}
          >
            <div style={{
              width: isMobile ? '28px' : '32px',
              height: isMobile ? '28px' : '32px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: isMobile ? '16px' : '18px',
              fontWeight: 'bold',
              flexShrink: 0
            }}>
              🛍️
            </div>
            <div style={{ display: isMobile ? 'none' : 'block' }}>
              <h1 style={{
                fontSize: '16px',
                fontWeight: '900',
                color: '#fff',
                margin: 0,
                lineHeight: 1,
                letterSpacing: '-0.5px'
              }}>
                CARTVERSE
              </h1>
            </div>
          </div>

          {/* Navigation Buttons - Hidden on Mobile */}
          {!isMobile && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginLeft: '16px'
            }}>
              {/* Shop Button */}
              <button
                onClick={() => setCurrentView('store')}
                style={{
                  padding: '6px 16px',
                  background: 'rgba(99, 102, 241, 0.2)',
                  border: '1px solid rgba(99, 102, 241, 0.4)',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  color: '#6C63FF',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all var(--transition-fast)',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(99, 102, 241, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                }}
              >
                🛒 Shop
              </button>

              {/* Account Button */}
              <button
                onClick={() => setCurrentView('account')}
                style={{
                  padding: '6px 16px',
                  background: 'rgba(99, 102, 241, 0.2)',
                  border: '1px solid rgba(99, 102, 241, 0.4)',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  color: '#9ca3af',
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: 'all var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(99, 102, 241, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.6)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                  e.currentTarget.style.color = '#9ca3af';
                }}
              >
                👤 Account
              </button>
            </div>
          )}
        </div>

        {/* Right: Search Bar - Full width on mobile row 1, normal on desktop */}
        <div style={{
          flex: isMobile ? '1 1 calc(100% - 50px)' : '1 1 auto',
          minWidth: isMobile ? 'auto' : '200px',
          maxWidth: isMobile ? 'none' : '400px',
          order: isMobile ? 3 : 2
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 'var(--radius-full)',
            padding: isMobile ? '8px 10px' : '6px 12px',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            transition: 'all var(--transition-fast)'
          }}
            onFocus={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)';
            }}
          >
            <Search size={isMobile ? 14 : 16} color="rgba(255, 255, 255, 0.3)" />
            <input
              type="text"
              placeholder={isMobile ? "Search..." : "Search products..."}
              value={searchQuery}
              onChange={handleSearch}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: isMobile ? '12px' : '13px',
                fontFamily: 'var(--font-family)',
                color: '#fff'
              }}
            />
          </div>
        </div>

        {/* Mobile Navigation Buttons - Shown below search on mobile */}
        {isMobile && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            order: 4,
            width: '100%',
            marginTop: '8px'
          }}>
            {/* Shop Button Mobile */}
            <button
              onClick={() => setCurrentView('store')}
              style={{
                flex: 1,
                padding: '8px 12px',
                background: 'rgba(99, 102, 241, 0.2)',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                color: '#6C63FF',
                fontSize: '12px',
                fontWeight: '600',
                transition: 'all var(--transition-fast)',
                whiteSpace: 'nowrap'
              }}
              onTouchStart={(e) => {
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.3)';
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
              }}
            >
              🛒 Shop
            </button>

            {/* Account Button Mobile */}
            <button
              onClick={() => setCurrentView('account')}
              style={{
                flex: 1,
                padding: '8px 12px',
                background: 'rgba(99, 102, 241, 0.2)',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                color: '#9ca3af',
                fontSize: '12px',
                fontWeight: '500',
                transition: 'all var(--transition-fast)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                whiteSpace: 'nowrap'
              }}
              onTouchStart={(e) => {
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.3)';
                e.currentTarget.style.color = '#fff';
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
                e.currentTarget.style.color = '#9ca3af';
              }}
            >
              👤 Account
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
