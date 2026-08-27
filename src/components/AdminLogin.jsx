import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, KeyRound, ArrowLeft, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminLogin = () => {
  const { adminLogin, setCurrentView, adminAuth } = useShop();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      const res = adminLogin(email, password);
      setIsSubmitting(false);
      if (!res.success) {
        setErrorMsg(res.error || 'Authentication failed. Please check credentials.');
      }
    }, 600);
  };

  const handleFillDemo = () => {
    setEmail('ashwin@cartverse.io');
    setPassword(adminAuth.passwordHash || 'Ashwin@123!');
    setErrorMsg('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #0b0f19 70%)',
      position: 'relative'
    }}>
      <style>{`
        @media (max-width: 768px) {
          .admin-return-btn {
            top: 16px !important;
            left: 16px !important;
            font-size: 0.75rem !important;
            padding: 8px 12px !important;
          }
          .admin-login-card {
            padding: 32px 20px !important;
            max-width: 100% !important;
          }
          .admin-header-icon {
            width: 56px !important;
            height: 56px !important;
          }
          .admin-header-icon svg {
            width: 28px !important;
            height: 28px !important;
          }
          .admin-title {
            font-size: 1.4rem !important;
          }
          .admin-subtitle {
            font-size: 0.8rem !important;
          }
        }
        @media (max-width: 480px) {
          .admin-login-card {
            padding: 24px 16px !important;
          }
          .admin-title {
            font-size: 1.2rem !important;
          }
          .admin-header-icon {
            width: 48px !important;
            height: 48px !important;
          }
          .admin-header-icon svg {
            width: 24px !important;
            height: 24px !important;
          }
        }
      `}</style>
      
      {/* Return to Customer Storefront Button */}
      <button
        onClick={() => {
          setCurrentView('store');
          window.location.hash = '';
        }}
        className="btn btn-secondary admin-return-btn"
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          gap: '8px',
          fontSize: '0.84rem'
        }}
      >
        <ArrowLeft size={16} />
        <span>Return to Storefront</span>
      </button>

      {/* Main Login Card */}
      <div
        className="glass-panel animate-scale-in admin-login-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '40px 32px',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--bg-card-solid)',
          border: '1px solid var(--border-highlight)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7)'
        }}
      >
        {/* Security Shield Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="admin-header-icon" style={{
            width: '68px',
            height: '68px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4)',
            marginBottom: '16px'
          }}>
            <ShieldCheck size={36} />
          </div>

          <span className="badge badge-gold" style={{ marginBottom: '8px' }}>
            Authorized Personnel Only
          </span>

          <h1 className="admin-title" style={{
            fontSize: '1.75rem',
            fontWeight: 900,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em'
          }}>
            CART<span className="gradient-text">VERSE</span> <span style={{ color: 'var(--accent-gold)' }}>Admin Portal</span>
          </h1>

          <p className="admin-subtitle" style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            marginTop: '4px'
          }}>
            Encrypted management gateway for inventory, orders, and sales telemetry.
          </p>
        </div>

        {/* Demo Credentials Quick-Fill Pill - REMOVED FOR SECURITY */}
        {false && (
          <div
            onClick={handleFillDemo}
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px dashed rgba(245, 158, 11, 0.4)',
              marginBottom: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
            title="Click to fill demo credentials"
          >
            <div style={{ fontSize: '0.78rem', color: '#fbbf24', lineHeight: 1.4 }}>
              <div>🔑 <strong>Demo Access:</strong> ashwin@cartverse.io</div>
              <div>Password: <strong>Ashwin@123!</strong></div>
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--accent-gold)', background: 'rgba(245, 158, 11, 0.2)', padding: '3px 8px', borderRadius: '4px' }}>
              Auto Fill
            </span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fb7185',
            fontSize: '0.82rem',
            fontWeight: 600,
            marginBottom: '20px'
          }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Administrator Email
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0 14px'
            }}>
              <Mail size={16} style={{ color: 'var(--text-muted)', marginRight: '10px' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cartverse.io"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  padding: '12px 0',
                  fontSize: '0.9rem',
                  boxShadow: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Security Master Key
              </label>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0 14px'
            }}>
              <Lock size={16} style={{ color: 'var(--text-muted)', marginRight: '10px' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  padding: '12px 0',
                  fontSize: '0.9rem',
                  boxShadow: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ color: 'var(--text-muted)', padding: '4px' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* 2FA Token Simulation Field */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                2FA Hardware Token
              </label>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                ● Authenticator Linked
              </span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0 14px'
            }}>
              <KeyRound size={16} style={{ color: 'var(--text-muted)', marginRight: '10px' }} />
              <input
                type="text"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                placeholder="6-digit authenticator code"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  padding: '12px 0',
                  fontSize: '0.9rem',
                  letterSpacing: '0.1em',
                  boxShadow: 'none'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-gold btn-lg"
            style={{ width: '100%', marginTop: '8px', fontWeight: 800 }}
          >
            {isSubmitting ? (
              <span>Authenticating Gateway...</span>
            ) : (
              <span>Authorize & Access Dashboard</span>
            )}
          </button>
        </form>

        {/* Security badges footer */}
        <div style={{
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={13} style={{ color: 'var(--accent-emerald)' }} /> 256-Bit SSL Encrypted
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={13} style={{ color: 'var(--accent-emerald)' }} /> IP Restricted
          </span>
        </div>
      </div>
    </div>
  );
};
