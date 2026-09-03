import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle2, Lock, Mail, ArrowRight } from 'lucide-react';
import apiClient from '../utils/apiClient';

export const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@cartverse.io');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const result = await apiClient.adminLogin(email, password);

      if (result.success) {
        setSuccess('Admin login successful! Redirecting...');
        localStorage.setItem('admin_token', result.data?.token);
        localStorage.setItem('admin_user', JSON.stringify(result.data?.adminUser));
        
        setTimeout(() => {
          onLoginSuccess(result.data?.adminUser);
        }, 1000);
      } else {
        setError(result.message || 'Invalid admin credentials');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      padding: '16px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        padding: '36px 24px',
        border: '1px solid rgba(99, 102, 241, 0.2)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '32px',
            margin: '0 auto 16px',
            fontWeight: 'bold'
          }}>
            ⚙️
          </div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '900',
            color: '#111827',
            margin: '0 0 8px'
          }}>
            Admin Dashboard
          </h1>
          <p style={{
            fontSize: '13px',
            color: '#9ca3af',
            margin: 0
          }}>
            Secure Admin Access
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Email */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '14px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontFamily: 'inherit',
                transition: 'all 0.3s',
                boxSizing: 'border-box',
                backgroundColor: isLoading ? '#f3f4f6' : '#fff'
              }}
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Password
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              overflow: 'hidden',
              transition: 'all 0.3s'
            }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#6366f1'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            >
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  fontSize: '14px',
                  border: 'none',
                  fontFamily: 'inherit',
                  backgroundColor: isLoading ? '#f3f4f6' : '#fff'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  padding: '10px 12px',
                  color: '#9ca3af',
                  opacity: isLoading ? 0.5 : 1
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px',
              background: '#fee2e2',
              borderRadius: '8px',
              color: '#991b1b',
              fontSize: '13px'
            }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px',
              background: '#dcfce7',
              borderRadius: '8px',
              color: '#166534',
              fontSize: '13px'
            }}>
              <CheckCircle2 size={16} />
              {success}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !email || !password}
            style={{
              width: '100%',
              padding: '11px',
              background: isLoading ? '#d1d5db' : 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              border: 'none',
              borderRadius: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              if (!isLoading) e.target.style.transform = 'translateY(0)';
            }}
          >
            {isLoading ? (
              <>
                <span style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite'
                }} />
                Signing in...
              </>
            ) : (
              'Sign In as Admin'
            )}
          </button>

          {/* Demo Credentials */}
          <div style={{
            padding: '12px',
            background: '#f0f9ff',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#064e3b'
          }}>
            <strong>Demo Admin Credentials:</strong>
            <div style={{ marginTop: '6px', lineHeight: '1.6' }}>
              📧 Email: admin@cartverse.io
              <br />
              🔑 Password: Ask administrator
            </div>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
