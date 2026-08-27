import React from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle2, Package, Truck, ArrowRight, X, Sparkles, MapPin } from 'lucide-react';

export const OrderConfirmationModal = () => {
  const {
    recentOrder,
    setRecentOrder,
    setTrackingOrderId,
    setCurrentView
  } = useShop();

  if (!recentOrder) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(5, 8, 15, 0.88)',
        backdropFilter: 'blur(14px)',
        zIndex: 2300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={() => setRecentOrder(null)}
    >
      <div
        className="glass-panel animate-scale-in"
        style={{
          background: 'var(--bg-card-solid)',
          width: '100%',
          maxWidth: '560px',
          borderRadius: 'var(--radius-xl)',
          padding: '36px',
          border: '1px solid var(--border-highlight)',
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'center',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setRecentOrder(null)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            color: 'var(--text-muted)'
          }}
        >
          <X size={20} />
        </button>

        {/* Success Icon Badge */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '2px solid var(--accent-emerald)',
          color: 'var(--accent-emerald)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto',
          boxShadow: '0 0 25px rgba(16, 185, 129, 0.3)'
        }}>
          <CheckCircle2 size={40} />
        </div>

        <span className="badge badge-emerald" style={{ marginBottom: '10px' }}>
          Payment & Order Confirmed
        </span>

        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: 900,
          marginBottom: '8px',
          color: 'var(--text-primary)'
        }}>
          Thank You for Your Order!
        </h2>

        <p style={{
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          marginBottom: '24px'
        }}>
          Order <strong>#{recentOrder?.id || 'N/A'}</strong> has been received and dispatched to our priority fulfillment center.
        </p>

        {/* Info Card */}
        <div style={{
          padding: '16px',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          textAlign: 'left',
          marginBottom: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          fontSize: '0.84rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Estimated Delivery:</span>
            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{recentOrder?.estimatedDelivery || 'N/A'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Tracking Number:</span>
            <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{recentOrder?.trackingNumber || 'N/A'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Shipping Destination:</span>
            <span style={{ fontWeight: 600 }}>{recentOrder?.shippingAddress?.street || 'N/A'}, {recentOrder?.shippingAddress?.city || 'N/A'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Total Amount Paid:</span>
            <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>₹{(recentOrder?.total || 0).toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => {
              const id = recentOrder?.id;
              setRecentOrder(null);
              if (id) setTrackingOrderId(id);
            }}
            className="btn btn-primary"
            style={{ flex: 1.2, gap: '8px' }}
          >
            <Truck size={18} />
            <span>Track Order Progress</span>
          </button>

          <button
            onClick={() => {
              setRecentOrder(null);
              setCurrentView('store');
            }}
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
