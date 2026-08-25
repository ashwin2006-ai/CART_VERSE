import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Sparkles,
  X,
  Send,
  ShoppingBag,
  Move
} from 'lucide-react';

export const AiAssistant = () => {
  const {
    isAiAssistantOpen,
    setIsAiAssistantOpen,
    products,
    addToCart,
    setActiveProductId,
    orders,
    coupons,
    setTrackingOrderId
  } = useShop();

  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'ai',
      text: 'Hello! I am Cartverse AI, your smart shopping concierge. Looking for product suggestions, checking order status, or finding discount codes in ₹ (INR)?',
      time: 'Just now',
      suggestions: [
        'Top tech under ₹5,000',
        'Find running shoes',
        'Active promo codes',
        'Track my order'
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // -------------------------------------------------------------
  // MOVABLE / DRAGGABLE BUTTON LOGIC (Desktop + Mobile Touch)
  // -------------------------------------------------------------
  const [btnPos, setBtnPos] = useState({ x: window.innerWidth - 180, y: window.innerHeight - 80 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });
  const hasMovedRef = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      setBtnPos(prev => ({
        x: Math.min(prev.x, window.innerWidth - 170),
        y: Math.min(prev.y, window.innerHeight - 80)
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: btnPos.x,
      initialY: btnPos.y
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;

    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      hasMovedRef.current = true;
    }

    const newX = Math.max(10, Math.min(window.innerWidth - 170, dragStartRef.current.initialX + deltaX));
    const newY = Math.max(10, Math.min(window.innerHeight - 70, dragStartRef.current.initialY + deltaY));

    setBtnPos({ x: newX, y: newY });
  };

  const handlePointerUp = (e) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    // If it was just a tap and not a drag, open the assistant
    if (!hasMovedRef.current) {
      setIsAiAssistantOpen(true);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAiAssistantOpen) {
      scrollToBottom();
    }
  }, [messages, isAiAssistantOpen]);

  const handleSendMessage = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = '';
      let recommendedProducts = [];
      const lowerQuery = query.toLowerCase();

      if (lowerQuery.includes('tech') || lowerQuery.includes('headphone') || lowerQuery.includes('projector') || lowerQuery.includes('keyboard')) {
        recommendedProducts = products.filter(p => p.category === 'electronics');
        replyText = `Here are our top rated electronics and audio gear in ₹ INR:`;
      } else if (lowerQuery.includes('shoe') || lowerQuery.includes('footwear') || lowerQuery.includes('runner') || lowerQuery.includes('sneaker')) {
        recommendedProducts = products.filter(p => p.category === 'footwear');
        replyText = `Here are our bestselling high-performance shoes:`;
      } else if (lowerQuery.includes('cloth') || lowerQuery.includes('fashion') || lowerQuery.includes('hoodie') || lowerQuery.includes('shirt')) {
        recommendedProducts = products.filter(p => p.category === 'fashion');
        replyText = `Explore our contemporary apparel collection:`;
      } else if (lowerQuery.includes('code') || lowerQuery.includes('coupon') || lowerQuery.includes('discount') || lowerQuery.includes('promo')) {
        replyText = `Active Cartverse discount coupons:\n• **SAVE20** – 20% off on orders above ₹2,999\n• **WELCOME10** – 10% off your entire first purchase\n• **FREESHIP** – Free express shipping over ₹999\n• **FLAT500** – ₹500 instant discount on orders above ₹3,999`;
      } else if (lowerQuery.includes('track') || lowerQuery.includes('order') || lowerQuery.includes('shipping')) {
        if (orders.length > 0) {
          const latestOrder = orders[0];
          replyText = `Your latest order **#${latestOrder.id}** is currently **${latestOrder.status}** with ${latestOrder.carrier}.`;
        } else {
          replyText = `You can view and track all your deliveries in your Account Dashboard!`;
        }
      } else {
        recommendedProducts = products.filter(p => p.featured).slice(0, 3);
        replyText = `Here are featured trending items you might love:`;
      }

      const aiMsg = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: replyText,
        recommendedProducts,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          'Deals under ₹2,000',
          'Cartverse return policy',
          'Track my package'
        ]
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      {/* 🟢 SLEEK COMPACT Floating Circular AI Icon Trigger Button */}
      {!isAiAssistantOpen && (
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{
            position: 'fixed',
            left: `${btnPos.x}px`,
            top: `${btnPos.y}px`,
            zIndex: 1500,
            touchAction: 'none',
            userSelect: 'none',
            cursor: 'grab'
          }}
        >
          <button
            className="ai-fab-button"
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'var(--primary-gradient)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.55), 0 0 15px rgba(236, 72, 153, 0.4)',
              border: '2px solid rgba(255, 255, 255, 0.35)',
              position: 'relative',
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease',
              outline: 'none'
            }}
            title="Cartverse AI Shopping Concierge (Drag to move or click to open)"
          >
            {/* Pulsing Outer Glow Ring */}
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                left: '-4px',
                right: '-4px',
                bottom: '-4px',
                borderRadius: '50%',
                border: '2px solid rgba(99, 102, 241, 0.5)',
                animation: 'aiPulse 2s infinite ease-in-out',
                pointerEvents: 'none'
              }}
            />
            
            <Sparkles size={22} className="ai-sparkle-icon" />

            {/* Micro Live Status Dot */}
            <span
              style={{
                position: 'absolute',
                bottom: '2px',
                right: '2px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#10b981',
                border: '2px solid #ffffff'
              }}
            />
          </button>
        </div>
      )}

      {/* Floating Chat Drawer Window */}
      {isAiAssistantOpen && (
        <div
          className="glass-panel animate-scale-in"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: 'min(420px, 94vw)',
            height: '620px',
            maxHeight: '85vh',
            zIndex: 2200,
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
            border: '1px solid var(--border-highlight)',
            background: 'var(--bg-card-solid)'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            background: 'var(--primary-gradient)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkles size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Cartverse AI Concierge</div>
                <div style={{ fontSize: '0.72rem', opacity: 0.85, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
                  Online & Ready
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsAiAssistantOpen(false)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            background: 'var(--bg-main)'
          }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                {/* Message Bubble */}
                <div style={{
                  maxWidth: '85%',
                  padding: '12px 16px',
                  borderRadius: msg.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                  background: msg.sender === 'user' ? 'var(--primary-gradient)' : 'var(--bg-surface)',
                  color: msg.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
                  fontSize: '0.85rem',
                  lineHeight: 1.45,
                  boxShadow: 'var(--shadow-sm)',
                  whiteSpace: 'pre-line'
                }}>
                  {msg.text}
                </div>

                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px', padding: '0 4px' }}>
                  {msg.time}
                </span>

                {/* Recommended Product Cards Carousel in Chat */}
                {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    overflowX: 'auto',
                    width: '100%',
                    marginTop: '10px',
                    paddingBottom: '4px'
                  }}>
                    {msg.recommendedProducts.map((prod) => (
                      <div
                        key={prod.id}
                        style={{
                          minWidth: '170px',
                          maxWidth: '170px',
                          background: 'var(--bg-card-solid)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-subtle)',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                        />
                        <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <div style={{ fontSize: '0.76rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {prod.name}
                          </div>
                          <div style={{ fontSize: '0.86rem', fontWeight: 900, color: 'var(--primary)', margin: '4px 0' }}>
                            ₹{prod.price.toLocaleString('en-IN')}
                          </div>
                          <div style={{ display: 'flex', gap: '4px', marginTop: 'auto' }}>
                            <button
                              onClick={() => {
                                setActiveProductId(prod.id);
                                setIsAiAssistantOpen(false);
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{ flex: 1, padding: '4px 6px', fontSize: '0.7rem' }}
                            >
                              View
                            </button>
                            <button
                              onClick={() => addToCart(prod, 1)}
                              className="btn btn-primary btn-sm"
                              style={{ flex: 1, padding: '4px 6px', fontSize: '0.7rem' }}
                            >
                              + Bag
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Prompts Suggestions */}
                {msg.suggestions && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                    {msg.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(sug)}
                        style={{
                          fontSize: '0.72rem',
                          background: 'var(--bg-surface)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-full)',
                          padding: '4px 10px',
                          fontWeight: 600
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                <Sparkles size={14} className="animate-spin" />
                <span>Cartverse AI is formulating suggestions...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{
              padding: '12px 16px',
              background: 'var(--bg-card-solid)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              gap: '8px'
            }}
          >
            <input
              type="text"
              placeholder="Ask Cartverse anything (e.g. Find shoes under ₹3,000)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.84rem',
                border: '1px solid var(--border-subtle)'
              }}
            />
            <button
              type="submit"
              className="btn btn-primary btn-icon"
              style={{ width: '40px', height: '40px', borderRadius: '50%' }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
