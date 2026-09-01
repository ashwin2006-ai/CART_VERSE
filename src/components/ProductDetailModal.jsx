import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import {
  X,
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  MapPin,
  Sparkles,
  MessageSquarePlus,
  ChevronRight,
  ExternalLink,
  Tag
} from 'lucide-react';

export const ProductDetailModal = () => {
  const {
    activeProductId,
    setActiveProductId,
    products,
    flipkartProducts,
    reviews,
    wishlist,
    toggleWishlist,
    addToCart,
    addToRecentlyViewed,
    buyNow,
    setReviewProductId
  } = useShop();

  const product = products.find(p => p.id === activeProductId) ||
                  (flipkartProducts || []).find(p => p.id === activeProductId);

  // States
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);

  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
      setSelectedImageIndex(0);
      setSelectedColor(product?.colors?.[0]?.name || '');
      setSelectedSize(product?.sizes?.[0] || '');
      setQuantity(1);
      setPincodeStatus(null);
    }
  }, [product]);

  if (!product) return null;

  const isFlipkart = !!product.isFlipkart || !!product.affiliateUrl;
  const isWishlisted = wishlist.includes(product.id);
  const productReviews = reviews[product.id] || [];
  const isOutOfStock = product.stock <= 0;
  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'];

  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.featured))
    .slice(0, 3);

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincode.trim().length >= 4) {
      setPincodeStatus({
        valid: true,
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
          month: 'short',
          day: 'numeric',
          weekday: 'short'
        }),
        fee: product.price >= 999 ? 'FREE' : '₹99'
      });
    } else {
      setPincodeStatus({ valid: false });
    }
  };

  const handleFlipkartRedirect = () => {
    const url = product.affiliateUrl || product.productUrl || 'https://www.flipkart.com';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(5, 8, 15, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(8px, 3vw, 24px)',
        overflowY: 'auto'
      }}
      onClick={() => setActiveProductId(null)}
    >
      <div
        className="glass-panel animate-scale-in"
        style={{
          background: 'var(--bg-card-solid)',
          width: '100%',
          maxWidth: '1000px',
          maxHeight: '92vh',
          borderRadius: 'var(--radius-xl)',
          overflowY: 'auto',
          position: 'relative',
          border: isFlipkart ? '1px solid #2874f0' : '1px solid var(--border-highlight)',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setActiveProductId(null)}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--bg-surface)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            transition: 'var(--transition-fast)'
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'clamp(20px, 4vw, 36px)',
          padding: 'clamp(20px, 4vw, 36px)'
        }}>
          {/* Left: Image Gallery */}
          <div>
            {/* Main Stage Image */}
            <div style={{
              position: 'relative',
              width: '100%',
              paddingTop: '85%',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '12px'
            }}>
              <img
                src={images[selectedImageIndex] || images[0]}
                alt={product?.name || 'Product'}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />

              {/* Flipkart Assured Badge Overlay */}
              {isFlipkart && (
                <div style={{
                  position: 'absolute',
                  top: '14px',
                  left: '14px',
                  background: '#2874f0',
                  color: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  🛍️ Official Flipkart Partner
                </div>
              )}

              {/* Wishlist toggle on image */}
              <button
                onClick={() => toggleWishlist(product.id)}
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(15, 23, 42, 0.7)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid var(--border-subtle)',
                  color: isWishlisted ? '#f43f5e' : 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Heart size={20} fill={isWishlisted ? '#f43f5e' : 'none'} />
              </button>
            </div>

            {/* Thumbnail Swatches */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: selectedImageIndex === idx ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                      opacity: selectedImageIndex === idx ? 1 : 0.6,
                      flexShrink: 0,
                      padding: 0,
                      background: 'none'
                    }}
                  >
                    <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}

            {/* Value Props under gallery */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              marginTop: '20px',
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                <Truck size={16} style={{ color: 'var(--primary)' }} />
                <span>Express Shipping</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                <ShieldCheck size={16} style={{ color: 'var(--accent-emerald)' }} />
                <span>100% Genuine</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                <RotateCcw size={16} style={{ color: 'var(--accent-gold)' }} />
                <span>7-Day Return Policy</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                <Sparkles size={16} style={{ color: 'var(--primary)' }} />
                <span>GST Tax Invoiced</span>
              </div>
            </div>
          </div>

          {/* Right: Info & Controls Column */}
          <div>
            {/* Category & Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-primary">{product.category}</span>
              {isFlipkart && <span className="badge badge-gold">Flipkart Live Deal</span>}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={15} fill="#f59e0b" color="#f59e0b" />
                <span style={{ fontWeight: 800, fontSize: '0.88rem' }}>{product.rating}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                  ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Product Title */}
            <h1 style={{
              fontSize: 'clamp(1.35rem, 3vw, 1.75rem)',
              fontWeight: 800,
              lineHeight: 1.25,
              marginBottom: '12px',
              color: 'var(--text-primary)'
            }}>
              {product?.name || 'Product'}
            </h1>

            {/* Price section in INR */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '10px',
              marginBottom: '16px',
              paddingBottom: '16px',
              borderBottom: '1px solid var(--border-subtle)',
              flexWrap: 'wrap'
            }}>
              <span style={{
                fontSize: 'clamp(1.6rem, 4vw, 2rem)',
                fontWeight: 900,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-heading)'
              }}>
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span style={{
                  fontSize: '1rem',
                  color: 'var(--text-muted)',
                  textDecoration: 'line-through'
                }}>
                  ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                </span>
              )}
              {product.discount > 0 && (
                <span className="badge badge-rose">
                  Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')} ({product.discount}%)
                </span>
              )}
            </div>

            {/* Flipkart Offers if available */}
            {product.offers && product.offers.length > 0 && (
              <div style={{
                padding: '12px 14px',
                background: 'rgba(40, 116, 240, 0.08)',
                border: '1px solid rgba(40, 116, 240, 0.25)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.82rem', color: '#38bdf8', marginBottom: '6px' }}>
                  <Tag size={15} /> Available Bank & Partner Offers:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {product.offers.map((off, i) => (
                    <div key={i}>• {off}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.88rem',
              lineHeight: 1.55,
              marginBottom: '18px'
            }}>
              {product.description}
            </p>

            {/* Action Buttons */}
            {isFlipkart ? (
              <div style={{ marginTop: '24px' }}>
                <button
                  onClick={handleFlipkartRedirect}
                  className="btn btn-primary btn-lg"
                  style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '1.05rem',
                    fontWeight: 900,
                    gap: '10px',
                    background: 'linear-gradient(135deg, #2874f0 0%, #1e3a8a 100%)',
                    boxShadow: '0 8px 30px rgba(40, 116, 240, 0.45)'
                  }}
                >
                  <span>Buy on Flipkart (Official Affiliate)</span>
                  <ExternalLink size={20} />
                </button>
                <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                  Secure redirect via Cartverse Affiliate Integration (Tracking ID: {process.env.FLIPKART_AFFILIATE_ID || 'cartvers01'})
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  disabled={isOutOfStock}
                  onClick={() => addToCart(product, quantity, selectedColor, selectedSize)}
                  className="btn btn-secondary btn-lg"
                  style={{ flex: 1, minWidth: '130px', gap: '6px' }}
                >
                  <ShoppingBag size={17} />
                  <span>Add to Bag</span>
                </button>

                <button
                  disabled={isOutOfStock}
                  onClick={() => buyNow(product, selectedColor, selectedSize)}
                  className="btn btn-primary btn-lg"
                  style={{ flex: 1.2, minWidth: '150px', gap: '6px' }}
                >
                  <Zap size={17} />
                  <span>Buy Now (₹{Number(product.price).toLocaleString('en-IN')})</span>
                </button>
              </div>
            )}

            {/* Specifications Key-Value List */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 800, marginBottom: '10px' }}>Technical Specifications</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px', fontSize: '0.8rem' }}>
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', borderRadius: '4px', background: 'var(--bg-surface)' }}>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{key}</span>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
