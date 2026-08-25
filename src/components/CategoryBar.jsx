import React from 'react';
import { useShop } from '../context/ShopContext';
import { Sparkles, Headphones, Shirt, Footprints, Watch, Home, ExternalLink } from 'lucide-react';

const ICON_MAP = {
  Sparkles: Sparkles,
  Headphones: Headphones,
  Shirt: Shirt,
  Footprints: Footprints,
  Watch: Watch,
  Home: Home
};

export const CategoryBar = () => {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    products,
    flipkartProducts,
    catalogSource,
    setCatalogSource
  } = useShop();

  // Compute live counts per category
  const getCount = (catId) => {
    let base = products;
    if (catalogSource === 'flipkart') {
      base = flipkartProducts;
    } else if (catalogSource === 'all') {
      base = [...products, ...flipkartProducts];
    }
    if (catId === 'all') return base.length;
    return base.filter(p => p.category === catId).length;
  };

  return (
    <div style={{ marginBottom: '28px' }}>
      <div className="container">
        {/* Top Channel Switcher: Cartverse Store vs Flipkart Live Deals */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Catalog Source:
            </span>
            <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-surface)', padding: '3px', borderRadius: 'var(--radius-full)' }}>
              {[
                { id: 'all', label: 'All Catalog' },
                { id: 'cartverse', label: 'Cartverse Direct' },
                { id: 'flipkart', label: '🛍️ Flipkart Deals' }
              ].map((src) => (
                <button
                  key={src.id}
                  onClick={() => setCatalogSource(src.id)}
                  style={{
                    padding: '5px 14px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    background: catalogSource === src.id ? 'var(--primary-gradient)' : 'transparent',
                    color: catalogSource === src.id ? '#ffffff' : 'var(--text-secondary)'
                  }}
                >
                  {src.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
            <span>● Official Flipkart Affiliate API Proxy Active</span>
          </div>
        </div>

        {/* Categories Pills Carousel */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          overflowX: 'auto',
          paddingBottom: '8px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          {categories.map((cat) => {
            const IconComponent = ICON_MAP[cat.icon] || Sparkles;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-full)',
                  background: isSelected ? 'var(--primary-gradient)' : 'var(--bg-card)',
                  color: isSelected ? '#ffffff' : 'var(--text-primary)',
                  border: isSelected ? '1px solid transparent' : '1px solid var(--border-subtle)',
                  boxShadow: isSelected ? '0 4px 16px rgba(99, 102, 241, 0.4)' : 'none',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.borderColor = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              >
                <IconComponent size={16} />
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{cat.name}</span>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: '10px',
                  background: isSelected ? 'rgba(255, 255, 255, 0.25)' : 'var(--bg-surface)',
                  color: isSelected ? '#ffffff' : 'var(--text-muted)'
                }}>
                  {getCount(cat.id)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
