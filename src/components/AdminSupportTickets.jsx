import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Search, Loader2, AlertCircle, CheckCircle2, Send, X, Filter,
  ChevronUp, ChevronDown, ArrowLeft, Clock, CheckCircle, AlertTriangle, MoreVertical
} from 'lucide-react';

const TICKET_STATUS_COLORS = {
  OPEN: { bg: '#dbeafe', text: '#0369a1', label: 'Open' },
  IN_PROGRESS: { bg: '#fef08a', text: '#854d0e', label: 'In Progress' },
  RESOLVED: { bg: '#d1fae5', text: '#065f46', label: 'Resolved' },
  CLOSED: { bg: '#f3f4f6', text: '#374151', label: 'Closed' },
};

const SUPPORT_CATEGORIES = {
  FAQ: 'FAQ',
  ORDER_HELP: 'Order Help',
  PAYMENT_HELP: 'Payment Help',
  DELIVERY_HELP: 'Delivery & Shipping',
  RETURNS_REFUNDS: 'Returns & Refunds',
  ACCOUNT_LOGIN: 'Account & Login',
  PRODUCT_HELP: 'Product Help',
  OTHER: 'Other',
};

export const AdminSupportTickets = () => {
  const { theme, addToast } = useShop();
  const isDark = theme === 'dark';
  
  // Styling variables
  const bg = isDark ? '#0b0f1a' : '#f7f8fa';
  const cardBg = isDark ? '#0f172a' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.07)' : '#e5e7eb';
  const textPrimary = isDark ? '#f1f5f9' : '#111827';
  const textMuted = isDark ? '#64748b' : '#9ca3af';
  const accent = '#6C63FF';
  
  // State
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [newStatus, setNewStatus] = useState(null);
  
  // Load tickets
  useEffect(() => {
    loadTickets();
  }, []);
  
  const loadTickets = async () => {
    if (!isSupabaseConfigured()) {
      addToast({ type: 'error', message: 'Supabase not configured' });
      return;
    }
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTickets(data || []);
    } catch (err) {
      console.error('Error loading tickets:', err);
      addToast({ type: 'error', message: 'Failed to load support tickets' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredTickets = tickets.filter(ticket => {
    if (statusFilter !== 'all' && ticket.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ticket.subject.toLowerCase().includes(q) ||
        ticket.email.toLowerCase().includes(q) ||
        ticket.name.toLowerCase().includes(q) ||
        ticket.id.toLowerCase().includes(q)
      );
    }
    return true;
  });
  
  const handleUpdateStatus = async (ticketId, newStatus) => {
    if (!isSupabaseConfigured()) return;
    
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status: newStatus })
        .eq('id', ticketId);
      
      if (error) throw error;
      
      // Update local state
      setTickets(prev => prev.map(t => 
        t.id === ticketId ? { ...t, status: newStatus } : t
      ));
      
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(prev => ({ ...prev, status: newStatus }));
      }
      
      addToast({ type: 'success', message: 'Ticket status updated' });
    } catch (err) {
      console.error('Error updating ticket:', err);
      addToast({ type: 'error', message: 'Failed to update ticket status' });
    }
  };
  
  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;
    
    if (!isSupabaseConfigured()) return;
    
    try {
      setIsSubmittingReply(true);
      
      const { error } = await supabase
        .from('support_tickets')
        .update({ admin_reply: replyText.trim() })
        .eq('id', selectedTicket.id);
      
      if (error) throw error;
      
      // Update local state
      const updated = { ...selectedTicket, admin_reply: replyText.trim() };
      setSelectedTicket(updated);
      setTickets(prev => prev.map(t => 
        t.id === selectedTicket.id ? updated : t
      ));
      
      setReplyText('');
      addToast({ type: 'success', message: 'Reply sent to customer' });
    } catch (err) {
      console.error('Error submitting reply:', err);
      addToast({ type: 'error', message: 'Failed to send reply' });
    } finally {
      setIsSubmittingReply(false);
    }
  };
  
  return (
    <div style={{ display: 'grid', gridTemplateColumns: selectedTicket ? '1fr 1fr' : '1fr', gap: '24px', minHeight: '600px' }}>
      {/* Tickets List */}
      <div>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: textPrimary, margin: '0 0 16px 0' }}>
            Support Tickets ({filteredTickets.length})
          </h2>
          
          {/* Search & Filter */}
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: cardBg,
              border: `1px solid ${border}`,
              borderRadius: '8px',
              padding: '0 12px',
            }}>
              <Search size={16} color={textMuted} style={{ marginRight: '8px' }} />
              <input
                type="text"
                placeholder="Search by subject, email, name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  padding: '10px 0',
                  background: 'transparent',
                  color: textPrimary,
                  outline: 'none',
                  fontSize: '0.9rem',
                }}
              />
            </div>
            
            {/* Status Filter */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['all', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    border: `1px solid ${statusFilter === status ? accent : border}`,
                    background: statusFilter === status ? `${accent}15` : 'transparent',
                    color: statusFilter === status ? accent : textMuted,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textTransform: 'uppercase',
                  }}
                >
                  {status === 'all' ? 'All Tickets' : TICKET_STATUS_COLORS[status]?.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Tickets List */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: textMuted }}>
            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
            <p>Loading tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div style={{
            background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: '8px',
            padding: '40px 20px',
            textAlign: 'center',
            color: textMuted,
          }}>
            <AlertTriangle size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p>No support tickets found</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '10px', maxHeight: '700px', overflowY: 'auto' }}>
            {filteredTickets.map(ticket => (
              <button
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                style={{
                  background: selectedTicket?.id === ticket.id ? `${accent}15` : cardBg,
                  border: `1px solid ${selectedTicket?.id === ticket.id ? accent : border}`,
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '12px',
                  alignItems: 'start',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: textMuted }}>
                      #{ticket.id.slice(0, 8).toUpperCase()}
                    </span>
                    {ticket.admin_reply && (
                      <span style={{ fontSize: '0.7rem', background: '#d1fae5', color: '#065f46', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                        REPLIED
                      </span>
                    )}
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: textPrimary, margin: '0 0 6px 0' }}>
                    {ticket.subject}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: textMuted, margin: '0 0 6px 0' }}>
                    {ticket.name} • {ticket.email}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: textMuted, margin: 0 }}>
                    {SUPPORT_CATEGORIES[ticket.category]} • {new Date(ticket.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div style={{
                  background: TICKET_STATUS_COLORS[ticket.status].bg,
                  color: TICKET_STATUS_COLORS[ticket.status].text,
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}>
                  {TICKET_STATUS_COLORS[ticket.status].label}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Ticket Detail */}
      {selectedTicket && (
        <div style={{
          background: cardBg,
          border: `1px solid ${border}`,
          borderRadius: '8px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '800px',
          overflowY: 'auto',
        }}>
          {/* Header */}
          <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: `1px solid ${border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: textPrimary, margin: 0 }}>
                {selectedTicket.subject}
              </h3>
              <button
                onClick={() => setSelectedTicket(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: textMuted,
                  padding: '4px',
                }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: textMuted, margin: '0 0 4px 0', textTransform: 'uppercase' }}>Ticket ID</p>
                <p style={{ margin: 0, fontSize: '0.9rem', fontFamily: 'monospace', color: textPrimary, fontWeight: 700 }}>
                  {selectedTicket.id}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: textMuted, margin: '0 0 4px 0', textTransform: 'uppercase' }}>Status</p>
                <select
                  value={selectedTicket.status}
                  onChange={(e) => handleUpdateStatus(selectedTicket.id, e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${border}`,
                    background: cardBg,
                    color: textPrimary,
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Ticket Info */}
          <div style={{
            background: isDark ? '#1e293b' : '#f9fafb',
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '16px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            fontSize: '0.8rem',
          }}>
            <div>
              <p style={{ color: textMuted, margin: '0 0 4px 0', fontWeight: 600 }}>Customer Name</p>
              <p style={{ color: textPrimary, margin: 0, fontWeight: 700 }}>{selectedTicket.name}</p>
            </div>
            <div>
              <p style={{ color: textMuted, margin: '0 0 4px 0', fontWeight: 600 }}>Email</p>
              <p style={{ color: textPrimary, margin: 0, fontWeight: 700, wordBreak: 'break-all' }}>{selectedTicket.email}</p>
            </div>
            <div>
              <p style={{ color: textMuted, margin: '0 0 4px 0', fontWeight: 600 }}>Category</p>
              <p style={{ color: textPrimary, margin: 0, fontWeight: 700 }}>{SUPPORT_CATEGORIES[selectedTicket.category]}</p>
            </div>
            {selectedTicket.order_id && (
              <div>
                <p style={{ color: textMuted, margin: '0 0 4px 0', fontWeight: 600 }}>Order ID</p>
                <p style={{ color: textPrimary, margin: 0, fontWeight: 700, fontFamily: 'monospace' }}>
                  {selectedTicket.order_id.slice(0, 8)}...
                </p>
              </div>
            )}
            <div>
              <p style={{ color: textMuted, margin: '0 0 4px 0', fontWeight: 600 }}>Created</p>
              <p style={{ color: textPrimary, margin: 0, fontWeight: 700 }}>
                {new Date(selectedTicket.created_at).toLocaleDateString()} {new Date(selectedTicket.created_at).toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          {/* Customer Message */}
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: textMuted, margin: '0 0 8px 0', textTransform: 'uppercase' }}>
              Customer Message
            </p>
            <div style={{
              background: isDark ? '#1e293b' : '#f9fafb',
              borderRadius: '6px',
              padding: '12px',
              fontSize: '0.85rem',
              lineHeight: 1.6,
              color: textMuted,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              maxHeight: '200px',
              overflowY: 'auto',
            }}>
              {selectedTicket.message}
            </div>
          </div>
          
          {/* Admin Reply */}
          {selectedTicket.admin_reply && (
            <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: `1px solid ${border}` }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: accent, margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                Your Response
              </p>
              <div style={{
                background: isDark ? '#1e293b' : '#f0fdf4',
                border: `1px solid ${isDark ? '#334155' : '#bbf7d0'}`,
                borderRadius: '6px',
                padding: '12px',
                fontSize: '0.85rem',
                lineHeight: 1.6,
                color: textMuted,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                maxHeight: '150px',
                overflowY: 'auto',
              }}>
                {selectedTicket.admin_reply}
              </div>
            </div>
          )}
          
          {/* Reply Form */}
          {selectedTicket.status !== 'CLOSED' && (
            <form onSubmit={handleSubmitReply} style={{ marginTop: 'auto' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: textMuted, margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                Send Response
              </label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your response to the customer..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: `1px solid ${border}`,
                  background: cardBg,
                  color: textPrimary,
                  fontSize: '0.85rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  outline: 'none',
                  marginBottom: '10px',
                }}
              />
              <button
                type="submit"
                disabled={!replyText.trim() || isSubmittingReply}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  background: replyText.trim() && !isSubmittingReply ? accent : textMuted,
                  color: '#fff',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: replyText.trim() && !isSubmittingReply ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {isSubmittingReply ? (
                  <>
                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Response
                  </>
                )}
              </button>
            </form>
          )}
          
          {selectedTicket.status === 'CLOSED' && (
            <div style={{
              background: isDark ? '#1e293b' : '#f3f4f6',
              padding: '12px',
              borderRadius: '6px',
              textAlign: 'center',
              color: textMuted,
              fontSize: '0.85rem',
              fontWeight: 600,
            }}>
              This ticket is closed. You cannot add new responses.
            </div>
          )}
        </div>
      )}
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
