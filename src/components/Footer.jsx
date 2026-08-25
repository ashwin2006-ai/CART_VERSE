import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Sparkles, Send, ShieldCheck, Truck, RotateCcw, Heart, CheckCircle2, Lock, Mail } from 'lucide-react';

export const Footer = () => {
  const { setSelectedCategory, setCurrentView, addToast } = useShop();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail.includes('@')) return;
    setSubscribed(true);
    addToast({
      type: 'success',
      title: 'Subscribed to Cartverse Insider 📩',
      message: 'Exclusive 15% discount code sent to your inbox!'
    });
    setNewsletterEmail('');
  };

  return (
    <footer style={{
      background: 'var(--bg-card-solid)',
      borderTop: '1px solid var(--border-subtle)',
      paddingTop: '64px',
      paddingBottom: '32px',
      marginTop: '64px'
    }}>
      <div className="container">
        {/* Top Newsletter & Brand Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '40px',
          paddingBottom: '48px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <Sparkles size={18} />
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
                CART<span className="gradient-text">VERSE</span>
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px', maxWidth: '340px' }}>
              Pioneering modern global commerce with curated lifestyle products, intelligent AI recommendations, and instant doorstep fulfillment across India.
            </p>
            
            {/* Creator / Support Gmail Contact */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.82rem',
              marginBottom: '16px'
            }}>
              <Mail size={16} style={{ color: 'var(--primary)' }} />
              <span>Gmail: <a href="mailto:ashwincreator@gmail.com" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>ashwincreator@gmail.com</a></span>
            </div>

            <div style={{ display: 'flex', gap: '12px', fontSize: '0.82rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={16} /> 100% Genuine
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Truck size={16} /> Express Delivery
              </span>
            </div>
          </div>

          {/* Categories Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '16px', color: 'var(--text-primary)' }}>
              Explore Cartverse
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              {['electronics', 'fashion', 'footwear', 'accessories', 'home'].map((cat) => (
                <span
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentView('store');
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  style={{ cursor: 'pointer', textTransform: 'capitalize', transition: 'color var(--transition-fast)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  {cat === 'electronics' ? 'Audio & Tech (₹)' : cat}
                </span>
              ))}
            </div>
          </div>

          {/* Customer Concierge & Support */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '16px', color: 'var(--text-primary)' }}>
              Customer Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              <span onClick={() => setCurrentView('account')} style={{ cursor: 'pointer' }}>Track Your Order</span>
              <span onClick={() => setCurrentView('account')} style={{ cursor: 'pointer' }}>Return & Exchange Center</span>
              <span onClick={() => setCurrentView('account')} style={{ cursor: 'pointer' }}>VIP Rewards Program</span>
              <a href="mailto:ashwincreator@gmail.com" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>Email Support: ashwincreator@gmail.com</span>
              </a>
              <span style={{ cursor: 'pointer' }}>24/7 Live Concierge</span>
            </div>
          </div>

          {/* Newsletter Box */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>
              Join Cartverse Insider
            </h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Subscribe to receive exclusive deals, new arrivals, and an instant 15% discount code.
            </p>

            {subscribed ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--accent-emerald)',
                fontSize: '0.85rem',
                fontWeight: 700
              }}>
                <CheckCircle2 size={18} />
                <span>You're on the VIP list!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="email"
                  placeholder="Enter your email..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem'
                  }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '10px 16px' }}>
                  <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Payment Badges & Copyright & Discreet Admin Link */}
        <div style={{
          paddingTop: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span>© 2026 CARTVERSE INC. All Rights Reserved.</span>
            <span>•</span>
            <span>Official Contact: <strong>ashwincreator@gmail.com</strong></span>
            <span>•</span>
            <button
              onClick={() => {
                setCurrentView('admin');
                window.location.hash = '#admin';
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: 'var(--text-muted)',
                fontSize: '0.76rem',
                cursor: 'pointer'
              }}
              title="Secure Merchant Management Gateway"
            >
              <Lock size={12} /> Merchant Portal
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontWeight: 700 }}>
            <span>UPI (GPay/PhonePe/Paytm)</span>
            <span>RUPAY</span>
            <span>VISA</span>
            <span>MASTERCARD</span>
            <span>NET BANKING</span>
            <span>COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
