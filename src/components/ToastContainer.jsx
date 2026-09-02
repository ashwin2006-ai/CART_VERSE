import React from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts = [], removeToast } = useShop();

  if (!Array.isArray(toasts) || toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '380px',
      width: '100%',
      pointerEvents: 'none'
    }}>
      {toasts.map(toast => {
        let Icon = Info;
        let borderColor = 'var(--primary)';
        let bgGlow = 'rgba(99, 102, 241, 0.15)';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderColor = 'var(--accent-emerald)';
          bgGlow = 'rgba(16, 185, 129, 0.15)';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          borderColor = 'var(--accent-rose)';
          bgGlow = 'rgba(244, 63, 94, 0.15)';
        }

        return (
          <div
            key={toast.id}
            className="animate-fade-in"
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card-solid)',
              border: `1px solid ${borderColor}`,
              boxShadow: `0 8px 30px rgba(0, 0, 0, 0.5), 0 0 20px ${bgGlow}`,
              backdropFilter: 'blur(12px)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{
              color: borderColor,
              marginTop: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Icon size={20} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '0.9rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '2px'
              }}>
                {toast.title}
              </div>
              <div style={{
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.4
              }}>
                {toast.message}
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              style={{
                color: 'var(--text-muted)',
                padding: '2px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
