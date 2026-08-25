import React, { useState, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import {
  User,
  Package,
  MapPin,
  Heart,
  RotateCcw,
  Sparkles,
  Award,
  Truck,
  Plus,
  Trash2,
  CheckCircle,
  FileText,
  Clock,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  Edit3,
  Camera,
  Check,
  Upload,
  Image as ImageIcon,
  X as CloseIcon
} from 'lucide-react';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
];

export const AccountView = () => {
  const {
    user,
    setUser,
    orders,
    wishlist,
    products,
    setTrackingOrderId,
    addToCart,
    toggleWishlist,
    deleteAddress,
    setDefaultAddress,
    addAddress,
    requestReturn,
    setCurrentView,
    setActiveProductId,
    addToast
  } = useShop();

  const fileInputRef = useRef(null);

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'profile', 'addresses', 'wishlist', 'returns'
  const [returnModalOrderId, setReturnModalOrderId] = useState(null);
  const [returnReason, setReturnReason] = useState('');
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    avatar: user.avatar || ''
  });

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      addToast({
        type: 'error',
        title: 'Image Too Large',
        message: 'Please choose an image under 4MB.'
      });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileForm(prev => ({ ...prev, avatar: reader.result }));
      addToast({
        type: 'success',
        title: 'Photo Selected 📸',
        message: 'Click Save Profile to update your account.'
      });
    };
    reader.readAsDataURL(file);
  };

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    title: 'Home',
    fullName: user.name,
    phone: user.phone,
    street: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    isDefault: false
  });

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  const handleReturnSubmit = (e) => {
    e.preventDefault();
    if (!returnReason.trim()) return;
    requestReturn(returnModalOrderId, returnReason.trim());
    setReturnModalOrderId(null);
    setReturnReason('');
  };

  const handleCreateAddress = (e) => {
    e.preventDefault();
    if (!newAddr.street || !newAddr.city || !newAddr.pincode) return;
    if (!/^[1-9][0-9]{5}$/.test(newAddr.pincode)) {
      addToast({ type: 'error', title: 'Invalid Pincode', message: 'Please enter a valid 6-digit Indian pincode.' });
      return;
    }
    addAddress(newAddr);
    setIsAddingAddress(false);
    setNewAddr({
      title: 'Home',
      fullName: user.name,
      phone: user.phone,
      street: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      isDefault: false
    });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUser({
      ...user,
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone,
      avatar: profileForm.avatar
    });
    setIsEditingProfile(false);
    addToast({
      type: 'success',
      title: 'Profile Updated 🎉',
      message: 'Your personal information and profile image were saved.'
    });
  };

  return (
    <div style={{ padding: '32px 0 64px 0' }}>
      <div className="container">
        {/* User Banner Header with Profile Image */}
        <div
          className="glass-panel"
          style={{
            padding: '32px',
            borderRadius: 'var(--radius-xl)',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(18, 24, 38, 0.8) 100%)',
            border: '1px solid var(--border-highlight)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid var(--primary)',
                    boxShadow: 'var(--shadow-glow)'
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '50%',
                    background: 'var(--primary-gradient)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                    fontWeight: 900,
                    letterSpacing: '1px',
                    border: '3px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: 'var(--shadow-glow)'
                  }}
                >
                  {getInitials(user.name)}
                </div>
              )}
              <button
                onClick={() => {
                  setProfileForm({
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    avatar: user.avatar || ''
                  });
                  setIsEditingProfile(true);
                }}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #fff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                }}
                title="Change Profile Picture"
              >
                <Camera size={13} />
              </button>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 900 }}>{user.name}</h1>
                <span className="badge badge-gold">
                  <Award size={13} /> {user.tier}
                </span>
                <button
                  onClick={() => {
                    setProfileForm({
                      name: user.name,
                      email: user.email,
                      phone: user.phone,
                      avatar: user.avatar || ''
                    });
                    setIsEditingProfile(true);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '3px 8px', fontSize: '0.72rem', gap: '4px' }}
                >
                  <Edit3 size={11} /> Edit Info
                </button>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {user.email} • {user.phone}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 700, marginTop: '4px' }}>
                ✓ Authenticated Customer Profile
              </div>
            </div>
          </div>

          {/* Reward points and Total orders summary */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{
              padding: '14px 20px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card-solid)',
              border: '1px solid var(--border-subtle)',
              textAlign: 'center',
              minWidth: '110px'
            }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Reward Points
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--accent-gold)' }}>
                {user.rewardPoints} pts
              </div>
            </div>

            <div style={{
              padding: '14px 20px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card-solid)',
              border: '1px solid var(--border-subtle)',
              textAlign: 'center',
              minWidth: '110px'
            }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Total Orders
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--primary)' }}>
                {orders.length}
              </div>
            </div>
          </div>
        </div>

        {/* Modal to Edit Profile & Pick Avatar */}
        {isEditingProfile && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(5, 8, 15, 0.85)',
              backdropFilter: 'blur(10px)',
              zIndex: 2600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}
            onClick={() => setIsEditingProfile(false)}
          >
            <div
              className="glass-panel animate-scale-in"
              style={{
                background: 'var(--bg-card-solid)',
                width: '100%',
                maxWidth: '500px',
                padding: '28px',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-highlight)',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px' }}>Personal Profile & Photo</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Upload your personal photo or customize your profile details for deliveries.
              </p>

              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Avatar Preview & Upload Action */}
                <div style={{
                  background: 'var(--bg-surface)',
                  padding: '16px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {profileForm.avatar ? (
                      <img
                        src={profileForm.avatar}
                        alt="Profile preview"
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid var(--primary)',
                          flexShrink: 0
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '50%',
                          background: 'var(--primary-gradient)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.4rem',
                          fontWeight: 900,
                          flexShrink: 0
                        }}
                      >
                        {getInitials(profileForm.name)}
                      </div>
                    )}

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700 }}>Profile Photo</div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          accept="image/*"
                          style={{ display: 'none' }}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="btn btn-primary btn-sm"
                          style={{ gap: '6px' }}
                        >
                          <Upload size={14} /> Upload Photo
                        </button>
                        {profileForm.avatar && (
                          <button
                            type="button"
                            onClick={() => setProfileForm(prev => ({ ...prev, avatar: '' }))}
                            className="btn btn-secondary btn-sm"
                            style={{ gap: '4px', color: 'var(--accent-rose)' }}
                          >
                            <Trash2 size={13} /> Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Or Custom URL */}
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      Or enter Image Web URL:
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/my-photo.jpg"
                      value={profileForm.avatar.startsWith('data:') ? '' : profileForm.avatar}
                      onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}
                    />
                  </div>

                  {/* Optional Preset Swatches */}
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      Or choose a preset style:
                    </span>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {AVATAR_OPTIONS.map((av, idx) => (
                        <img
                          key={idx}
                          src={av}
                          alt="preset avatar"
                          onClick={() => setProfileForm({ ...profileForm, avatar: av })}
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            cursor: 'pointer',
                            border: profileForm.avatar === av ? '2px solid var(--primary)' : '1px solid transparent',
                            transform: profileForm.avatar === av ? 'scale(1.1)' : 'scale(1)',
                            transition: 'all 0.15s ease'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Email Address</label>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Phone Number (for Courier SMS)</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Save Profile
                  </button>
                  <button type="button" onClick={() => setIsEditingProfile(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Dashboard Tabs & Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth > 800 ? '240px 1fr' : '1fr',
          gap: '24px',
          alignItems: 'start'
        }}>
          {/* Navigation Sidebar */}
          <div
            className="glass-panel"
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: window.innerWidth > 800 ? 'column' : 'row',
              gap: '6px',
              overflowX: 'auto'
            }}
          >
            {[
              { id: 'orders', label: 'My Orders', icon: Package, count: orders.length },
              { id: 'addresses', label: 'Saved Addresses', icon: MapPin, count: user.addresses.length },
              { id: 'wishlist', label: 'Wishlist', icon: Heart, count: wishlist.length },
              { id: 'returns', label: 'Return Requests', icon: RotateCcw }
            ].map((tab) => {
              const Icon = tab.icon;
              const isSel = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: isSel ? 'var(--primary-gradient)' : 'transparent',
                    color: isSel ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    textAlign: 'left',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span style={{
                      fontSize: '0.72rem',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      background: isSel ? 'rgba(255,255,255,0.25)' : 'var(--bg-surface)',
                      color: isSel ? '#ffffff' : 'var(--text-muted)'
                    }}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Main Tab Panel */}
          <div>
            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>
                  Your Orders History ({orders.length})
                </h2>

                {orders.length === 0 ? (
                  <div className="glass-panel" style={{ padding: '48px 20px', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
                    <Package size={48} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px' }}>No Orders Placed Yet</h3>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                      Start exploring tech, apparel, and lifestyle products on Cartverse!
                    </p>
                    <button onClick={() => setCurrentView('store')} className="btn btn-primary">
                      Explore Catalog
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="glass-panel"
                        style={{
                          padding: '20px',
                          borderRadius: 'var(--radius-lg)',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        {/* Order Header */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderBottom: '1px solid var(--border-subtle)',
                          paddingBottom: '14px',
                          marginBottom: '14px',
                          flexWrap: 'wrap',
                          gap: '10px'
                        }}>
                          <div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 900 }}>
                              Order #{ord.id}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                              Placed on {new Date(ord.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <span className="badge badge-emerald">
                              {ord.status}
                            </span>
                            <span style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                              ₹{ord.total ? ord.total.toLocaleString('en-IN') : (ord.subtotal || 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {/* Items in order */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                          {ord.items.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                              <img src={item.image} alt={item.name} style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }} />
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{item.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  Qty: {item.quantity} {item.color ? `• ${item.color}` : ''} {item.size ? `• ${item.size}` : ''}
                                </div>
                              </div>
                              <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Actions: Track, Invoice, Return */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderTop: '1px solid var(--border-subtle)',
                          paddingTop: '12px',
                          flexWrap: 'wrap',
                          gap: '8px'
                        }}>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            Tracking: <strong>{ord.trackingNumber}</strong>
                          </div>

                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => setInvoiceOrder(ord)}
                              className="btn btn-secondary btn-sm"
                              style={{ gap: '4px' }}
                            >
                              <FileText size={14} /> Tax Invoice
                            </button>

                            <button
                              onClick={() => setTrackingOrderId(ord.id)}
                              className="btn btn-primary btn-sm"
                              style={{ gap: '4px' }}
                            >
                              <Truck size={14} /> Track Delivery
                            </button>

                            {!ord.returnRequested && ord.status === 'Delivered' && (
                              <button
                                onClick={() => setReturnModalOrderId(ord.id)}
                                className="btn btn-outline btn-sm"
                                style={{ gap: '4px' }}
                              >
                                <RotateCcw size={14} /> Return Item
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SAVED ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Saved Delivery Locations</h2>
                  {!isAddingAddress && (
                    <button onClick={() => setIsAddingAddress(true)} className="btn btn-primary btn-sm" style={{ gap: '4px' }}>
                      <Plus size={14} /> Add Address
                    </button>
                  )}
                </div>

                {isAddingAddress ? (
                  <form onSubmit={handleCreateAddress} style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg-surface)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontWeight: 800 }}>New Delivery Address</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <input
                        type="text"
                        placeholder="Title (e.g. Home, Office)"
                        value={newAddr.title}
                        onChange={(e) => setNewAddr({ ...newAddr, title: e.target.value })}
                        required
                        style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                      />
                      <input
                        type="text"
                        placeholder="Recipient Name"
                        value={newAddr.fullName}
                        onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                        required
                        style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                      />
                    </div>
                    <input
                      type="tel"
                      placeholder="Phone (+91 98765 43210)"
                      value={newAddr.phone}
                      onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                      required
                      style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                    />
                    <input
                      type="text"
                      placeholder="Street Address, Building, House No."
                      value={newAddr.street}
                      onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                      required
                      style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                    />
                    <input
                      type="text"
                      placeholder="Landmark (e.g. Near City Mall, Opp. Metro Station)"
                      value={newAddr.landmark}
                      onChange={(e) => setNewAddr({ ...newAddr, landmark: e.target.value })}
                      style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                      <input
                        type="text"
                        placeholder="City"
                        value={newAddr.city}
                        onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                        required
                        style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={newAddr.state}
                        onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                        required
                        style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                      />
                      <input
                        type="text"
                        placeholder="6-digit Pincode"
                        value={newAddr.pincode}
                        onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                        required
                        maxLength={6}
                        pattern="[1-9][0-9]{5}"
                        title="Enter valid 6-digit Indian pincode"
                        style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                      />
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={newAddr.isDefault} onChange={(e) => setNewAddr({ ...newAddr, isDefault: e.target.checked })} />
                      Set as default delivery address
                    </label>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button type="submit" className="btn btn-primary">Save Address</button>
                      <button type="button" onClick={() => setIsAddingAddress(false)} className="btn btn-secondary">Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                    {user.addresses.map((addr, index) => (
                      <div
                        key={addr.id}
                        className="glass-panel"
                        style={{
                          padding: '18px',
                          borderRadius: 'var(--radius-md)',
                          border: addr.isDefault ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <span style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background: 'var(--primary)',
                              color: '#fff',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 800
                            }}>
                              {index + 1}
                            </span>
                            <span style={{ fontWeight: 800, fontSize: '0.92rem' }}>{addr.fullName}</span>
                            <span className="badge badge-primary">{addr.title}</span>
                            {addr.isDefault && <span className="badge badge-emerald">Default</span>}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {addr.street}
                            {addr.landmark && <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)' }}>Near: {addr.landmark}</span>}
                            {addr.city}, {addr.state} — <strong>{addr.pincode}</strong>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                            Phone: {addr.phone}
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                          {!addr.isDefault ? (
                            <button onClick={() => setDefaultAddress(addr.id)} style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
                              Make Default
                            </button>
                          ) : <span />}
                          <button onClick={() => deleteAddress(addr.id)} style={{ color: 'var(--accent-rose)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Trash2 size={13} /> Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>
                  Your Saved Wishlist ({wishlistedProducts.length})
                </h2>

                {wishlistedProducts.length === 0 ? (
                  <div className="glass-panel" style={{ padding: '48px 20px', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
                    <Heart size={48} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px' }}>Wishlist is Empty</h3>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                      Save your favorite items with the heart icon to purchase them anytime.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                    {wishlistedProducts.map((p) => (
                      <div key={p.id} className="glass-panel" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                        <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                        <div style={{ padding: '12px' }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {p.name}
                          </div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--primary)', margin: '6px 0' }}>
                            ₹{p.price.toLocaleString('en-IN')}
                          </div>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => addToCart(p, 1)} className="btn btn-primary btn-sm" style={{ flex: 1, fontSize: '0.75rem' }}>
                              + Bag
                            </button>
                            <button onClick={() => toggleWishlist(p.id)} className="btn btn-secondary btn-sm">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* RETURNS TAB */}
            {activeTab === 'returns' && (
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>
                  Return & Exchange Claims
                </h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Items delivered within 30 days are eligible for doorstep inspection and instant refund.
                </p>

                {orders.filter(o => o.returnRequested).length === 0 ? (
                  <div className="glass-panel" style={{ padding: '36px 20px', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
                    <CheckCircle size={40} style={{ color: 'var(--accent-emerald)', marginBottom: '8px' }} />
                    <div style={{ fontWeight: 800 }}>No Active Return Claims</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>All your orders are in pristine verified condition.</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {orders.filter(o => o.returnRequested).map(o => (
                      <div key={o.id} className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 800 }}>Order #{o.id}</span>
                          <span className="badge badge-gold">{o.returnStatus || 'Under Merchant Review'}</span>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                          Reason: "{o.returnReason}"
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Printable Tax Invoice Modal */}
        {invoiceOrder && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.8)',
              zIndex: 3000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}
            onClick={() => setInvoiceOrder(null)}
          >
            <div
              style={{
                background: '#ffffff',
                color: '#0f172a',
                padding: '32px',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#4f46e5' }}>CARTVERSE</h2>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>TAX INVOICE / RECEIPT</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.82rem' }}>
                  <div><strong>Invoice #:</strong> INV-{invoiceOrder.id}</div>
                  <div><strong>Date:</strong> {new Date(invoiceOrder.date).toLocaleDateString()}</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.82rem' }}>
                <div>
                  <div style={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Billed To:</div>
                  <div style={{ fontWeight: 700 }}>{invoiceOrder.shippingAddress?.fullName || user.name}</div>
                  <div>{invoiceOrder.shippingAddress?.street}</div>
                  <div>{invoiceOrder.shippingAddress?.city}, {invoiceOrder.shippingAddress?.state} - {invoiceOrder.shippingAddress?.pincode}</div>
                  <div>Contact: {invoiceOrder.shippingAddress?.phone}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Payment Mode:</div>
                  <div>{invoiceOrder.paymentMethod}</div>
                  <div style={{ color: '#10b981', fontWeight: 700 }}>● PAID IN FULL</div>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '20px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: '8px 0' }}>Item</th>
                    <th style={{ padding: '8px 0', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '8px 0', textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceOrder.items.map((it, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 0' }}>{it.name}</td>
                      <td style={{ padding: '8px 0', textAlign: 'center' }}>{it.quantity}</td>
                      <td style={{ padding: '8px 0', textAlign: 'right' }}>₹{(it.price * it.quantity).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal:</span>
                  <span>₹{invoiceOrder.subtotal?.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>GST Tax (18%):</span>
                  <span>₹{invoiceOrder.tax?.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '1.1rem', marginTop: '8px', borderTop: '1px dashed #cbd5e1', paddingTop: '8px' }}>
                  <span>Total Paid:</span>
                  <span>₹{invoiceOrder.total?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', gap: '10px' }}>
                <button onClick={() => window.print()} className="btn btn-primary" style={{ flex: 1 }}>
                  Print Tax Invoice
                </button>
                <button onClick={() => setInvoiceOrder(null)} className="btn btn-secondary">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
