import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, Mail, Lock, Eye, EyeOff, User, Phone, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

export const UserLoginPage = () => {
  const { userLogin, addToast, theme, setCurrentView } = useShop();

  const [isLogin, setIsLogin] = useState(true); // true = login, false = register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDark = theme === 'dark';
  const bg = isDark ? '#0b0f1a' : '#f7f8fa';
  const cardBg = isDark ? '#0f172a' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.07)' : '#e5e7eb';
  const textPrimary = isDark ? '#f1f5f9' : '#111827';
  const textMuted = isDark ? '#64748b' : '#9ca3af';
  const accent = '#6C63FF';
  const inputBg = isDark ? '#1e293b' : '#f9fafb';

  // Validation
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (pwd) => pwd.length >= 6;
  const validatePhone = (phone) => /^\d{10}$/.test(phone.replace(/\D/g, ''));

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    if (!email.trim()) {
      setErrorMsg('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setErrorMsg('Enter a valid email address');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Password is required');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const result = userLogin(email, password);
        setIsSubmitting(false);

        if (result.success) {
          setEmail('');
          setPassword('');
          setCurrentView('store');
          addToast({
            type: 'success',
            title: 'Welcome!',
            message: `Logged in as ${result.user.name}`
          });
        } else {
          setErrorMsg(result.error || 'Login failed. Check your credentials.');
        }
      } catch (err) {
        setIsSubmitting(false);
        setErrorMsg('An error occurred. Please try again.');
      }
    }, 600);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    if (!name.trim()) {
      setErrorMsg('Full name is required');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setErrorMsg('Enter a valid email address');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Phone number is required');
      return;
    }
    if (!validatePhone(phone)) {
      setErrorMsg('Enter a valid 10-digit phone number');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Password is required');
      return;
    }
    if (!validatePassword(password)) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        // Register user by logging in (creates user if not exists)
        const result = userLogin(email, password, {
          name,
          phone,
          addresses: []
        });
        setIsSubmitting(false);

        if (result.success) {
          setName('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setPhone('');
          setCurrentView('store');
          addToast({
            type: 'success',
            title: 'Account Created!',
            message: `Welcome ${result.user.name}! You are now logged in.`
          });
        } else {
          setErrorMsg(result.error || 'Registration failed. Try again.');
        }
      } catch (err) {
        setIsSubmitting(false);
        setErrorMsg('An error occurred. Please try again.');
      }
    }, 600);
  };

  const handleDemoLogin = () => {
    setEmail('user@cartverse.io');
    setPassword('Password123!');
    setErrorMsg('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      background: isDark
        ? 'linear-gradient(135deg, #0b0f1a 0%, #1e1b4b 50%, #0f172a 100%)'
        : 'linear-gradient(135deg, #f7f8fa 0%, #f0f4f8 50%, #e5e9f2 100%)',
      position: 'relative'
    }}>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .login-container {
          animation: fadeInUp 0.5s ease-out;
        }
        @media (max-width: 768px) {
          .login-card {
            width: 100% !important;
            max-width: 100% !important;
          }
          .login-header {
            font-size: 1.4rem !important;
          }
          .login-input {
            font-size: 16px !important;
          }
        }
      `}</style>

      <div className="login-container" style={{
        width: '100%',
        maxWidth: '420px'
      }}>
        {/* Logo & Branding */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${accent} 0%, #a855f7 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <ShoppingBag size={28} color="#fff" />
          </div>
          <h1 className="login-header" style={{
            fontSize: '1.6rem',
            fontWeight: 900,
            color: textPrimary,
            margin: '0 0 4px',
            letterSpacing: '-0.02em'
          }}>
            Cart<span style={{ color: accent }}>Verse</span>
          </h1>
          <p style={{
            fontSize: '0.8rem',
            color: textMuted,
            margin: '4px 0 0'
          }}>
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        {/* Main Card */}
        <div className="login-card" style={{
          background: cardBg,
          borderRadius: '16px',
          border: `1px solid ${border}`,
          padding: '32px',
          boxShadow: isDark
            ? '0 8px 32px rgba(0,0,0,0.4)'
            : '0 8px 32px rgba(0,0,0,0.08)',
          marginBottom: '20px'
        }}>
          {/* Error Message */}
          {errorMsg && (
            <div style={{
              background: isDark ? 'rgba(239, 68, 68, 0.1)' : '#fee2e2',
              border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.3)' : '#fecaca'}`,
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '20px',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start'
            }}>
              <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ef4444' }}>Error</div>
                <div style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '2px' }}>{errorMsg}</div>
              </div>
            </div>
          )}

          <form onSubmit={isLogin ? handleLogin : handleRegister}>
            {/* Register Fields */}
            {!isLogin && (
              <>
                {/* Name */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: textPrimary,
                    marginBottom: '6px'
                  }}>
                    Full Name
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: inputBg,
                    border: `1.5px solid ${border}`,
                    borderRadius: '10px',
                    padding: '0 12px',
                    transition: 'all 0.2s'
                  }}>
                    <User size={16} color={textMuted} />
                    <input
                      type="text"
                      className="login-input"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        flex: 1,
                        border: 'none',
                        background: 'transparent',
                        padding: '12px 10px',
                        fontSize: '0.9rem',
                        outline: 'none',
                        color: textPrimary,
                        fontFamily: 'Inter, sans-serif'
                      }}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: textPrimary,
                    marginBottom: '6px'
                  }}>
                    Phone Number
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: inputBg,
                    border: `1.5px solid ${border}`,
                    borderRadius: '10px',
                    padding: '0 12px',
                    transition: 'all 0.2s'
                  }}>
                    <Phone size={16} color={textMuted} />
                    <input
                      type="tel"
                      className="login-input"
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      style={{
                        flex: 1,
                        border: 'none',
                        background: 'transparent',
                        padding: '12px 10px',
                        fontSize: '0.9rem',
                        outline: 'none',
                        color: textPrimary,
                        fontFamily: 'Inter, sans-serif'
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: textPrimary,
                marginBottom: '6px'
              }}>
                Email Address
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: inputBg,
                border: `1.5px solid ${border}`,
                borderRadius: '10px',
                padding: '0 12px',
                transition: 'all 0.2s'
              }}>
                <Mail size={16} color={textMuted} />
                <input
                  type="email"
                  className="login-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    padding: '12px 10px',
                    fontSize: '0.9rem',
                    outline: 'none',
                    color: textPrimary,
                    fontFamily: 'Inter, sans-serif'
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: isLogin ? '12px' : '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: textPrimary,
                marginBottom: '6px'
              }}>
                Password
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: inputBg,
                border: `1.5px solid ${border}`,
                borderRadius: '10px',
                padding: '0 12px',
                transition: 'all 0.2s'
              }}>
                <Lock size={16} color={textMuted} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    padding: '12px 10px',
                    fontSize: '0.9rem',
                    outline: 'none',
                    color: textPrimary,
                    fontFamily: 'Inter, sans-serif'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: textMuted,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Register only) */}
            {!isLogin && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: textPrimary,
                  marginBottom: '6px'
                }}>
                  Confirm Password
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: inputBg,
                  border: `1.5px solid ${border}`,
                  borderRadius: '10px',
                  padding: '0 12px',
                  transition: 'all 0.2s'
                }}>
                  <Lock size={16} color={textMuted} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="login-input"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      flex: 1,
                      border: 'none',
                      background: 'transparent',
                      padding: '12px 10px',
                      fontSize: '0.9rem',
                      outline: 'none',
                      color: textPrimary,
                      fontFamily: 'Inter, sans-serif'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      color: textMuted,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: accent,
                color: '#fff',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                transition: 'all 0.2s',
                boxShadow: `0 4px 16px ${accent}40`
              }}
              onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.opacity = '1')}
            >
              {isSubmitting ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid #fff',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Demo Login Button (Login only) */}
          {isLogin && (
            <button
              type="button"
              onClick={handleDemoLogin}
              style={{
                width: '100%',
                padding: '10px',
                marginTop: '12px',
                borderRadius: '10px',
                background: 'transparent',
                border: `1.5px solid ${border}`,
                color: accent,
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = isDark ? 'rgba(108,99,255,0.1)' : 'rgba(108,99,255,0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              📧 Use Demo Account
            </button>
          )}

          {/* Toggle Login/Register */}
          <div style={{
            textAlign: 'center',
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: `1px solid ${border}`
          }}>
            <span style={{ fontSize: '0.85rem', color: textMuted }}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrorMsg('');
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                  setName('');
                  setPhone('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: accent,
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </span>
          </div>
        </div>

        {/* Info Box */}
        <div style={{
          background: isDark ? 'rgba(108,99,255,0.1)' : 'rgba(108,99,255,0.05)',
          border: `1px solid ${isDark ? 'rgba(108,99,255,0.3)' : 'rgba(108,99,255,0.2)'}`,
          borderRadius: '10px',
          padding: '12px 16px',
          fontSize: '0.75rem',
          color: accent,
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '4px' }}>
            <CheckCircle2 size={14} />
            Secure & Fast
          </div>
          Your data is encrypted and secure. Sign up takes less than a minute.
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
