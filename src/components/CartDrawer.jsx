import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  X,
  Trash2,
  Heart,
  ShoppingBag,
  Tag,
  ArrowRight,
  Sparkles,
  Truck,
  CheckCircle2
} from 'lucide-react';

export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    toggleWishlist,
    getCartTotals,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen,
    coupons
  } = useShop();

  const [couponCodeInput, setCouponCodeInput] = useState('');

  if (!isCartOpen) return null;

  const totals = getCartTotals();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    const ok = applyCoupon(couponCodeInput);
    if (ok) setCouponCodeInput('');
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(5, 8, 15, 0.75)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 2100,
        display: 'flex',
        justifyContent: 'flex-end'
      }}
      onClick={() => setIsCartOpen(false)}
    >
      <div
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          background: 'var(--bg-card-solid)',
          borderLeft: '1px solid var(--border-highlight)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-surface)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
              Shopping Bag ({cart.reduce((t, i) => t + i.quantity, 0)})
            </h2>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="btn-icon btn-secondary"
            style={{ width: '34px', height: '34px', borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator (INR ₹999 threshold) */}
        <div style={{
          padding: '12px 24px',
          background: 'var(--primary-light)',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '6px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Truck size={15} style={{ color: 'var(--primary)' }} />
              {totals.progressToFreeShipping >= 100 || (appliedCoupon && appliedCoupon.type === 'shipping') ? (
                <span style={{ color: 'var(--accent-emerald)', fontWeight: 800 }}>
                  🎉 You unlocked FREE Express Delivery!
                </span>
              ) : (
                <span>
                  Add <strong>₹{(totals.freeShippingThreshold - totals.subtotal).toLocaleString('en-IN')}</strong> for FREE Delivery
                </span>
              )}
            </div>
            <span>{Math.min(100, totals.progressToFreeShipping)}%</span>
          </div>

          <div style={{
            width: '100%',
            height: '6px',
            borderRadius: '3px',
            background: 'var(--bg-surface)',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${totals.progressToFreeShipping}%`,
              height: '100%',
              background: 'var(--primary-gradient)',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {/* Cart Item List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {cart.length === 0 ? (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '40px 20px'
            }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'var(--bg-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                marginBottom: '16px'
              }}>
                <ShoppingBag size={32} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px' }}>Your Bag is Empty</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '260px' }}>
                Discover our curated selections of audio, fashion, and lifestyle essentials.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="btn btn-primary"
              >
                Start Shopping Now
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div
                key={`${item.id}-${item.color}-${item.size}-${index}`}
                style={{
                  display: 'flex',
                  gap: '14px',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  position: 'relative'
                }}
              >
                {/* Item Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '76px',
                    height: '76px',
                    borderRadius: 'var(--radius-sm)',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: '4px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.name}
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    fontSize: '0.74rem',
                    color: 'var(--text-muted)',
                    marginBottom: '10px'
                  }}>
                    <span>Color: <strong>{item.color}</strong></span>
                    <span>•</span>
                    <span>Size: <strong>{item.size}</strong></span>
                  </div>

                  {/* Quantity & Unit Price in INR */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'var(--bg-card)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '2px 8px',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      <button
                        onClick={() => updateCartQuantity(index, item.quantity - 1)}
                        style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-secondary)' }}
                      >
                        -
                      </button>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: '18px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(index, item.quantity + 1)}
                        style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-secondary)' }}
                      >
                        +
                      </button>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Remove & Wishlist Buttons */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end'
                }}>
                  <button
                    onClick={() => removeFromCart(index)}
                    style={{
                      color: 'var(--text-muted)',
                      padding: '4px'
                    }}
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>

                  <button
                    onClick={() => {
                      toggleWishlist(item.id);
                      removeFromCart(index);
                    }}
                    style={{
                      color: 'var(--text-muted)',
                      padding: '4px'
                    }}
                    title="Move to wishlist"
                  >
                    <Heart size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Box */}
        {cart.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)'
          }}>
            {/* Promo Code Box */}
            <div style={{ marginBottom: '16px' }}>
              {appliedCoupon ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  fontSize: '0.82rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: 700 }}>
                    <Tag size={15} />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> Applied</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    style={{ color: 'var(--accent-rose)', fontSize: '0.75rem', fontWeight: 700 }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. SAVE20)"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.82rem',
                        textTransform: 'uppercase'
                      }}
                    />
                    <button type="submit" className="btn btn-secondary btn-sm">
                      Apply
                    </button>
                  </form>

                  {/* Available Coupon Chips */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {coupons.filter(c => c.active).slice(0, 3).map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => applyCoupon(c.code)}
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: 'var(--primary-light)',
                          color: 'var(--primary)',
                          border: '1px dashed var(--primary)'
                        }}
                      >
                        +{c.code}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Price Calculations in INR */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>₹{totals.subtotal.toLocaleString('en-IN')}</span>
              </div>

              {totals.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                  <span>Coupon Savings</span>
                  <span>-₹{totals.discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Estimated Delivery</span>
                <span>{totals.shippingFee === 0 ? <strong style={{ color: 'var(--accent-emerald)' }}>FREE</strong> : `₹${totals.shippingFee}`}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>GST (18% Estimated)</span>
                <span>₹{totals.tax.toLocaleString('en-IN')}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.15rem',
                fontWeight: 900,
                color: 'var(--text-primary)',
                paddingTop: '10px',
                borderTop: '1px solid var(--border-subtle)',
                marginTop: '4px'
              }}>
                <span>Total Due</span>
                <span className="gradient-text">₹{totals.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '1rem',
                borderRadius: 'var(--radius-md)',
                gap: '8px'
              }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
