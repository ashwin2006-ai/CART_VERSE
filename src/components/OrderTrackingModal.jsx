import React from 'react';
import { useShop } from '../context/ShopContext';
import {
  X,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Package,
  ShieldCheck,
  Phone,
  FileText
} from 'lucide-react';

export const OrderTrackingModal = () => {
  const { trackingOrderId, setTrackingOrderId, orders } = useShop();

  if (!trackingOrderId) return null;

  const order = orders.find(o => o.id === trackingOrderId);
  if (!order) return null;

  const stepsList = [
    { label: 'Order Placed', desc: 'Received & logged in system' },
    { label: 'Payment Verified', desc: 'Secure payment confirmed' },
    { label: 'Packed & Dispatched', desc: 'Prepared at fulfillment hub' },
    { label: 'In Transit with Express', desc: order.currentLocation || 'Carrier Hub' },
    { label: 'Out for Delivery', desc: 'With local courier agent' },
    { label: 'Delivered', desc: 'Signed & completed' }
  ];

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
        zIndex: 2400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto'
      }}
      onClick={() => setTrackingOrderId(null)}
    >
      <div
        className="glass-panel animate-scale-in"
        style={{
          background: 'var(--bg-card-solid)',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          borderRadius: 'var(--radius-xl)',
          overflowY: 'auto',
          position: 'relative',
          border: '1px solid var(--border-highlight)',
          boxShadow: 'var(--shadow-lg)',
          padding: '32px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Truck size={22} style={{ color: 'var(--primary)' }} />
              <h2 style={{ fontSize: '1.35rem', fontWeight: 900 }}>Live Package Tracking</h2>
            </div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Order ID: <strong>{order.id}</strong> • Tracking #{order.trackingNumber}
            </span>
          </div>

          <button
            onClick={() => setTrackingOrderId(null)}
            className="btn-icon btn-secondary"
            style={{ width: '36px', height: '36px', borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Status Card Banner */}
        <div style={{
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          background: order.status === 'Delivered' ? 'rgba(16, 185, 129, 0.15)' : 'var(--primary-light)',
          border: order.status === 'Delivered' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-active)',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--primary)' }}>
              Current Status
            </span>
            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              {order.status}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Carrier: <strong>{order.carrier}</strong>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-muted)' }}>
              Expected Delivery
            </span>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
              {order.estimatedDelivery}
            </div>
          </div>
        </div>

        {/* Step-by-Step Progress Tracker */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '20px' }}>
            Shipment Timeline
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
            {stepsList.map((step, idx) => {
              const isCompleted = idx + 1 <= order.statusStep;
              const isCurrent = idx + 1 === order.statusStep;

              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    position: 'relative',
                    paddingBottom: idx === stepsList.length - 1 ? '0' : '24px'
                  }}
                >
                  {/* Vertical connecting line */}
                  {idx < stepsList.length - 1 && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '15px',
                        top: '30px',
                        bottom: '0',
                        width: '2px',
                        background: isCompleted ? 'var(--accent-emerald)' : 'var(--border-subtle)',
                        zIndex: 1
                      }}
                    />
                  )}

                  {/* Icon Indicator */}
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: isCompleted
                        ? 'var(--accent-emerald)'
                        : isCurrent
                        ? 'var(--primary)'
                        : 'var(--bg-surface)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      zIndex: 2,
                      boxShadow: isCompleted || isCurrent ? '0 0 12px rgba(99, 102, 241, 0.4)' : 'none'
                    }}
                  >
                    {isCompleted ? <CheckCircle size={16} /> : idx + 1}
                  </div>

                  {/* Step Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '0.9rem',
                      fontWeight: isCompleted || isCurrent ? 800 : 500,
                      color: isCompleted || isCurrent ? 'var(--text-primary)' : 'var(--text-muted)'
                    }}>
                      {step.label}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Destination & Package Items */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          padding: '16px',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.82rem'
        }}>
          <div>
            <div style={{ fontWeight: 800, color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={13} /> Destination Address:
            </div>
            <div style={{ fontWeight: 700 }}>{order?.shippingAddress?.fullName || 'N/A'}</div>
            <div style={{ color: 'var(--text-secondary)' }}>{order?.shippingAddress?.street || 'N/A'}, {order?.shippingAddress?.city || 'N/A'}</div>
          </div>

          <div>
            <div style={{ fontWeight: 800, color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Package size={13} /> Package Contents:
            </div>
            {order.items.map((it, i) => (
              <div key={i} style={{ color: 'var(--text-secondary)' }}>
                • {it.quantity}x {it?.name?.substring(0, 24) || 'Product'}...
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
