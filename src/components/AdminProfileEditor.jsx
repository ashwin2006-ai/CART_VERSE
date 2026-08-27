import React, { useState } from 'react';
import { Upload, Save, X, Camera } from 'lucide-react';

export const AdminProfileEditor = ({ adminUser, isDark, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: adminUser?.name || '',
    email: adminUser?.email || '',
    role: adminUser?.role || 'Super Administrator'
  });
  const [profileImage, setProfileImage] = useState(adminUser?.avatar || '');
  const [previewImage, setPreviewImage] = useState(adminUser?.avatar || '');
  const [isLoading, setIsLoading] = useState(false);

  const bg = isDark ? '#0f172a' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.07)' : '#e5e7eb';
  const text = isDark ? '#f1f5f9' : '#111827';
  const muted = isDark ? '#64748b' : '#9ca3af';
  const accent = '#6C63FF';

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      setPreviewImage(base64);
      setProfileImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave({
        ...formData,
        avatar: profileImage
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '600px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: text, margin: 0 }}>Edit Admin Profile</h2>
        <button
          onClick={onCancel}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: isDark ? '#1e293b' : '#f3f4f6',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: muted
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Profile Picture Upload */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: text, marginBottom: '12px' }}>
          Profile Picture
        </label>
        
        <div style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'flex-start'
        }}>
          {/* Image Preview */}
          <div style={{
            position: 'relative',
            width: '120px',
            height: '120px',
            borderRadius: '12px',
            background: isDark ? '#1e293b' : '#f3f4f6',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `2px dashed ${border}`,
            flexShrink: 0
          }}>
            {previewImage ? (
              <img
                src={previewImage}
                alt="Profile preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <Camera size={40} style={{ color: muted }} />
            )}
          </div>

          {/* Upload Info */}
          <div style={{ flex: 1 }}>
            <label htmlFor="image-upload" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              background: accent,
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.9rem'
            }}>
              <Upload size={16} />
              Choose Image
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />

            <p style={{
              fontSize: '0.8rem',
              color: muted,
              marginTop: '8px',
              lineHeight: 1.4
            }}>
              Recommended: JPG or PNG, max 5MB<br />
              Square image (1:1 ratio) recommended
            </p>

            {previewImage && previewImage !== adminUser?.avatar && (
              <button
                onClick={() => {
                  setPreviewImage(adminUser?.avatar || '');
                  setProfileImage(adminUser?.avatar || '');
                }}
                style={{
                  fontSize: '0.8rem',
                  color: '#ef4444',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '8px',
                  fontWeight: 600
                }}
              >
                Remove image
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Name Field */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: text, marginBottom: '8px' }}>
          Full Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={{
            width: '100%',
            padding: '10px 12px',
            background: isDark ? '#1e293b' : '#f3f4f6',
            border: `1px solid ${border}`,
            borderRadius: '8px',
            fontSize: '0.95rem',
            color: text,
            outline: 'none',
            boxSizing: 'border-box'
          }}
          placeholder="Enter your full name"
        />
      </div>

      {/* Email Field */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: text, marginBottom: '8px' }}>
          Email Address
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          style={{
            width: '100%',
            padding: '10px 12px',
            background: isDark ? '#1e293b' : '#f3f4f6',
            border: `1px solid ${border}`,
            borderRadius: '8px',
            fontSize: '0.95rem',
            color: text,
            outline: 'none',
            boxSizing: 'border-box'
          }}
          placeholder="Enter your email"
        />
      </div>

      {/* Role Field */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: text, marginBottom: '8px' }}>
          Role
        </label>
        <input
          type="text"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          style={{
            width: '100%',
            padding: '10px 12px',
            background: isDark ? '#1e293b' : '#f3f4f6',
            border: `1px solid ${border}`,
            borderRadius: '8px',
            fontSize: '0.95rem',
            color: text,
            outline: 'none',
            boxSizing: 'border-box'
          }}
          placeholder="Your role/position"
        />
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end',
        paddingTop: '16px',
        borderTop: `1px solid ${border}`
      }}>
        <button
          onClick={onCancel}
          style={{
            padding: '10px 20px',
            background: isDark ? '#1e293b' : '#f3f4f6',
            color: text,
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.9rem'
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            background: accent,
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontWeight: 700,
            fontSize: '0.9rem',
            opacity: isLoading ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Save size={16} />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};
