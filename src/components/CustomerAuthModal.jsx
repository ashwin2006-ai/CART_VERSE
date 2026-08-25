import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';

export const CustomerAuthModal = ({ isOpen, onClose }) => {
  const { user, setUser, addToast, setCurrentView } = useShop();

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === 'register') {
      if (!formData.name || !formData.email || !formData.password) return;

      const newUser = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '+91 98765 43210',
        tier: 'Standard Member',
        rewardPoints: 0, // 0 reward points for new person
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        addresses: []
      };

      setUser(newUser);
      addToast({
        type: 'success',
        title: 'Account Created 🎉',
        message: `Welcome ${formData.name}! Complete your profile details and address.`
      });
      onClose();
      setCurrentView('account');
    } else {
      // Login mode
      if (!formData.email || !formData.password) return;

      if (formData.email.toLowerCase() === 'admin@cartverse.io') {
        addToast({
          type: 'info',
          title: 'Admin Detected 🛡️',
          message: 'Redirecting to Secure Admin Portal...'
        });
        onClose();
        setCurrentView('admin');
        window.location.hash = '#admin';
        return;
      }

      setUser({
        ...user,
        email: formData.email,
        name: formData.email.split('@')[0].toUpperCase()
      });

      addToast({
        type: 'success',
        title: 'Welcome Back! 👋',
        message: `Signed in as ${formData.email}`
      });
      onClose();
      setCurrentView('account');
    }
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
        zIndex: 2500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel animate-scale-in"
        style={{
          background: 'var(--bg-card-solid)',
          width: '100%',
          maxWidth: '440px',
          borderRadius: 'var(--radius-xl)',
          padding: '32px',
          border: '1px solid var(--border-highlight)',
          position: 'relative',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--bg-surface)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={16} />
        </button>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'var(--primary-gradient)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            marginBottom: '12px',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
          }}>
            <Sparkles size={22} />
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: 900, marginBottom: '4px' }}>
            {mode === 'login' ? 'Sign In to Cartverse' : 'Create Customer Account'}
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            {mode === 'login'
              ? 'Access saved addresses, order tracking, and VIP perks'
              : 'Sign up in seconds and get 100 welcome reward points'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-surface)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px'
        }}>
          <button
            onClick={() => setMode('login')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.84rem',
              fontWeight: 700,
              background: mode === 'login' ? 'var(--primary-gradient)' : 'transparent',
              color: mode === 'login' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.84rem',
              fontWeight: 700,
              background: mode === 'register' ? 'var(--primary-gradient)' : 'transparent',
              color: mode === 'register' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {mode === 'register' && (
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Full Name</label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0 12px' }}>
                <User size={16} style={{ color: 'var(--text-muted)', marginRight: '8px' }} />
                <input
                  type="text"
                  placeholder="e.g. Alex Mercer"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', background: 'transparent', border: 'none', padding: '10px 0', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Email Address</label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0 12px' }}>
              <Mail size={16} style={{ color: 'var(--text-muted)', marginRight: '8px' }} />
              <input
                type="email"
                placeholder="name@example.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ width: '100%', background: 'transparent', border: 'none', padding: '10px 0', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Phone Number (Optional)</label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0 12px' }}>
                <Phone size={16} style={{ color: 'var(--text-muted)', marginRight: '8px' }} />
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{ width: '100%', background: 'transparent', border: 'none', padding: '10px 0', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Password</label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0 12px' }}>
              <Lock size={16} style={{ color: 'var(--text-muted)', marginRight: '8px' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{ width: '100%', background: 'transparent', border: 'none', padding: '10px 0', fontSize: '0.85rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ color: 'var(--text-muted)', padding: '4px' }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '6px', fontWeight: 800 }}
          >
            <span>{mode === 'login' ? 'Sign In' : 'Create My Account'}</span>
            <ArrowRight size={17} />
          </button>
        </form>

        {/* Quick Demo Autofill helper */}
        <div style={{
          marginTop: '18px',
          padding: '10px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--bg-surface)',
          border: '1px dashed var(--border-active)',
          fontSize: '0.75rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>Demo Customer: <code>alex.mercer@lumina.io</code></span>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setFormData({
                name: 'Alex Mercer',
                email: 'alex.mercer@lumina.io',
                phone: '+1 (555) 389-2041',
                password: 'Password@123'
              });
            }}
            style={{ color: 'var(--primary)', fontWeight: 800, textDecoration: 'underline' }}
          >
            Auto Fill
          </button>
        </div>

        {/* Administrator Portal Switcher */}
        <div style={{
          marginTop: '12px',
          textAlign: 'center',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          <button
            type="button"
            onClick={() => {
              onClose();
              setCurrentView('admin');
              window.location.hash = '#admin';
            }}
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#f59e0b',
              background: 'transparent',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <ShieldCheck size={15} />
            <span>Store Administrator & Staff Portal ↗</span>
          </button>
        </div>
      </div>
    </div>
  );
};
