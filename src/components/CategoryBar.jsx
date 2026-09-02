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

  return (
    <div
      id="category-bar-section"
      style={{
        background: isDark ? '#0f172a' : '#ffffff',
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : '#e5e7eb'}`,
        position: 'sticky',
        top: '60px',
        zIndex: 200,
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: '10px 12px',
        gap: '8px',
        maxWidth: '1400px',
        margin: '0 auto',
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
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '100px',
                fontSize: '0.82rem',
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
              }}
            >
              <span style={{ fontSize: '0.9rem' }}>{cat.emoji}</span>
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
