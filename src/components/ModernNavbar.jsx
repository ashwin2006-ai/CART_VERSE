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
        padding: '12px var(--space-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-lg)',
        minHeight: '70px',
        flexWrap: 'wrap'
      }}>
        {/* Left: Logo and Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-md)',
          flex: '0 1 auto'
        }}>
          {/* Logo */}
          <div 
            onClick={() => setCurrentView('store')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              flex: '0 0 auto',
              padding: '8px 12px',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(99, 102, 241, 0.15)',
              transition: 'all var(--transition-fast)',
              border: '1px solid rgba(99, 102, 241, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.25)';
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold',
              flexShrink: 0
            }}>
              🛍️
            </div>
            <div>
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

          {/* Navigation Buttons */}
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
        </div>

        {/* Right: Search Bar - Responsive */}
        <div style={{
          flex: '1 1 auto',
          minWidth: '200px',
          maxWidth: '400px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 'var(--radius-full)',
            padding: '6px 12px',
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
            <Search size={16} color="rgba(255, 255, 255, 0.3)" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearch}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '13px',
                fontFamily: 'var(--font-family)',
                color: '#fff'
              }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};
