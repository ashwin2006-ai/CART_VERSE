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
      text: '👋 Hey there! I\'m CartVerse AI, your personal shopping buddy!\n\nI can help you find amazing products, track orders, explore deals, or answer any questions. What are you in the mood for today?',
      time: 'Just now',
      suggestions: [
        '✨ Trending this week',
        '🎯 Help me find something',
        '💰 Best deals right now',
        '📦 Track my order',
        '❓ Help & Support'
      ]
    }
  ]);

  // FAQ Database
  const faqDatabase = [
    {
      question: 'How do I place an order?',
      answer: '🛒 Placing an order is simple!\n\n1. Browse our catalog by category or search\n2. Click on a product to view details\n3. Select quantity and add to bag\n4. Go to checkout and enter delivery address\n5. Choose payment method\n6. Place order\n\nYou\'ll receive an order confirmation via email!'
    },
    {
      question: 'What payment methods do you accept?',
      answer: '💳 We accept multiple payment methods:\n\n• Credit/Debit Cards (Visa, Mastercard)\n• Digital Wallets (Google Pay, Apple Pay)\n• Net Banking\n• UPI Transfers\n• Cash on Delivery (COD)\n\nAll payments are secure and encrypted!'
    },
    {
      question: 'How do I track my order?',
      answer: '📦 Track your order easily:\n\n1. Go to "My Account"\n2. Click "My Orders"\n3. Find your order and click "Track Delivery"\n4. View real-time tracking status\n\nYou\'ll also receive SMS updates when your order ships!'
    },
    {
      question: 'What\'s your return policy?',
      answer: '🔄 Our return policy:\n\n• 7 days to return from delivery date\n• Product must be unused and in original condition\n• Click "Return Item" in your orders\n• Free return pickup at your location\n• Refund within 3-5 business days\n\nFor damaged items, return within 24 hours!'
    },
    {
      question: 'Do you offer free shipping?',
      answer: '🚚 Free shipping details:\n\n• Free shipping on orders above ₹999\n• Express delivery available (charges apply)\n• Delivery to most cities across India\n\nUse code "FREESHIP" for free shipping on qualifying orders!'
    },
    {
      question: 'How can I contact customer support?',
      answer: '📞 Reach our support team:\n\n• Chat with us here (24/7)\n• Email: support@cartverse.com\n• Phone: +91-9999-XXX-XXX\n• WhatsApp support available\n• Response time: Usually within 2 hours'
    },
    {
      question: 'Is there a loyalty program?',
      answer: '⭐ Yes! CartVerse Rewards:\n\n• Earn points on every purchase\n• 1 point = ₹1 (approximately)\n• Redeem points for discounts\n• Exclusive member-only deals\n• Birthday bonuses\n\nJoin now and start earning!'
    },
    {
      question: 'How do I apply a coupon code?',
      answer: '🎟️ Using coupon codes:\n\n1. Add items to bag\n2. Go to checkout\n3. Look for "Apply Coupon" field\n4. Enter code and click Apply\n5. Discount applies instantly\n\nCheck our promotions section for active codes!'
    }
  ];

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // -------------------------------------------------------------
  // MOVABLE / DRAGGABLE BUTTON LOGIC (Desktop + Mobile Touch)
  // Button is right-anchored by default so it's always fully visible
  // -------------------------------------------------------------
  const BTN_SIZE = 60; // button diameter + padding
  const getDefaultPos = () => ({
    x: window.innerWidth - BTN_SIZE - 20,
    y: window.innerHeight - BTN_SIZE - 90
  });
  const [btnPos, setBtnPos] = useState(getDefaultPos);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });
  const hasMovedRef = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      setBtnPos(prev => ({
        x: Math.min(prev.x, window.innerWidth - BTN_SIZE - 10),
        y: Math.min(prev.y, window.innerHeight - BTN_SIZE - 10)
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

    const newX = Math.max(10, Math.min(window.innerWidth - BTN_SIZE - 10, dragStartRef.current.initialX + deltaX));
    const newY = Math.max(60, Math.min(window.innerHeight - BTN_SIZE - 10, dragStartRef.current.initialY + deltaY));

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
      let faqResponse = null;
      const lowerQuery = query.toLowerCase();

      // Help & Support Handler
      if (lowerQuery.includes('help') || lowerQuery.includes('support') || lowerQuery.includes('faq') || lowerQuery.includes('question') || lowerQuery === '❓ help & support') {
        replyText = `🆘 Welcome to CartVerse Help & Support!\n\nI can help you with common questions. Click on any topic below:`;
        faqResponse = {
          type: 'faq_menu',
          faqs: faqDatabase.slice(0, 4)
        };
      } else if (lowerQuery.includes('order') && lowerQuery.includes('how')) {
        const faq = faqDatabase.find(f => f.question.toLowerCase().includes('place'));
        replyText = faq ? faq.answer : 'How to place an order? Let me show you the steps...';
      } else if (lowerQuery.includes('payment')) {
        const faq = faqDatabase.find(f => f.question.toLowerCase().includes('payment'));
        replyText = faq ? faq.answer : 'We accept multiple payment methods for your convenience.';
      } else if (lowerQuery.includes('track')) {
        const faq = faqDatabase.find(f => f.question.toLowerCase().includes('track'));
        replyText = faq ? faq.answer : 'You can track your order from your account dashboard.';
      } else if (lowerQuery.includes('return') || lowerQuery.includes('refund')) {
        const faq = faqDatabase.find(f => f.question.toLowerCase().includes('return'));
        replyText = faq ? faq.answer : 'Our return process is simple and customer-friendly.';
      } else if (lowerQuery.includes('ship') || lowerQuery.includes('delivery')) {
        const faq = faqDatabase.find(f => f.question.toLowerCase().includes('shipping'));
        replyText = faq ? faq.answer : 'We offer fast and reliable shipping across India.';
      } else if (lowerQuery.includes('contact') || lowerQuery.includes('customer')) {
        const faq = faqDatabase.find(f => f.question.toLowerCase().includes('contact'));
        replyText = faq ? faq.answer : 'Our support team is ready to help you 24/7!';
      } else if (lowerQuery.includes('reward') || lowerQuery.includes('loyalty')) {
        const faq = faqDatabase.find(f => f.question.toLowerCase().includes('loyalty'));
        replyText = faq ? faq.answer : 'Join our rewards program and earn points on every purchase!';
      } else if (lowerQuery.includes('coupon') || lowerQuery.includes('code')) {
        const faq = faqDatabase.find(f => f.question.toLowerCase().includes('coupon'));
        replyText = faq ? faq.answer : 'Use coupon codes at checkout to get instant discounts!';
      } else if (lowerQuery.includes('tech') || lowerQuery.includes('headphone') || lowerQuery.includes('projector') || lowerQuery.includes('keyboard') || lowerQuery.includes('laptop') || lowerQuery.includes('computer')) {
        recommendedProducts = products.filter(p => p.category === 'electronics');
        replyText = `🎮 Nice! Here are some awesome tech gadgets and audio gear I think you'll love:`;
      } else if (lowerQuery.includes('shoe') || lowerQuery.includes('footwear') || lowerQuery.includes('runner') || lowerQuery.includes('sneaker') || lowerQuery.includes('boot')) {
        recommendedProducts = products.filter(p => p.category === 'footwear');
        replyText = `👟 Perfect! Check out these amazing shoes. Perfect for any occasion:`;
      } else if (lowerQuery.includes('cloth') || lowerQuery.includes('fashion') || lowerQuery.includes('hoodie') || lowerQuery.includes('shirt') || lowerQuery.includes('dress')) {
        recommendedProducts = products.filter(p => p.category === 'fashion');
        replyText = `👕 Great choice! Here's our latest fashion picks just for you:`;
      } else if (lowerQuery.includes('code') || lowerQuery.includes('coupon') || lowerQuery.includes('discount') || lowerQuery.includes('promo') || lowerQuery.includes('offer')) {
        replyText = `💰 Score! Here are the active discount codes right now:\n\n• **SAVE20** – 20% off on orders above ₹2,999\n• **WELCOME10** – 10% off your entire first purchase\n• **FREESHIP** – Free express shipping over ₹999\n• **FLAT500** – ₹500 instant discount on orders above ₹3,999\n\nLet me know if you need help applying a code!`;
      } else if (lowerQuery.includes('track') || lowerQuery.includes('order') || lowerQuery.includes('shipping') || lowerQuery.includes('status')) {
        if (orders.length > 0) {
          const latestOrder = orders[0];
          replyText = `📦 Here's your latest order:\n\n**Order #${latestOrder.id}**\nStatus: ${latestOrder.status}\nCarrier: ${latestOrder.carrier || 'Processing'}\n\nFull tracking details are in your Account Dashboard!`;
        } else {
          replyText = `📭 You haven't placed any orders yet! Browse our collection and place your first order today. I'm here to help!`;
        }
      } else if (lowerQuery.includes('trending') || lowerQuery.includes('popular') || lowerQuery.includes('best seller') || lowerQuery.includes('new')) {
        recommendedProducts = products.filter(p => p.featured || p.bestSeller).slice(0, 4);
        replyText = `🔥 Here's what's trending right now on CartVerse:`;
      } else if (lowerQuery.includes('find') || lowerQuery.includes('search') || lowerQuery.includes('looking for')) {
        recommendedProducts = products.slice(0, 4);
        replyText = `🔍 Let me show you some great options! If you want something specific, just ask me directly (like "shoes under 2000" or "gaming laptops").`;
      } else {
        recommendedProducts = products.filter(p => p.featured).slice(0, 3);
        replyText = `✨ Here are some amazing products you might love! Browse through and let me know if anything catches your eye:`;
      }

      const aiMsg = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: replyText,
        recommendedProducts: recommendedProducts.length > 0 ? recommendedProducts : undefined,
        faqResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: faqResponse ? [] : [
          '💰 Show me deals',
          '📦 Help with order',
          '🎁 What\'s trending'
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
                <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>CartVerse AI Assistant</div>
                <div style={{ fontSize: '0.72rem', opacity: 0.85, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
                  Always here to help 🎉
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

                {/* FAQ Menu */}
                {msg.faqResponse?.type === 'faq_menu' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                    {msg.faqResponse.faqs.map((faq, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(faq.question)}
                        style={{
                          textAlign: 'left',
                          padding: '10px 12px',
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--primary)';
                          e.currentTarget.style.background = 'var(--bg-card-solid)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border-subtle)';
                          e.currentTarget.style.background = 'var(--bg-surface)';
                        }}
                      >
                        ❓ {faq.question}
                      </button>
                    ))}
                    <button
                      onClick={() => handleSendMessage('Show more FAQ')}
                      style={{
                        textAlign: 'center',
                        padding: '8px 12px',
                        background: 'var(--primary-gradient)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      📚 View More FAQs
                    </button>
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
              placeholder="Ask me anything... (e.g., 'shoes under 3000' or 'track order')"
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
