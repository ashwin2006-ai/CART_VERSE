import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Search, ChevronDown, ChevronUp, Send, Loader2, AlertCircle, CheckCircle2,
  X, ArrowLeft, Mail, Phone, MessageSquare, Clock, CheckCircle, AlertTriangle
} from 'lucide-react';

const SUPPORT_CATEGORIES = [
  { value: 'FAQ', label: 'Frequently Asked Questions', icon: 'MessageSquare' },
  { value: 'ORDER_HELP', label: 'Order Help', icon: 'Package' },
  { value: 'PAYMENT_HELP', label: 'Payment Help', icon: 'CreditCard' },
  { value: 'DELIVERY_HELP', label: 'Delivery & Shipping', icon: 'Truck' },
  { value: 'RETURNS_REFUNDS', label: 'Returns & Refunds', icon: 'RotateCcw' },
  { value: 'ACCOUNT_LOGIN', label: 'Account & Login', icon: 'User' },
  { value: 'PRODUCT_HELP', label: 'Product Help', icon: 'HelpCircle' },
  { value: 'OTHER', label: 'Other', icon: 'MoreHorizontal' },
];

const TICKET_STATUS_COLORS = {
  OPEN: { bg: '#dbeafe', text: '#0369a1', label: 'Open' },
  IN_PROGRESS: { bg: '#fef08a', text: '#854d0e', label: 'In Progress' },
  RESOLVED: { bg: '#d1fae5', text: '#065f46', label: 'Resolved' },
  CLOSED: { bg: '#f3f4f6', text: '#374151', label: 'Closed' },
};

