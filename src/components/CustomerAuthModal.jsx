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

export const CustomerAuthModal = ({ isOpen, onClose, defaultMode = 'login', nonDismissible = false }) => {
  const { user, setUser, addToast, setCurrentView } = useShop();

  const [mode, setMode] = useState(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  if (!isOpen) return null;

  // ── Local Auth Helpers (fallback when API unavailable) ────────────────
  const LOCAL_USERS_KEY = 'cartverse_local_users';

  const getLocalUsers = () => {
    try { return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]'); } catch { return []; }
  };

  const saveLocalUser = (u) => {
    const users = getLocalUsers();
    users.push(u);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  };

  const loginLocalUser = (email, password) => {
    return getLocalUsers().find(u => u.email === email && u.password === password) || null;
  };

  const registerLocalUser = (name, email, password, phone) => {
    const users = getLocalUsers();
    if (users.find(u => u.email === email)) return { error: 'Email already registered. Please sign in.' };
    const u = { id: 'local-' + Date.now(), name, email, password, phone, tier: 'Standard Member', rewardPoints: 100, addresses: [] };
    saveLocalUser(u);
    return { user: u };
  };

  // ── API auth with local fallback ───────────────────────────────────────
  const tryApi = async (endpoint, body) => {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) return null; // 405 or other server error → use local
      const text = await res.text();
      if (!text.startsWith('{')) return null; // HTML page returned → use local
      return JSON.parse(text);
    } catch {
      return null; // network error → use local
    }
  };

  const loginUser = (userData) => {
    const { password, ...safeUser } = userData;
    const cleanUser = {
      id: safeUser?.id || 'local-' + Date.now(),
      name: safeUser?.name || 'User',
      email: safeUser?.email || '',
      phone: safeUser?.phone || '',
      tier: safeUser?.tier || 'Standard Member',
      rewardPoints: safeUser?.rewardPoints || 100,
      avatar: safeUser?.avatar || '',
      addresses: safeUser?.addresses || [],
    };
    setUser(cleanUser);
    // Save with the key that ShopContext's loadLocal('user') reads: aura_user
    localStorage.setItem('aura_user', JSON.stringify(cleanUser));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'register') {
        if (!formData.name || !formData.email || !formData.password) {
          addToast({ type: 'error', title: 'Missing Fields', message: 'Please fill in all required fields.' });
          setIsLoading(false); return;
        }

        // Try API first
        const apiResult = await tryApi('/api/auth/register', {
          name: formData.name, email: formData.email,
          password: formData.password, phone: formData.phone
        });

        if (apiResult?.success) {
          if (apiResult.token) localStorage.setItem('cartverse_token', apiResult.token);
          loginUser({ ...apiResult?.user, rewardPoints: 100 });
          addToast({ type: 'success', title: 'Account Created 🎉', message: `Welcome ${apiResult?.user?.name || 'User'}! You have 100 reward points.` });
          onClose(); setCurrentView('store');
        } else if (apiResult && !apiResult.success) {
          addToast({ type: 'error', title: 'Registration Failed', message: apiResult.message || 'Email may already be in use.' });
        } else {
          // ── Local fallback ──
          const result = registerLocalUser(formData.name, formData.email, formData.password, formData.phone);
          if (result.error) {
            addToast({ type: 'error', title: 'Already Registered', message: result.error });
          } else {
            loginUser(result?.user);
            addToast({ type: 'success', title: 'Account Created 🎉', message: `Welcome, ${result?.user?.name || 'User'}! You have 100 reward points.` });
            onClose(); setCurrentView('store');
          }
        }

      } else {
        // Login
        if (!formData.email || !formData.password) {
          addToast({ type: 'error', title: 'Missing Fields', message: 'Please enter email and password.' });
          setIsLoading(false); return;
        }

        if (formData.email.toLowerCase() === 'admin@cartverse.io') {
          addToast({ type: 'info', title: 'Admin Portal 🛡️', message: 'Redirecting to admin login...' });
          onClose(); setCurrentView('admin');
          window.location.hash = '#admin';
          setIsLoading(false); return;
        }

        // Try API first
        const apiResult = await tryApi('/api/auth/login', {
          email: formData.email, password: formData.password
        });

        if (apiResult?.success) {
          if (apiResult.token) localStorage.setItem('cartverse_token', apiResult.token);
          loginUser(apiResult?.user);
          addToast({ type: 'success', title: 'Welcome Back! 👋', message: `Signed in as ${apiResult?.user?.name || 'User'}` });
          onClose(); setCurrentView('store');
        } else if (apiResult && !apiResult.success) {
          addToast({ type: 'error', title: 'Login Failed', message: apiResult.message || 'Invalid email or password.' });
        } else {
          // ── Local fallback ──
          const localUser = loginLocalUser(formData.email, formData.password);
          if (localUser) {
            loginUser(localUser);
            addToast({ type: 'success', title: 'Welcome Back! 👋', message: `Signed in as ${localUser?.name || 'User'}` });
            onClose(); setCurrentView('store');
          } else {
            addToast({ type: 'error', title: 'Login Failed', message: 'No account found. Please register first.' });
          }
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      addToast({ type: 'error', title: 'Error', message: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: nonDismissible ? 'relative' : 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: nonDismissible ? 'transparent' : 'rgba(5, 8, 15, 0.85)',
        backdropFilter: nonDismissible ? 'none' : 'blur(12px)',
        WebkitBackdropFilter: nonDismissible ? 'none' : 'blur(12px)',
        zIndex: nonDismissible ? 'unset' : 2500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={nonDismissible ? undefined : onClose}
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
            disabled={isLoading}
            style={{ width: '100%', marginTop: '6px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {isLoading ? (
              <><span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Processing...</>
            ) : (
              <><span>{mode === 'login' ? 'Sign In' : 'Create My Account'}</span><ArrowRight size={17} /></>
            )}
          </button>
        </form>

        {/* Info note */}
        <div style={{
          marginTop: '18px',
          padding: '10px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--bg-surface)',
          border: '1px dashed var(--border-active)',
          fontSize: '0.75rem',
          color: 'var(--text-secondary)',
          textAlign: 'center'
        }}>
          <span>🔒 Your data is secure and never shared with third parties.</span>
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
