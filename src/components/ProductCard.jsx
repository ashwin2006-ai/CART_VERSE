import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Star, Heart, ShoppingCart, Zap } from 'lucide-react';

export const ProductCard = ({ product, compact = false }) => {
  const { wishlist, toggleWishlist, setActiveProductId, addToCart, recordRecentlyViewed, theme } = useShop();
  const [imgErr, setImgErr] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isDark = theme === 'dark';
  const accent = '#6C63FF';

  const isWishlisted = wishlist.includes(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const discount = product.discount || (
    product.originalPrice > product.price
      ? Math.round((product.originalPrice - product.price) / product.originalPrice * 100)
      : 0
  );

  const imgSrc = imgErr
    ? 'https://placehold.co/300x300/f3f4f6/9ca3af?text=No+Image'
    : (Array.isArray(product.images) ? product.images[0] : (product.images || product.imageUrl || ''));

  const handleClick = () => { recordRecentlyViewed(product.id); setActiveProductId(product.id); };
  const handleCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1500);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: isDark ? '#1e293b' : '#ffffff',
        borderRadius: '14px',
        overflow: 'hidden',
        cursor: 'pointer',
        border: `1.5px solid ${hovered ? (isDark ? '#334155' : '#e0e7ff') : (isDark ? '#1e293b' : '#f1f5f9')}`,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'box-shadow 0.2s, transform 0.2s, border-color 0.2s',
        height: '100%',
        boxShadow: hovered
          ? isDark ? '0 8px 30px rgba(0,0,0,0.4)' : '0 8px 30px rgba(108,99,255,0.12)'
          : isDark ? '0 2px 8px rgba(0,0,0,0.25)' : '0 2px 8px rgba(0,0,0,0.05)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
    >
      {/* Image container */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: compact ? '78%' : '86%',
        background: isDark ? '#0f172a' : '#f8fafc',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        <img
          src={imgSrc}
          alt={product.name}
          onError={() => setImgErr(true)}
          style={{
            position: 'absolute', top: 0, left: 0,
            width: '100%', height: '100%', objectFit: 'contain',
            padding: '10px',
            transition: 'transform 0.4s ease',
            transform: hovered && !isOutOfStock ? 'scale(1.06)' : 'scale(1)',
          }}
        />

        {/* Discount badge */}
        {discount >= 5 && !isOutOfStock && (
          <div style={{
            position: 'absolute', top: '8px', left: '8px',
            background: accent,
            color: '#fff',
            fontSize: '0.62rem', fontWeight: 800,
            padding: '3px 8px',
            borderRadius: '100px',
            letterSpacing: '0.02em',
          }}>
            {discount}% OFF
          </div>
        )}

        {/* New badge */}
        {product.isNew && !discount && (
          <div style={{
            position: 'absolute', top: '8px', left: '8px',
            background: '#10b981',
            color: '#fff', fontSize: '0.62rem', fontWeight: 800,
            padding: '3px 8px', borderRadius: '100px',
          }}>
            NEW
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={e => { e.stopPropagation(); toggleWishlist(product.id); }}
          style={{
            position: 'absolute', top: '8px', right: '8px',
            width: '30px', height: '30px', borderRadius: '50%',
            background: isDark ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            transition: 'transform 0.2s',
            backdropFilter: 'blur(4px)',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Heart
            size={14}
            fill={isWishlisted ? '#ef4444' : 'none'}
            stroke={isWishlisted ? '#ef4444' : '#94a3b8'}
            strokeWidth={2}
          />
        </button>

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div style={{
            position: 'absolute', inset: 0,
            background: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              fontSize: '0.72rem', fontWeight: 800, color: '#ef4444',
              background: isDark ? '#1e293b' : '#fff',
              padding: '5px 12px', borderRadius: '100px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1.5px solid #fecaca',
            }}>
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{
        padding: compact ? '8px 10px 6px' : '10px 12px 6px',
        flex: 1, display: 'flex', flexDirection: 'column', gap: '4px',
      }}>
        {/* Product name */}
        <div style={{
          fontSize: compact ? '0.77rem' : '0.84rem',
          fontWeight: 500,
          color: isDark ? '#e2e8f0' : '#111827',
          lineHeight: 1.4,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {product.name}
        </div>

        {/* Rating */}
        {product.rating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '2px',
              background: product.rating >= 4.5 ? '#059669'
                : product.rating >= 3.5 ? '#d97706' : '#9ca3af',
              color: '#fff', borderRadius: '4px',
              padding: '1px 5px', fontSize: '0.67rem', fontWeight: 700,
            }}>
              {product.rating} <Star size={7} fill="#fff" stroke="none" />
            </div>
            {product.reviewCount > 0 && (
              <span style={{ fontSize: '0.67rem', color: isDark ? '#64748b' : '#9ca3af' }}>
                ({product.reviewCount >= 1000 ? `${(product.reviewCount / 1000).toFixed(0)}k` : product.reviewCount})
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', flexWrap: 'wrap', marginTop: '2px' }}>
          <span style={{ fontSize: compact ? '0.95rem' : '1.05rem', fontWeight: 800, color: isDark ? '#f1f5f9' : '#111827' }}>
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span style={{ fontSize: '0.72rem', color: isDark ? '#475569' : '#9ca3af', textDecoration: 'line-through' }}>
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Low stock warning */}
        {isLowStock && (
          <span style={{ fontSize: '0.65rem', color: '#f59e0b', fontWeight: 700 }}>
            Only {product.stock} left!
          </span>
        )}

        {/* Free delivery */}
        {product.price >= 499 && !isOutOfStock && (
          <span style={{ fontSize: '0.62rem', color: '#10b981', fontWeight: 600 }}>
            ✓ Free delivery
          </span>
        )}
      </div>

      {/* Add to Cart button */}
      <div style={{ padding: '0 10px 10px' }}>
        <button
          onClick={handleCart}
          disabled={isOutOfStock}
          style={{
            width: '100%',
            padding: compact ? '7px 4px' : '9px 4px',
            borderRadius: '10px',
            fontSize: '0.76rem', fontWeight: 700,
            background: addedAnim
              ? '#059669'
              : isOutOfStock
              ? isDark ? '#1e293b' : '#f3f4f6'
              : hovered ? accent : isDark ? '#334155' : '#f3f4f6',
            color: addedAnim
              ? '#fff'
              : isOutOfStock
              ? isDark ? '#475569' : '#9ca3af'
              : hovered ? '#fff' : isDark ? '#94a3b8' : '#374151',
            cursor: isOutOfStock ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            transition: 'all 0.2s',
            border: 'none',
          }}
        >
          {addedAnim ? (
            <><span>✓</span> Added to Cart</>
          ) : isOutOfStock ? (
            'Unavailable'
          ) : (
            <><ShoppingCart size={13} /> Add to Cart</>
          )}
        </button>
      </div>
    </div>
  );
};
