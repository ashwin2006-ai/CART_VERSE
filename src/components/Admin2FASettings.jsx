import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Shield, Smartphone, Key, Copy, Check, X, AlertTriangle, Lock, 
  RefreshCw, Trash2, Download, Eye, EyeOff, Smartphone as HardwareToken
} from 'lucide-react';

export const Admin2FASettings = () => {
  const { adminAuth, enable2FA, disable2FA, regenerateBackupCodes, addToast } = useShop();
  
  const [passwordVerify, setPasswordVerify] = useState('');
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('authenticator');

  const twoFA = adminAuth?.twoFactorAuth || {};
  const isEnabled = twoFA.enabled;

  const handleEnable2FA = () => {
    const result = enable2FA(selectedMethod);
    if (result) {
      addToast({
        type: 'success',
        title: '2FA Setup Started',
        message: `Scan the QR code with ${selectedMethod === 'authenticator' ? 'Google Authenticator, Microsoft Authenticator, or Authy' : 'your hardware token'}`
      });
    }
  };

  const handleDisable2FA = () => {
    if (!disablePassword) {
      addToast({
        type: 'error',
        title: 'Password Required',
        message: 'Enter your admin password to disable 2FA'
      });
      return;
    }

    const success = disable2FA(disablePassword);
    if (success) {
      setShowDisableConfirm(false);
      setDisablePassword('');
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    addToast({
      type: 'success',
      title: 'Copied',
      message: 'Backup code copied to clipboard'
    });
  };

  const handleDownloadBackupCodes = () => {
    const text = `CartVerse Admin 2FA Backup Codes\nGenerated: ${new Date().toLocaleString()}\n\n${twoFA.backupCodes.join('\n')}\n\nStore these in a secure location!`;
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', `cartverse-2fa-backup-${Date.now()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleRegenerateBackupCodes = () => {
    if (!passwordVerify) {
      addToast({
        type: 'error',
        title: 'Password Required',
        message: 'Enter your admin password to regenerate backup codes'
      });
      return;
    }
    regenerateBackupCodes(passwordVerify);
    setPasswordVerify('');
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Shield size={28} style={{ color: 'var(--accent-gold)' }} />
          Two-Factor Authentication (2FA)
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Protect your admin account with authenticator app or hardware security token.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Current 2FA Status Card */}
        <div className="glass-panel" style={{ padding: '26px', borderLeft: isEnabled ? '4px solid #10b981' : '4px solid #ef4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Current Status</h3>
            <div style={{
              padding: '6px 12px',
              borderRadius: '10px',
              background: isEnabled ? '#d1fae5' : '#fee2e2',
              color: isEnabled ? '#047857' : '#991b1b',
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase'
            }}>
              {isEnabled ? '🛡️ Enabled' : '🔓 Disabled'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Method
              </span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                {isEnabled ? (twoFA.method === 'authenticator' ? 'Authenticator App' : 'Hardware Token') : 'Not configured'}
              </div>
            </div>

            {isEnabled && (
              <>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Linked On
                  </span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {new Date(twoFA.linkedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Backup Codes Remaining
                  </span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: twoFA.backupCodes.length < 3 ? '#ef4444' : 'var(--text-primary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {twoFA.backupCodes.length} codes
                    {twoFA.backupCodes.length < 3 && <AlertTriangle size={14} style={{ color: '#ef4444' }} />}
                  </div>
                </div>
              </>
            )}
          </div>

          {isEnabled ? (
            <button
              onClick={() => setShowDisableConfirm(true)}
              className="btn btn-outline btn-sm"
              style={{ width: '100%', color: 'var(--accent-rose)', borderColor: 'rgba(244, 63, 94, 0.4)' }}
            >
              <Lock size={14} /> Disable 2FA
            </button>
          ) : (
            <button
              onClick={handleEnable2FA}
              className="btn btn-primary btn-sm"
              style={{ width: '100%' }}
            >
              <Shield size={14} /> Enable 2FA Now
            </button>
          )}
        </div>

        {/* Setup Options Card (Only when 2FA is disabled) */}
        {!isEnabled && (
          <div className="glass-panel" style={{ padding: '26px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>Choose Authentication Method</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              {/* Authenticator App Option */}
              <button
                onClick={() => setSelectedMethod('authenticator')}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  background: selectedMethod === 'authenticator' ? 'var(--primary-gradient)' : 'var(--bg-surface)',
                  border: selectedMethod === 'authenticator' ? 'none' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textAlign: 'left'
                }}
              >
                <Smartphone size={20} style={{ color: selectedMethod === 'authenticator' ? '#fff' : 'var(--primary)' }} />
                <div>
                  <div style={{ fontWeight: 800, color: selectedMethod === 'authenticator' ? '#fff' : 'var(--text-primary)' }}>
                    Authenticator App
                  </div>
                  <div style={{ fontSize: '0.75rem', color: selectedMethod === 'authenticator' ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)', marginTop: '2px' }}>
                    Google Authenticator, Microsoft Authenticator, or Authy
                  </div>
                </div>
              </button>

              {/* Hardware Token Option */}
              <button
                onClick={() => setSelectedMethod('hardware_token')}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  background: selectedMethod === 'hardware_token' ? 'var(--primary-gradient)' : 'var(--bg-surface)',
                  border: selectedMethod === 'hardware_token' ? 'none' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textAlign: 'left'
                }}
              >
                <HardwareToken size={20} style={{ color: selectedMethod === 'hardware_token' ? '#fff' : 'var(--primary)' }} />
                <div>
                  <div style={{ fontWeight: 800, color: selectedMethod === 'hardware_token' ? '#fff' : 'var(--text-primary)' }}>
                    Hardware Security Token
                  </div>
                  <div style={{ fontSize: '0.75rem', color: selectedMethod === 'hardware_token' ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)', marginTop: '2px' }}>
                    FIDO2 USB key or mobile hardware authenticator
                  </div>
                </div>
              </button>
            </div>

            <button
              onClick={handleEnable2FA}
              className="btn btn-gold btn-sm"
              style={{ width: '100%', gap: '8px' }}
            >
              <Shield size={14} /> Setup {selectedMethod === 'authenticator' ? 'Authenticator' : 'Hardware Token'}
            </button>
          </div>
        )}

        {/* QR Code Display (When 2FA is enabled or just setup) */}
        {isEnabled && twoFA.qrCode && (
          <div className="glass-panel" style={{ padding: '26px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>Active Authentication</h3>
            <div style={{ textAlign: 'center', padding: '16px', background: '#fff', borderRadius: 'var(--radius-md)', marginBottom: '12px' }}>
              <div style={{
                display: 'inline-block',
                padding: '12px',
                background: '#f3f4f6',
                borderRadius: 'var(--radius-sm)'
              }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160&data=${encodeURIComponent(twoFA.qrCode)}`}
                  alt="2FA QR Code"
                  style={{ width: '160px', height: '160px', borderRadius: '4px' }}
                />
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '12px' }}>
              Scan this QR code with your authenticator app
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 700 }}>
                Manual Entry Code
              </div>
              <div style={{
                padding: '10px',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontFamily: 'monospace',
                wordBreak: 'break-all',
                color: 'var(--text-primary)',
                fontWeight: 700
              }}>
                {twoFA.secret}
              </div>
            </div>
          </div>
        )}

        {/* Backup Codes Management */}
        {isEnabled && twoFA.backupCodes.length > 0 && (
          <div className="glass-panel" style={{ padding: '26px', gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={20} /> Backup Codes
              </h3>
              <button
                onClick={() => setShowBackupCodes(!showBackupCodes)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}
              >
                {showBackupCodes ? <EyeOff size={14} /> : <Eye size={14} />}
                {showBackupCodes ? 'Hide' : 'Show'}
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Save these codes in a secure location. Each code can be used once if you lose access to your 2FA device.
            </p>

            {showBackupCodes && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '8px',
                marginBottom: '16px'
              }}>
                {twoFA.backupCodes.map((code, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCopyCode(code)}
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      fontFamily: 'monospace',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.2s'
                    }}
                    title="Click to copy"
                  >
                    {code}
                    {copiedCode === code && <Check size={12} style={{ color: '#10b981' }} />}
                  </button>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={handleDownloadBackupCodes}
                className="btn btn-secondary btn-sm"
                style={{ gap: '6px', flex: showBackupCodes ? '1 0 auto' : '0 0 auto' }}
              >
                <Download size={14} /> Download Codes
              </button>

              <div style={{ flex: '1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="password"
                  placeholder="Admin password"
                  value={passwordVerify}
                  onChange={(e) => setPasswordVerify(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.8rem'
                  }}
                />
                <button
                  onClick={handleRegenerateBackupCodes}
                  className="btn btn-outline btn-sm"
                  style={{ gap: '6px' }}
                >
                  <RefreshCw size={14} /> Regenerate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Disable 2FA Confirmation Modal */}
      {showDisableConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 8, 15, 0.85)',
          zIndex: 3000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            background: 'var(--bg-card-solid)',
            width: '100%',
            maxWidth: '420px',
            padding: '32px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-highlight)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <AlertTriangle size={24} style={{ color: 'var(--accent-rose)' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Disable 2FA?</h3>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
              Disabling Two-Factor Authentication will make your admin account less secure. You'll only need your password to log in.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Enter Admin Password to Confirm
              </label>
              <input
                type="password"
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  setShowDisableConfirm(false);
                  setDisablePassword('');
                }}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                onClick={handleDisable2FA}
                className="btn btn-outline btn-sm"
                style={{ flex: 1, color: 'var(--accent-rose)', borderColor: 'rgba(244, 63, 94, 0.4)' }}
              >
                <X size={14} /> Disable 2FA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
