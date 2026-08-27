import React, { useState } from 'react';
import { MapPin, Trash2, Edit2, Plus, Check, X, Navigation } from 'lucide-react';

export const AddressManager = ({ addresses = [], isDark, onAddAddress, onEditAddress, onDeleteAddress, onSetDefault, requestLocation }) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India'
  });

  const bg = isDark ? '#0f172a' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.07)' : '#e5e7eb';
  const text = isDark ? '#f1f5f9' : '#111827';
  const muted = isDark ? '#64748b' : '#9ca3af';
  const accent = '#6C63FF';

  const handleRequestLocation = async () => {
    setIsRequestingLocation(true);
    try {
      const address = await requestLocation();
      if (address) {
        setFormData({
          street: address.street,
          city: address.city,
          state: address.state,
          postal_code: address.postal_code,
          country: address.country
        });
        setIsAddingNew(true);
      }
    } catch (error) {
      console.error('Location error:', error);
    } finally {
      setIsRequestingLocation(false);
    }
  };

  const handleSaveAddress = () => {
    if (!formData.street || !formData.city || !formData.state || !formData.postal_code) {
      alert('Please fill all address fields');
      return;
    }

    if (editingId) {
      onEditAddress(editingId, formData);
      setEditingId(null);
    } else {
      onAddAddress(formData);
    }

    setFormData({ street: '', city: '', state: '', postal_code: '', country: 'India' });
    setIsAddingNew(false);
  };

  const startEdit = (address) => {
    setFormData(address);
    setEditingId(address.id);
    setIsAddingNew(true);
  };

  const defaultAddress = addresses.find(a => a.is_default);
  const autoDetectedAddresses = addresses.filter(a => a.auto_detected);
  const manualAddresses = addresses.filter(a => !a.auto_detected);

  return (
    <div>
      {/* Location Request Banner */}
      <div style={{
        background: isDark ? '#1e293b' : '#f0f9ff',
        border: `1px solid ${border}`,
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <Navigation size={20} style={{ color: accent, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: text }}>
              📍 Use Device Location
            </div>
            <div style={{ fontSize: '0.8rem', color: muted, marginTop: '2px' }}>
              We'll automatically detect your address and save it for faster checkout
            </div>
          </div>
        </div>
        <button
          onClick={handleRequestLocation}
          disabled={isRequestingLocation}
          style={{
            padding: '8px 16px',
            background: accent,
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: isRequestingLocation ? 'not-allowed' : 'pointer',
            fontWeight: 700,
            fontSize: '0.9rem',
            opacity: isRequestingLocation ? 0.7 : 1,
            whiteSpace: 'nowrap'
          }}
        >
          {isRequestingLocation ? 'Detecting...' : 'Detect Location'}
        </button>
      </div>

      {/* Add New Address Button */}
      {!isAddingNew && (
        <button
          onClick={() => setIsAddingNew(true)}
          style={{
            width: '100%',
            padding: '16px',
            border: `2px dashed ${border}`,
            background: isDark ? '#1e293b' : '#f9fafb',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: accent,
            fontWeight: 700,
            fontSize: '0.95rem',
            marginBottom: '20px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.borderColor = accent}
          onMouseLeave={(e) => e.target.style.borderColor = border}
        >
          <Plus size={18} />
          Add New Address
        </button>
      )}

      {/* Add/Edit Form */}
      {isAddingNew && (
        <div style={{
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: text, marginBottom: '16px', margin: 0 }}>
            {editingId ? 'Edit Address' : 'Add New Address'}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {/* Street */}
            <input
              type="text"
              placeholder="Street Address"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              style={{
                padding: '10px 12px',
                background: isDark ? '#0f172a' : '#f9fafb',
                border: `1px solid ${border}`,
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: text,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />

            {/* City */}
            <input
              type="text"
              placeholder="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              style={{
                padding: '10px 12px',
                background: isDark ? '#0f172a' : '#f9fafb',
                border: `1px solid ${border}`,
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: text,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />

            {/* State */}
            <input
              type="text"
              placeholder="State"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              style={{
                padding: '10px 12px',
                background: isDark ? '#0f172a' : '#f9fafb',
                border: `1px solid ${border}`,
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: text,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />

            {/* Postal Code */}
            <input
              type="text"
              placeholder="Postal Code"
              value={formData.postal_code}
              onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
              style={{
                padding: '10px 12px',
                background: isDark ? '#0f172a' : '#f9fafb',
                border: `1px solid ${border}`,
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: text,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => {
                setIsAddingNew(false);
                setEditingId(null);
                setFormData({ street: '', city: '', state: '', postal_code: '', country: 'India' });
              }}
              style={{
                padding: '8px 16px',
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
              onClick={handleSaveAddress}
              style={{
                padding: '8px 16px',
                background: accent,
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Check size={16} />
              Save Address
            </button>
          </div>
        </div>
      )}

      {/* Address List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {addresses.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: muted,
            borderRadius: '12px',
            background: isDark ? '#1e293b' : '#f9fafb'
          }}>
            <MapPin size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p style={{ margin: 0 }}>No addresses saved yet</p>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>Add your first address to get started</p>
          </div>
        ) : (
          <>
            {/* Auto-detected Addresses */}
            {autoDetectedAddresses.length > 0 && (
              <>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '12px' }}>
                  📍 Auto-Detected
                </div>
                {autoDetectedAddresses.map(addr => (
                  <AddressCard
                    key={addr.id}
                    address={addr}
                    isDefault={addr.id === defaultAddress?.id}
                    isDark={isDark}
                    onEdit={startEdit}
                    onDelete={onDeleteAddress}
                    onSetDefault={onSetDefault}
                  />
                ))}
              </>
            )}

            {/* Manual Addresses */}
            {manualAddresses.length > 0 && (
              <>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '12px' }}>
                  📝 Saved Addresses
                </div>
                {manualAddresses.map(addr => (
                  <AddressCard
                    key={addr.id}
                    address={addr}
                    isDefault={addr.id === defaultAddress?.id}
                    isDark={isDark}
                    onEdit={startEdit}
                    onDelete={onDeleteAddress}
                    onSetDefault={onSetDefault}
                  />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Address Card Component
const AddressCard = ({ address, isDefault, isDark, onEdit, onDelete, onSetDefault }) => {
  const border = isDark ? 'rgba(255,255,255,0.07)' : '#e5e7eb';
  const text = isDark ? '#f1f5f9' : '#111827';
  const muted = isDark ? '#64748b' : '#9ca3af';
  const accent = '#6C63FF';

  return (
    <div style={{
      background: isDark ? '#1e293b' : '#ffffff',
      border: isDefault ? `2px solid ${accent}` : `1px solid ${border}`,
      borderRadius: '12px',
      padding: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '12px'
    }}>
      <div style={{ flex: 1 }}>
        {isDefault && (
          <div style={{
            display: 'inline-block',
            background: accent,
            color: '#fff',
            fontSize: '0.7rem',
            fontWeight: 800,
            padding: '3px 8px',
            borderRadius: '4px',
            marginBottom: '8px'
          }}>
            DEFAULT
          </div>
        )}
        <div style={{
          fontSize: '0.95rem',
          fontWeight: 700,
          color: text,
          marginBottom: '4px'
        }}>
          {address.street}
        </div>
        <div style={{
          fontSize: '0.9rem',
          color: muted
        }}>
          {address.city}, {address.state} {address.postal_code}
        </div>
        <div style={{
          fontSize: '0.85rem',
          color: muted,
          marginTop: '4px'
        }}>
          {address.country}
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '8px',
        flexShrink: 0
      }}>
        <button
          onClick={() => onEdit(address)}
          style={{
            padding: '6px 10px',
            background: accent,
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.8rem',
            fontWeight: 700
          }}
        >
          <Edit2 size={13} />
        </button>
        <button
          onClick={() => onDelete(address.id)}
          style={{
            padding: '6px 10px',
            background: '#ef4444',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          <Trash2 size={13} />
        </button>
        {!isDefault && (
          <button
            onClick={() => onSetDefault(address.id)}
            style={{
              padding: '6px 10px',
              background: isDark ? '#334155' : '#e5e7eb',
              color: text,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 700,
              whiteSpace: 'nowrap'
            }}
          >
            Set Default
          </button>
        )}
      </div>
    </div>
  );
};
