import React from 'react';
import { useShop } from '../context/ShopContext';
import { Star, Heart, Eye, ShoppingBag, Zap, Check, ExternalLink } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const {
    wishlist,
    toggleWishlist,
    setActiveProductId,
    addToCart,
    buyNow,
    recordRecentlyViewed
  } = useShop();

  const isWishlisted = wishlist.includes(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isFlipkart = !!product.isFlipkart || !!product.affiliateUrl;

  const handleCardClick = () => {
    recordRecentlyViewed(product.id);
    setActiveProductId(product.id);
  };

  const handleFlipkartRedirect = (e) => {
    e.stopPropagation();
    const url = product.affiliateUrl || product.productUrl || 'https://www.flipkart.com';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="glass-panel"
      style={{
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        border: isFlipkart ? '1px solid rgba(40, 116, 240, 0.4)' : '1px solid var(--border-subtle)',
        background: 'var(--bg-card)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.borderColor = isFlipkart ? '#2874f0' : 'var(--border-active)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = isFlipkart ? 'rgba(40, 116, 240, 0.4)' : 'var(--border-subtle)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Top Image Box */}
      <div
        onClick={handleCardClick}
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '90%',
          cursor: 'pointer',
          overflow: 'hidden',
          background: 'var(--bg-surface)'
        }}
      >
        <img
          src={product.images ? product.images[0] : (product.imageUrl || '')}
          alt={product.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />

        {/* Badges Overlay */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          zIndex: 2
        }}>
          {isFlipkart && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: '4px',
              background: '#2874f0',
              color: '#ffffff',
              fontSize: '0.68rem',
              fontWeight: 800,
              boxShadow: '0 2px 8px rgba(40, 116, 240, 0.4)'
            }}>
              🛍️ Marketplace Partner (Flipkart)
            </span>
          )}

          {product.discount > 0 && (
            <span className="badge badge-rose" style={{ boxShadow: '0 2px 8px rgba(244, 63, 94, 0.3)' }}>
              -{product.discount}% OFF
            </span>
          )}
          {product.bestSeller && !isFlipkart && (
            <span className="badge badge-gold">
              Best Seller
            </span>
          )}
          {product.isNew && (
            <span className="badge badge-primary">
              New Arrival
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-subtle)',
            color: isWishlisted ? '#f43f5e' : 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3,
            transition: 'var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart size={18} fill={isWishlisted ? '#f43f5e' : 'none'} />
        </button>

        {/* Quick View Button on Image Bottom */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            color: '#ffffff',
            border: '1px solid var(--border-highlight)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 2,
            opacity: 0.9,
            transition: 'var(--transition-fast)'
          }}
        >
          <Eye size={14} /> Quick View
        </button>
      </div>

      {/* Product Details Content */}
      <div style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1
      }}>
        {/* Category & Ratings */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '6px'
        }}>
          <span style={{
            fontSize: '0.74rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 700,
            color: isFlipkart ? '#38bdf8' : 'var(--text-muted)'
          }}>
            {isFlipkart ? `Flipkart • ${product.category || 'General'}` : product.category}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {product.rating}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              ({product.reviewCount})
            </span>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={handleCardClick}
          style={{
            fontSize: '0.98rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.35,
            marginBottom: '10px',
            cursor: 'pointer',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {product.name}
        </h3>

        {/* Price & Stock info */}
        <div style={{
          marginTop: 'auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '14px'
        }}>
          <div>
            <span style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-heading)'
            }}>
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span style={{
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                textDecoration: 'line-through',
                marginLeft: '8px'
              }}>
                ₹{Number(product.originalPrice).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div>
            {isFlipkart ? (
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#38bdf8' }}>
                Verified Partner
              </span>
            ) : isOutOfStock ? (
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-rose)' }}>
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                Only {product.stock} left!
              </span>
            ) : (
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Check size={12} /> In Stock
              </span>
            )}
          </div>
        </div>

        {/* Card Action Buttons */}
        {isFlipkart ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '8px' }}>
            <button
              onClick={handleCardClick}
              className="btn btn-secondary btn-sm"
              style={{
                gap: '4px',
                fontSize: '0.78rem',
                padding: '8px 6px'
              }}
            >
              <Eye size={14} />
              <span>Details</span>
            </button>

            <button
              onClick={handleFlipkartRedirect}
              className="btn btn-primary btn-sm"
              style={{
                gap: '6px',
                fontSize: '0.8rem',
                padding: '8px 10px',
                background: 'linear-gradient(135deg, #2874f0 0%, #0c4a6e 100%)',
                borderColor: '#2874f0'
              }}
              title="Redirects to official Flipkart affiliate page"
            >
              <span>Buy on Flipkart</span>
              <ExternalLink size={14} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              disabled={isOutOfStock}
              onClick={() => addToCart(product, 1)}
              className="btn btn-secondary btn-sm"
              style={{
                gap: '6px',
                fontSize: '0.8rem',
                padding: '8px 10px',
                opacity: isOutOfStock ? 0.5 : 1
              }}
            >
              <ShoppingBag size={15} />
              <span>Add to Bag</span>
            </button>

            <button
              disabled={isOutOfStock}
              onClick={() => buyNow(product)}
              className="btn btn-primary btn-sm"
              style={{
                gap: '6px',
                fontSize: '0.8rem',
                padding: '8px 10px',
                opacity: isOutOfStock ? 0.5 : 1
              }}
            >
              <Zap size={14} />
              <span>Buy Now</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
