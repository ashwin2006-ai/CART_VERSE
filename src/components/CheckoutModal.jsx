import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  X,
  MapPin,
  CreditCard,
  QrCode,
  Landmark,
  Banknote,
  Truck,
  ShieldCheck,
  CheckCircle,
  Plus,
  ArrowRight,
  ChevronLeft,
  Sparkles,
  Lock,
  Eye
} from 'lucide-react';

export const CheckoutModal = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    directCheckoutItem,
    setDirectCheckoutItem,
    cart,
    user,
    addAddress,
    getCartTotals,
    placeOrder,
    appliedCoupon
  } = useShop();

  // Active step: 1: Address, 2: Shipping Method, 3: Payment, 4: Review
  const [step, setStep] = useState(1);

  // Address selection / new address form
  const safeUser = user || { name: 'Guest', phone: '', addresses: [] };
  const [selectedAddressId, setSelectedAddressId] = useState(
    safeUser.addresses?.find(a => a.isDefault)?.id || (safeUser.addresses?.[0] && safeUser.addresses[0].id) || ''
  );
  const [isAddingNewAddr, setIsAddingNewAddr] = useState((safeUser.addresses?.length || 0) === 0);
  const [newAddress, setNewAddress] = useState({
    title: 'Home',
    fullName: safeUser.name || '',
    phone: safeUser.phone || '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    isDefault: false
  });

  // Shipping Speed option (in INR ₹)
  const [shippingSpeed, setShippingSpeed] = useState('standard'); // 'standard' (0), 'express' (99), 'rush' (199)

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI', 'Card', 'NetBanking', 'COD'
  const [showUpiQr, setShowUpiQr] = useState(false); // Only show QR when user clicks / interacts
  const [upiId, setUpiId] = useState('alex@okaxis');
  const [cardData, setCardData] = useState({
    number: '4242 •••• •••• 4242',
    name: safeUser.name || 'Alex Mercer',
    expiry: '08/29',
    cvv: '888'
  });
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCheckoutOpen) return null;

  // Compute Items to checkout (either direct "Buy Now" or entire Cart)
  const itemsToCheckout = directCheckoutItem ? [directCheckoutItem] : cart;
  if (itemsToCheckout.length === 0) {
    setIsCheckoutOpen(false);
    return null;
  }

  // Calculate Totals based on items & shipping speed (INR ₹)
  const baseTotals = getCartTotals(itemsToCheckout);
  let extraShippingCost = 0;
  if (shippingSpeed === 'express') extraShippingCost = 99;
  if (shippingSpeed === 'rush') extraShippingCost = 199;

  const finalTotals = {
    ...baseTotals,
    shippingFee: baseTotals.shippingFee + extraShippingCost,
    total: Math.round(baseTotals.total + extraShippingCost)
  };

  const handleSaveNewAddress = (e) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city || !newAddress.pincode) return;
    if (!/^[1-9][0-9]{5}$/.test(newAddress.pincode)) {
      alert('Please enter a valid 6-digit Indian pincode.');
      return;
    }
    addAddress(newAddress);
    setIsAddingNewAddr(false);
  };

  const selectedAddressObj = safeUser.addresses?.find(a => a.id === selectedAddressId) || safeUser.addresses?.[0] || newAddress;

  const handleConfirmOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      placeOrder({
        items: itemsToCheckout,
        shippingAddress: selectedAddressObj,
        paymentMethod,
        totals: finalTotals
      });

      setIsProcessing(false);
      setIsCheckoutOpen(false);
      setDirectCheckoutItem(null);
      setStep(1);
    }, 900);
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
        zIndex: 2100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(8px, 3vw, 24px)',
        overflowY: 'auto'
      }}
      onClick={() => setIsCheckoutOpen(false)}
    >
      <div
        className="glass-panel animate-scale-in"
        style={{
          background: 'var(--bg-card-solid)',
          width: '100%',
          maxWidth: '920px',
          maxHeight: '94vh',
          borderRadius: 'var(--radius-xl)',
          overflowY: 'auto',
          position: 'relative',
          border: '1px solid var(--border-highlight)',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          background: 'var(--bg-card-solid)',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <Lock size={16} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Cartverse Express Checkout</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                256-Bit Bank Grade SSL Encrypted Checkout
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setIsCheckoutOpen(false);
              setDirectCheckoutItem(null);
            }}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'var(--bg-surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
          padding: '8px 16px',
          gap: '4px',
          overflowX: 'auto'
        }}>
          {[
            { num: 1, label: '1. Delivery Address' },
            { num: 2, label: '2. Shipping Speed' },
            { num: 3, label: '3. Payment Gateway' },
            { num: 4, label: '4. Order Review' }
          ].map((s) => (
            <div
              key={s.num}
              onClick={() => {
                if (s.num < step) setStep(s.num);
              }}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.78rem',
                fontWeight: 700,
                textAlign: 'center',
                whiteSpace: 'nowrap',
                cursor: s.num < step ? 'pointer' : 'default',
                background: step === s.num ? 'var(--primary-gradient)' : 'transparent',
                color: step === s.num ? '#ffffff' : step > s.num ? 'var(--primary)' : 'var(--text-muted)'
              }}
            >
              {s.label}
            </div>
          ))}
        </div>

        {/* Two Column Layout: Step View on Left, Order Summary on Right */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '24px',
          padding: 'clamp(16px, 3vw, 28px)'
        }}>
          {/* Left: Active Step Forms */}
          <div>
            {/* STEP 1: Delivery Address */}
            {step === 1 && (
              <div className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={18} style={{ color: 'var(--primary)' }} /> Select Delivery Location
                  </h3>
                  {!isAddingNewAddr && (
                    <button
                      onClick={() => setIsAddingNewAddr(true)}
                      className="btn btn-secondary btn-sm"
                      style={{ gap: '4px', fontSize: '0.75rem' }}
                    >
                      <Plus size={14} /> Add New Address
                    </button>
                  )}
                </div>

                {/* Form to Add New Address */}
                {isAddingNewAddr ? (
                  <form onSubmit={handleSaveNewAddress} style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Add Delivery Address</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <input
                        type="text"
                        placeholder="Address Title (e.g. Home, Work)"
                        value={newAddress.title}
                        onChange={(e) => setNewAddress({ ...newAddress, title: e.target.value })}
                        required
                        style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}
                      />
                      <input
                        type="text"
                        placeholder="Recipient Full Name"
                        value={newAddress.fullName}
                        onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                        required
                        style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}
                      />
                    </div>
                    <input
                      type="tel"
                      placeholder="Contact Mobile (+91 98765 43210)"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      required
                      style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}
                    />
                    <input
                      type="text"
                      placeholder="Flat / House no., Building, Street Address"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      required
                      style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}
                    />
                    <input
                      type="text"
                      placeholder="Landmark (e.g. Near City Mall, Opp. Metro Station)"
                      value={newAddress.landmark}
                      onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                      style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                      <input
                        type="text"
                        placeholder="City"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        required
                        style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        required
                        style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}
                      />
                      <input
                        type="text"
                        placeholder="6-digit Pincode"
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                        required
                        maxLength={6}
                        pattern="[1-9][0-9]{5}"
                        title="Enter valid 6-digit Indian pincode"
                        style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button type="submit" className="btn btn-primary btn-sm">Save &amp; Use Address</button>
                      {user.addresses.length > 0 && (
                        <button type="button" onClick={() => setIsAddingNewAddr(false)} className="btn btn-secondary btn-sm">Cancel</button>
                      )}
                    </div>
                  </form>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {user.addresses.map((addr, index) => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        style={{
                          padding: '16px',
                          borderRadius: 'var(--radius-md)',
                          background: selectedAddressId === addr.id ? 'var(--primary-light)' : 'var(--bg-surface)',
                          border: selectedAddressId === addr.id ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px'
                        }}
                      >
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: selectedAddressId === addr.id ? 'var(--primary)' : 'var(--bg-card)',
                          color: selectedAddressId === addr.id ? '#ffffff' : 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          flexShrink: 0,
                          border: '1px solid var(--border-subtle)'
                        }}>
                          {index + 1}
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                              {addr.fullName}
                            </span>
                            <span className="badge badge-primary">{addr.title}</span>
                            {addr.isDefault && <span className="badge badge-emerald">Default</span>}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                            {addr.street}{addr.landmark ? `, Near ${addr.landmark}` : ''}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                            {addr.city}, {addr.state} — {addr.pincode}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            📞 {addr.phone}
                          </div>
                        </div>

                        {selectedAddressId === addr.id && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.78rem' }}>
                            <CheckCircle size={16} /> Selected
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    disabled={!selectedAddressObj || isAddingNewAddr}
                    onClick={() => setStep(2)}
                    className="btn btn-primary"
                    style={{ gap: '6px' }}
                  >
                    <span>Continue to Shipping</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Shipping Speed */}
            {step === 2 && (
              <div className="animate-fade-in">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Truck size={18} style={{ color: 'var(--primary)' }} /> Select Delivery Speed
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { id: 'standard', title: 'Standard Express Delivery', time: '3-4 Business Days', price: baseTotals.shippingFee === 0 ? 'FREE' : '₹99', fee: 0 },
                    { id: 'express', title: 'Priority Air Express', time: '1-2 Business Days', price: '+₹99', fee: 99 },
                    { id: 'rush', title: 'VIP Same-Day Rush Courier', time: 'Delivered in under 12 hours', price: '+₹199', fee: 199 }
                  ].map((speed) => (
                    <div
                      key={speed.id}
                      onClick={() => setShippingSpeed(speed.id)}
                      style={{
                        padding: '16px',
                        borderRadius: 'var(--radius-md)',
                        background: shippingSpeed === speed.id ? 'var(--primary-light)' : 'var(--bg-surface)',
                        border: shippingSpeed === speed.id ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                          type="radio"
                          name="shippingSpeed"
                          checked={shippingSpeed === speed.id}
                          onChange={() => setShippingSpeed(speed.id)}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{speed.title}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{speed.time}</div>
                        </div>
                      </div>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--accent-emerald)' }}>
                        {speed.price}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
                  <button onClick={() => setStep(1)} className="btn btn-secondary" style={{ gap: '6px' }}>
                    <ChevronLeft size={16} /> Back
                  </button>
                  <button onClick={() => setStep(3)} className="btn btn-primary" style={{ gap: '6px' }}>
                    <span>Continue to Payment</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment Gateway */}
            {step === 3 && (
              <div className="animate-fade-in">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={18} style={{ color: 'var(--primary)' }} /> Select Payment Method
                </h3>

                {/* Payment Tabs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '20px' }}>
                  {[
                    { id: 'UPI', label: 'UPI', icon: QrCode },
                    { id: 'Card', label: 'Card', icon: CreditCard },
                    { id: 'NetBanking', label: 'Net Banking', icon: Landmark },
                    { id: 'COD', label: 'Cash on Del.', icon: Banknote }
                  ].map((pm) => {
                    const Icon = pm.icon;
                    const isSel = paymentMethod === pm.id;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethod(pm.id)}
                        style={{
                          padding: '12px 8px',
                          borderRadius: 'var(--radius-md)',
                          background: isSel ? 'var(--primary-gradient)' : 'var(--bg-surface)',
                          color: isSel ? '#fff' : 'var(--text-primary)',
                          border: isSel ? '1px solid transparent' : '1px solid var(--border-subtle)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 700
                        }}
                      >
                        <Icon size={20} />
                        <span>{pm.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Method Details Box */}
                <div style={{
                  padding: '20px',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '20px'
                }}>
                  {paymentMethod === 'UPI' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '14px' }}>
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        Pay using UPI (Google Pay, PhonePe, Paytm, BHIM)
                      </div>

                      {/* Interactive Button to Reveal QR Code only when user chooses */}
                      {!showUpiQr ? (
                        <button
                          type="button"
                          onClick={() => setShowUpiQr(true)}
                          className="btn btn-outline"
                          style={{
                            padding: '12px 20px',
                            gap: '8px',
                            fontWeight: 700,
                            fontSize: '0.84rem'
                          }}
                        >
                          <QrCode size={18} style={{ color: 'var(--primary)' }} />
                          <span>Show / Generate UPI QR Code</span>
                        </button>
                      ) : (
                        <div className="animate-scale-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            padding: '12px',
                            background: '#ffffff',
                            borderRadius: '12px',
                            display: 'inline-block',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
                          }}>
                            {/* Realistic Mock QR Code */}
                            <div style={{
                              width: '140px',
                              height: '140px',
                              background: 'repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 50% / 20px 20px',
                              borderRadius: '6px'
                            }} />
                          </div>
                          <span style={{ fontSize: '0.76rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                            ● Live Dynamic QR Ready (Scan with any UPI App)
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowUpiQr(false)}
                            style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textDecoration: 'underline' }}
                          >
                            Hide QR Code
                          </button>
                        </div>
                      )}

                      <div style={{ width: '100%', maxWidth: '320px', marginTop: '6px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px', textAlign: 'left' }}>Or enter UPI Virtual ID:</label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. mobile@upi or name@okhdfcbank"
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'Card' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Card Number</label>
                        <input
                          type="text"
                          value={cardData.number}
                          onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace' }}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Valid Thru</label>
                          <input
                            type="text"
                            value={cardData.expiry}
                            onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>CVV / CVC</label>
                          <input
                            type="password"
                            value={cardData.cvv}
                            onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'NetBanking' && (
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Select Bank</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        {['HDFC Bank', 'State Bank of India (SBI)', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra'].map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setSelectedBank(b)}
                            style={{
                              padding: '10px',
                              borderRadius: 'var(--radius-sm)',
                              background: selectedBank === b ? 'var(--primary-light)' : 'var(--bg-card)',
                              border: selectedBank === b ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                              fontSize: '0.8rem',
                              fontWeight: 700
                            }}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'COD' && (
                    <div style={{ textAlign: 'center', padding: '10px 0' }}>
                      <Banknote size={36} style={{ color: 'var(--accent-emerald)', margin: '0 auto 10px' }} />
                      <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Cash on Delivery Available</div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Pay cash or scan UPI with the courier agent at the time of doorstep delivery.
                      </p>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
                  <button onClick={() => setStep(2)} className="btn btn-secondary" style={{ gap: '6px' }}>
                    <ChevronLeft size={16} /> Back
                  </button>
                  <button onClick={() => setStep(4)} className="btn btn-primary" style={{ gap: '6px' }}>
                    <span>Review Order</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Review & Place Order */}
            {step === 4 && (
              <div className="animate-fade-in">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={18} style={{ color: 'var(--accent-emerald)' }} /> Final Order Review
                </h3>

                {/* Summary Badges */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ padding: '12px 14px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem' }}>
                    <div style={{ fontWeight: 800, marginBottom: '2px', color: 'var(--text-primary)' }}>Delivery To:</div>
                    <div style={{ color: 'var(--text-secondary)' }}>
                      <strong>{selectedAddressObj.fullName}</strong> — {selectedAddressObj.street}, {selectedAddressObj.city}, {selectedAddressObj.state} ({selectedAddressObj.pincode})
                    </div>
                  </div>

                  <div style={{ padding: '12px 14px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem' }}>
                    <div style={{ fontWeight: 800, marginBottom: '2px', color: 'var(--text-primary)' }}>Payment & Speed:</div>
                    <div style={{ color: 'var(--text-secondary)' }}>
                      Method: <strong>{paymentMethod}</strong> • Shipping: <strong>{shippingSpeed === 'standard' ? 'Standard Ground' : shippingSpeed === 'express' ? 'Priority Air' : 'VIP Rush Courier'}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button onClick={() => setStep(3)} className="btn btn-secondary" style={{ gap: '6px' }}>
                    <ChevronLeft size={16} /> Back
                  </button>

                  <button
                    disabled={isProcessing}
                    onClick={handleConfirmOrder}
                    className="btn btn-primary btn-lg"
                    style={{ gap: '8px', fontWeight: 900 }}
                  >
                    {isProcessing ? (
                      <span>Securing Order...</span>
                    ) : (
                      <>
                        <span>Pay ₹{finalTotals.total.toLocaleString('en-IN')} & Confirm</span>
                        <Sparkles size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Order Summary */}
          <div>
            <div style={{
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              border: '1px solid var(--border-subtle)'
            }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '14px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
                Order Summary ({itemsToCheckout.length} items)
              </h4>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto', marginBottom: '16px' }}>
                {itemsToCheckout.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <img src={item.image || (item.images && item.images[0])} alt={item.name} style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Qty: {item.quantity} {item.color ? `• ${item.color}` : ''} {item.size ? `• ${item.size}` : ''}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown in INR */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Items Subtotal</span>
                  <span>₹{finalTotals.subtotal.toLocaleString('en-IN')}</span>
                </div>

                {finalTotals.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                    <span>Coupon Discount {appliedCoupon ? `(${appliedCoupon.code})` : ''}</span>
                    <span>-₹{finalTotals.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Delivery Charges</span>
                  <span>{finalTotals.shippingFee === 0 ? <strong style={{ color: 'var(--accent-emerald)' }}>FREE</strong> : `₹${finalTotals.shippingFee}`}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>GST (18% Estimated)</span>
                  <span>₹{finalTotals.tax.toLocaleString('en-IN')}</span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.05rem',
                  fontWeight: 900,
                  color: 'var(--text-primary)',
                  borderTop: '2px dashed var(--border-subtle)',
                  paddingTop: '10px',
                  marginTop: '4px'
                }}>
                  <span>Final Amount</span>
                  <span className="gradient-text" style={{ fontSize: '1.25rem' }}>
                    ₹{finalTotals.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
