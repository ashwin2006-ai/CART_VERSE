import React from 'react';
import { useShop } from '../context/ShopContext';

const CATS = [
  { id: 'all',         label: 'All',          emoji: '🛍️' },
  { id: 'mobiles',     label: 'Mobiles',       emoji: '📱' },
  { id: 'electronics', label: 'Electronics',   emoji: '💻' },
  { id: 'fashion',     label: 'Fashion',       emoji: '👗' },
  { id: 'footwear',    label: 'Footwear',      emoji: '👟' },
  { id: 'beauty',      label: 'Beauty',        emoji: '💄' },
  { id: 'home',        label: 'Home',          emoji: '🏠' },
  { id: 'accessories', label: 'Accessories',   emoji: '⌚' },
];

export const CategoryBar = () => {
  const { selectedCategory, setSelectedCategory, theme } = useShop();
  const isDark = theme === 'dark';
  const accent = '#6C63FF';
  const isMobile = window.innerWidth < 768;
  const isUltraMobile = window.innerWidth < 480;
  const isExtraSmall = window.innerWidth < 360;

  return (
    <div
      id="category-bar-section"
      style={{
        background: isDark ? '#0f172a' : '#ffffff',
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : '#e5e7eb'}`,
        position: 'sticky',
        top: isMobile ? '60px' : 0,
        zIndex: 200,
        paddingTop: isMobile ? 'max(0px, env(safe-area-inset-top))' : 0,
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        padding: isExtraSmall ? '6px 8px' : isUltraMobile ? '8px 10px' : isMobile ? '8px 12px' : '10px 12px',
        gap: isExtraSmall ? '4px' : isUltraMobile ? '6px' : '8px',
        maxWidth: '1400px',
        margin: '0 auto',
        overflowX: isExtraSmall ? 'auto' : 'visible',
        overflowY: 'hidden',
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
      }}>
        {CATS.map(cat => {
          const active = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: isUltraMobile ? '4px' : '6px',
                padding: isExtraSmall ? '5px 10px' : isUltraMobile ? '6px 12px' : '7px 14px',
                borderRadius: '100px',
                fontSize: isExtraSmall ? '0.72rem' : isUltraMobile ? '0.76rem' : '0.82rem',
                fontWeight: active ? 700 : 500,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.18s',
                background: active
                  ? `linear-gradient(135deg, ${accent} 0%, #a855f7 100%)`
                  : isDark ? '#1e293b' : '#f3f4f6',
                color: active ? '#fff' : isDark ? '#94a3b8' : '#374151',
                border: active ? 'none' : `1.5px solid ${isDark ? '#334155' : '#e5e7eb'}`,
                boxShadow: active ? '0 4px 12px rgba(108,99,255,0.35)' : 'none',
                transform: active ? 'scale(1.04)' : 'scale(1)',
                flexShrink: 0,
                minHeight: isUltraMobile ? '32px' : '36px',
              }}
            >
              <span style={{ fontSize: isExtraSmall ? '0.75rem' : '0.9rem', flexShrink: 0 }}>{cat.emoji}</span>
              {!isExtraSmall && cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