export const SupportCenter = () => {
  const { user, theme, setCurrentView, addToast } = useShop();
  const isDark = theme === 'dark';
  
  // Styling variables
  const bg = isDark ? '#0b0f1a' : '#f7f8fa';
  const cardBg = isDark ? '#0f172a' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.07)' : '#e5e7eb';
  const textPrimary = isDark ? '#f1f5f9' : '#111827';
  const textMuted = isDark ? '#64748b' : '#9ca3af';
  const accent = '#6C63FF';
  
  // View state
  const [activeTab, setActiveTab] = useState('faq'); // 'faq', 'contact', 'my_tickets'
  
  // FAQ state
  const [faqs, setFaqs] = useState([]);
  const [selectedFaqCategory, setSelectedFaqCategory] = useState('ORDER_HELP');
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState(null);
  const [isLoadingFaqs, setIsLoadingFaqs] = useState(false);
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    order_id: '',
    category: 'ORDER_HELP',
    subject: '',
    message: '',
  });
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [ticketId, setTicketId] = useState(null);
  
  // My tickets state
  const [myTickets, setMyTickets] = useState([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  
  // Load FAQs
  useEffect(() => {
    const loadFaqs = async () => {
      if (!isSupabaseConfigured()) {
        console.warn('Supabase not configured');
        return;
      }
      
      try {
        setIsLoadingFaqs(true);
        const { data, error } = await supabase
          .from('support_faq')
          .select('*')
          .eq('is_active', true)
          .order('order', { ascending: true });
        
        if (error) throw error;
        setFaqs(data || []);
      } catch (err) {
        console.error('Error loading FAQs:', err);
        addToast('Error loading FAQs', 'error');
      } finally {
        setIsLoadingFaqs(false);
      }
    };
    
    loadFaqs();
  }, [addToast]);
  
  // Load user's support tickets
  useEffect(() => {
    const loadTickets = async () => {
      if (!isSupabaseConfigured() || !user?.email) return;
      
      try {
        setIsLoadingTickets(true);
        const { data, error } = await supabase
          .from('support_tickets')
          .select('*')
          .or(`email.eq.${user.email},user_id.eq.${user.id}`)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setMyTickets(data || []);
      } catch (err) {
        console.error('Error loading tickets:', err);
      } finally {
        setIsLoadingTickets(false);
      }
    };
    
    if (activeTab === 'my_tickets') {
      loadTickets();
    }
  }, [activeTab, user?.email, user?.id]);
  
  // Filter FAQs
  const filteredFaqs = useMemo(() => {
    let list = faqs.filter(f => f.category === selectedFaqCategory);
    
    if (faqSearchQuery.trim()) {
      const q = faqSearchQuery.toLowerCase();
      list = list.filter(f =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q)
      );
    }
    
    return list;
  }, [faqs, selectedFaqCategory, faqSearchQuery]);
  
  // Submit support ticket
  const handleSubmitTicket = useCallback(async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);
    
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.subject.trim() || !contactForm.message.trim()) {
      setSubmitError('Please fill in all required fields');
      return;
    }
    
    if (!isSupabaseConfigured()) {
      setSubmitError('Support system is temporarily unavailable. Please try again later.');
      return;
    }
    
    try {
      setIsSubmittingTicket(true);
      
      const { data, error } = await supabase
        .from('support_tickets')
        .insert([{
          user_id: user?.id || null,
          name: contactForm.name,
          email: contactForm.email,
          order_id: contactForm.order_id || null,
          category: contactForm.category,
          subject: contactForm.subject,
          message: contactForm.message,
          status: 'OPEN',
        }])
        .select();
      
      if (error) throw error;
      
      const newTicket = data[0];
      setTicketId(newTicket.id);
      setSubmitSuccess(true);
      setContactForm({
        name: user?.name || '',
        email: user?.email || '',
        order_id: '',
        category: 'ORDER_HELP',
        subject: '',
        message: '',
      });
      
      addToast({
        type: 'success',
        title: 'Support Request Submitted',
        message: `Your ticket ID is ${newTicket.id.slice(0, 8)}. We'll respond soon!`
      });
      
      // Reload tickets if user is logged in
      if (user?.id) {
        setTimeout(() => setActiveTab('my_tickets'), 2000);
      }
    } catch (err) {
      console.error('Error submitting ticket:', err);
      setSubmitError(err.message || 'Failed to submit support request. Please try again.');
      addToast('Error submitting support request', 'error');
    } finally {
      setIsSubmittingTicket(false);
    }
  }, [contactForm, user, isSupabaseConfigured, addToast]);
  
  return (
    <div style={{
      minHeight: '100vh',
      background: bg,
      paddingBottom: 'clamp(68px, 60px + env(safe-area-inset-bottom), 100px)',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${accent} 0%, #a855f7 100%)`,
        color: '#fff',
        padding: 'clamp(20px, 5vw, 40px)',
        textAlign: 'center',
      }}>
        <button
          onClick={() => setCurrentView('store')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#fff',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.88rem',
            fontWeight: 600,
            marginBottom: '16px',
            marginLeft: 'clamp(8px, 2vw, 20px)',
          }}
        >
          <ArrowLeft size={16} />
          Back to Store
        </button>
        
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 900, margin: '0 0 8px 0' }}>
          Help & Support
        </h1>
        <p style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)', opacity: 0.95, margin: 0 }}>
          We're here to help. Find answers or contact our support team.
        </p>
      </div>
      
      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(20px, 4vw, 32px)' }}>
        
        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: 'clamp(8px, 2vw, 16px)',
          marginBottom: '24px',
          borderBottom: `1px solid ${border}`,
          overflowX: 'auto',
          paddingBottom: '12px',
        }}>
          {[
            { id: 'faq', label: 'FAQ', icon: MessageSquare },
            { id: 'contact', label: 'Contact Support', icon: Mail },
            ...(user?.isLoggedIn ? [{ id: 'my_tickets', label: 'My Requests', icon: Clock }] : []),
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  borderRadius: '8px 8px 0 0',
                  fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
                  fontWeight: activeTab === tab.id ? 700 : 600,
                  color: activeTab === tab.id ? accent : textMuted,
                  background: activeTab === tab.id ? `${accent}15` : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
        
        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div style={{ display: 'grid', gap: '24px', maxWidth: '900px' }}>
            {/* Category Selection */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '10px',
            }}>
              {SUPPORT_CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedFaqCategory(cat.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    border: `2px solid ${selectedFaqCategory === cat.value ? accent : border}`,
                    background: selectedFaqCategory === cat.value ? `${accent}15` : cardBg,
                    color: selectedFaqCategory === cat.value ? accent : textPrimary,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            
            {/* Search */}
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}>
              <Search size={18} style={{
                position: 'absolute',
                left: '14px',
                color: textMuted,
              }} />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={faqSearchQuery}
                onChange={(e) => setFaqSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '8px',
                  border: `1px solid ${border}`,
                  fontSize: '0.9rem',
                  background: cardBg,
                  color: textPrimary,
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
              />
            </div>
            
            {/* FAQ Items */}
            {isLoadingFaqs ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: textMuted }}>
                <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
                <p>Loading FAQs...</p>
              </div>
            ) : filteredFaqs.length > 0 ? (
              <div style={{ display: 'grid', gap: '12px' }}>
                {filteredFaqs.map(faq => (
                  <div
                    key={faq.id}
                    style={{
                      background: cardBg,
                      border: `1px solid ${border}`,
                      borderRadius: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      onClick={() => setExpandedFaqId(expandedFaqId === faq.id ? null : faq.id)}
                      style={{
                        width: '100%',
                        padding: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: textPrimary,
                        textAlign: 'left',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = isDark ? '#1e293b' : '#f9fafb'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ flex: 1 }}>{faq.question}</span>
                      {expandedFaqId === faq.id ? (
                        <ChevronUp size={20} color={accent} />
                      ) : (
                        <ChevronDown size={20} color={textMuted} />
                      )}
                    </button>
                    
                    {expandedFaqId === faq.id && (
                      <div style={{
                        padding: '0 16px 16px 16px',
                        borderTop: `1px solid ${border}`,
                        fontSize: '0.9rem',
                        color: textMuted,
                        lineHeight: 1.6,
                      }}>
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: cardBg,
                borderRadius: '8px',
                color: textMuted,
              }}>
                <MessageSquare size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                <p>No FAQs found. Try a different category or search term.</p>
              </div>
            )}
          </div>
        )}
        
        {/* Contact Form Tab */}
        {activeTab === 'contact' && (
          <div style={{ maxWidth: '600px' }}>
            {submitSuccess ? (
              <div style={{
                background: cardBg,
                border: `2px solid #10b981`,
                borderRadius: '8px',
                padding: '32px',
                textAlign: 'center',
              }}>
                <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: textPrimary, margin: '0 0 8px 0' }}>
                  Request Submitted!
                </h3>
                <p style={{ color: textMuted, margin: '8px 0 16px 0' }}>
                  Thank you for contacting us. Your support request has been received.
                </p>
                <p style={{ fontSize: '0.85rem', color: accent, fontWeight: 700, margin: '0 0 24px 0' }}>
                  Ticket ID: <code style={{ background: isDark ? '#1e293b' : '#f3f4f6', padding: '4px 8px', borderRadius: '4px' }}>
                    {ticketId?.slice(0, 8).toUpperCase()}
                  </code>
                </p>
                <p style={{ color: textMuted, fontSize: '0.9rem', marginBottom: '24px' }}>
                  We typically respond within 24-48 hours. You can track your request status below if you're logged in.
                </p>
                <button
                  onClick={() => {
                    setSubmitSuccess(false);
                    setContactForm({
                      name: user?.name || '',
                      email: user?.email || '',
                      order_id: '',
                      category: 'ORDER_HELP',
                      subject: '',
                      message: '',
                    });
                  }}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    background: accent,
                    color: '#fff',
                    border: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} style={{
                display: 'grid',
                gap: '16px',
              }}>
                {submitError && (
                  <div style={{
                    background: '#fee2e2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                  }}>
                    <AlertCircle size={20} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <p style={{ margin: 0, color: '#991b1b', fontSize: '0.9rem' }}>{submitError}</p>
                  </div>
                )}
                
                {/* Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: textMuted }}>
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${border}`,
                      background: cardBg,
                      color: textPrimary,
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                </div>
                
                {/* Email */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: textMuted }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${border}`,
                      background: cardBg,
                      color: textPrimary,
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                </div>
                
                {/* Order ID */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: textMuted }}>
                    Order ID (optional)
                  </label>
                  <input
                    type="text"
                    value={contactForm.order_id}
                    onChange={(e) => setContactForm({ ...contactForm, order_id: e.target.value })}
                    placeholder="e.g., ord-123456"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${border}`,
                      background: cardBg,
                      color: textPrimary,
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                </div>
                
                {/* Category */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: textMuted }}>
                    Category *
                  </label>
                  <select
                    required
                    value={contactForm.category}
                    onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${border}`,
                      background: cardBg,
                      color: textPrimary,
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  >
                    {SUPPORT_CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Subject */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: textMuted }}>
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="Briefly describe your issue"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${border}`,
                      background: cardBg,
                      color: textPrimary,
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                </div>
                
                {/* Message */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: textMuted }}>
                    Message *
                  </label>
                  <textarea
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Describe your issue in detail..."
                    rows={6}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${border}`,
                      background: cardBg,
                      color: textPrimary,
                      fontSize: '0.9rem',
                      outline: 'none',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                    }}
                  />
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmittingTicket}
                  style={{
                    padding: '14px 24px',
                    borderRadius: '8px',
                    background: isSubmittingTicket ? textMuted : accent,
                    color: '#fff',
                    border: 'none',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    cursor: isSubmittingTicket ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                  }}
                >
                  {isSubmittingTicket ? (
                    <>
                      <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Submit Support Request
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
        
        {/* My Tickets Tab */}
        {activeTab === 'my_tickets' && user?.isLoggedIn && (
          <div style={{ maxWidth: '900px' }}>
            {isLoadingTickets ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: textMuted }}>
                <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
                <p>Loading your support requests...</p>
              </div>
            ) : selectedTicket ? (
              // Ticket Detail View
              <div style={{
                background: cardBg,
                border: `1px solid ${border}`,
                borderRadius: '8px',
                padding: '24px',
              }}>
                <button
                  onClick={() => setSelectedTicket(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '20px',
                    color: accent,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                  }}
                >
                  <ArrowLeft size={16} />
                  Back to Requests
                </button>
                
                <div style={{ display: 'grid', gap: '20px' }}>
                  {/* Ticket Header */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '16px', marginBottom: '12px' }}>
                      <div>
                        <p style={{ fontSize: '0.85rem', color: textMuted, margin: '0 0 4px 0' }}>Ticket ID</p>
                        <p style={{ fontSize: '1.1rem', fontWeight: 800, color: textPrimary, margin: 0, fontFamily: 'monospace' }}>
                          {selectedTicket.id.slice(0, 8).toUpperCase()}
                        </p>
                      </div>
                      <div style={{
                        background: TICKET_STATUS_COLORS[selectedTicket.status].bg,
                        color: TICKET_STATUS_COLORS[selectedTicket.status].text,
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                      }}>
                        {TICKET_STATUS_COLORS[selectedTicket.status].label}
                      </div>
                    </div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: textPrimary, margin: '12px 0' }}>
                      {selectedTicket.subject}
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: textMuted, margin: 0 }}>
                      Created {new Date(selectedTicket.created_at).toLocaleDateString()} at {new Date(selectedTicket.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  
                  {/* Ticket Details */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '16px',
                    padding: '16px',
                    background: isDark ? '#1e293b' : '#f9fafb',
                    borderRadius: '8px',
                  }}>
                    <div>
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: textMuted, margin: '0 0 4px 0', textTransform: 'uppercase' }}>Category</p>
                      <p style={{ margin: 0, color: textPrimary, fontSize: '0.9rem' }}>
                        {SUPPORT_CATEGORIES.find(c => c.value === selectedTicket.category)?.label || selectedTicket.category}
                      </p>
                    </div>
                    {selectedTicket.order_id && (
                      <div>
                        <p style={{ fontSize: '0.8rem', fontWeight: 700, color: textMuted, margin: '0 0 4px 0', textTransform: 'uppercase' }}>Order ID</p>
                        <p style={{ margin: 0, color: textPrimary, fontSize: '0.9rem', fontFamily: 'monospace' }}>
                          {selectedTicket.order_id.slice(0, 8)}
                        </p>
                      </div>
                    )}
                    <div>
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: textMuted, margin: '0 0 4px 0', textTransform: 'uppercase' }}>Email</p>
                      <p style={{ margin: 0, color: textPrimary, fontSize: '0.9rem' }}>{selectedTicket.email}</p>
                    </div>
                  </div>
                  
                  {/* Message */}
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: textPrimary, margin: '0 0 12px 0' }}>Your Message</h4>
                    <div style={{
                      background: isDark ? '#1e293b' : '#f9fafb',
                      borderRadius: '8px',
                      padding: '16px',
                      lineHeight: 1.6,
                      color: textMuted,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}>
                      {selectedTicket.message}
                    </div>
                  </div>
                  
                  {/* Admin Reply */}
                  {selectedTicket.admin_reply && (
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: accent, margin: '0 0 12px 0' }}>Our Response</h4>
                      <div style={{
                        background: isDark ? '#1e293b' : '#f0fdf4',
                        border: `1px solid ${isDark ? '#334155' : '#bbf7d0'}`,
                        borderRadius: '8px',
                        padding: '16px',
                        lineHeight: 1.6,
                        color: textMuted,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}>
                        {selectedTicket.admin_reply}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : myTickets.length > 0 ? (
              // Tickets List
              <div style={{ display: 'grid', gap: '12px' }}>
                {myTickets.map(ticket => (
                  <button
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    style={{
                      background: cardBg,
                      border: `1px solid ${border}`,
                      borderRadius: '8px',
                      padding: '16px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      gap: '16px',
                      alignItems: 'start',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isDark ? '#1e293b' : '#f9fafb';
                      e.currentTarget.style.borderColor = accent;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = cardBg;
                      e.currentTarget.style.borderColor = border;
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: textPrimary, margin: 0 }}>
                          {ticket.subject}
                        </h4>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: textMuted }}>
                          #{ticket.id.slice(0, 8).toUpperCase()}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: textMuted, margin: '0 0 8px 0' }}>
                        {SUPPORT_CATEGORIES.find(c => c.value === ticket.category)?.label || ticket.category}
                      </p>
                      <p style={{ fontSize: '0.8rem', color: textMuted, margin: 0 }}>
                        {new Date(ticket.created_at).toLocaleDateString()} at {new Date(ticket.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <div style={{
                      background: TICKET_STATUS_COLORS[ticket.status].bg,
                      color: TICKET_STATUS_COLORS[ticket.status].text,
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                    }}>
                      {TICKET_STATUS_COLORS[ticket.status].label}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div style={{
                background: cardBg,
                border: `1px solid ${border}`,
                borderRadius: '8px',
                padding: '40px 20px',
                textAlign: 'center',
                color: textMuted,
              }}>
                <Clock size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                <p>You haven't submitted any support requests yet.</p>
                <button
                  onClick={() => setActiveTab('contact')}
                  style={{
                    marginTop: '16px',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    background: accent,
                    color: '#fff',
                    border: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Create One Now
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Guest-only message for my_tickets tab */}
        {activeTab === 'my_tickets' && !user?.isLoggedIn && (
          <div style={{
            background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: '8px',
            padding: '40px 20px',
            textAlign: 'center',
            color: textMuted,
          }}>
            <AlertTriangle size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 8px 0' }}>Sign in to view your requests</p>
            <p style={{ margin: '0 0 20px 0', fontSize: '0.9rem' }}>
              Log in to track your support requests and see responses from our team.
            </p>
            <button
              onClick={() => window.dispatchEvent(new Event('cartverse:open-auth'))}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                background: accent,
                color: '#fff',
                border: 'none',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Sign In / Register
            </button>
          </div>
        )}
      </main>
      
      {/* Spin animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
