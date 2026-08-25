import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Sparkles, ArrowRight, Shield, Truck, RotateCcw, Headphones, Flame, Clock } from 'lucide-react';

export const HeroBanner = () => {
  const { setSelectedCategory, setActiveProductId, setIsAiAssistantOpen } = useShop();

  const slides = [
    {
      id: 'slide-1',
      badge: 'SPRING / SUMMER 2026',
      title: 'Acoustic Mastery Meets Futuristic Design',
      subtitle: 'Experience soundscapes with hybrid active noise cancellation, custom beryllium drivers & 45-hour battery reserve.',
      cta: 'Explore SoundPro',
      category: 'electronics',
      productId: 'prod-1',
      bgGradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(236, 72, 153, 0.15) 100%)',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
      tag: '🔥 33% Off Flash Deal'
    },
    {
      id: 'slide-2',
      badge: 'LIMITED RUN ACCESSORIES',
      title: 'Aerospace Grade Titanium Smartwatch',
      subtitle: 'Always-on Sapphire AMOLED display, dual GPS navigation, ECG heart analytics and 14-day battery longevity.',
      cta: 'Discover Lumina',
      category: 'accessories',
      productId: 'prod-2',
      bgGradient: 'linear-gradient(135deg, rgba(14, 165, 233, 0.25) 0%, rgba(99, 102, 241, 0.15) 100%)',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
      tag: '⚡ New Arrival'
    },
    {
      id: 'slide-3',
      badge: 'PRO ATHLETIC GEAR',
      title: 'Carbon-Plated Marathon Propulsion',
      subtitle: 'Engineered with nitrogen-infused foam and 3K carbon flight plates for maximum kinetic energy return.',
      cta: 'Shop Velocity Aero',
      category: 'footwear',
      productId: 'prod-4',
      bgGradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(245, 158, 11, 0.15) 100%)',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
      tag: '⭐ Best Seller'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto rotate carousel every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Flash Sale Countdown simulation
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 8, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div style={{ marginTop: '20px', marginBottom: '32px' }}>
      <div className="container">
        {/* Main Hero Card */}
        <div
          className="glass-panel"
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            background: slide.bgGradient,
            boxShadow: 'var(--shadow-lg)',
            transition: 'background 0.8s ease'
          }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            alignItems: 'center',
            padding: '48px 40px',
            gap: '36px',
            position: 'relative',
            zIndex: 2
          }}>
            {/* Left Content */}
            <div className="animate-fade-in" key={slide.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <span className="badge badge-primary">{slide.badge}</span>
                <span className="badge badge-gold">{slide.tag}</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                fontWeight: 900,
                lineHeight: 1.15,
                marginBottom: '16px',
                color: 'var(--text-primary)',
                letterSpacing: '-0.03em'
              }}>
                {slide.title}
              </h1>

              <p style={{
                fontSize: '1.05rem',
                color: 'var(--text-secondary)',
                marginBottom: '28px',
                maxWidth: '520px',
                lineHeight: 1.6
              }}>
                {slide.subtitle}
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
                <button
                  onClick={() => setActiveProductId(slide.productId)}
                  className="btn btn-primary btn-lg"
                  style={{ gap: '10px' }}
                >
                  <span>{slide.cta}</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  onClick={() => setIsAiAssistantOpen(true)}
                  className="btn btn-secondary btn-lg"
                  style={{ gap: '8px' }}
                >
                  <Sparkles size={18} style={{ color: 'var(--primary)' }} />
                  <span>Ask AI Stylist</span>
                </button>
              </div>

              {/* Flash Deal Timer Pill */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                marginTop: '28px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-card-solid)',
                border: '1px solid var(--border-subtle)'
              }}>
                <Flame size={18} style={{ color: '#f59e0b' }} />
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Deals end in:
                </span>
                <div style={{
                  display: 'flex',
                  gap: '6px',
                  fontFamily: 'monospace',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  color: 'var(--text-primary)'
                }}>
                  <span style={{ background: 'var(--bg-surface)', padding: '2px 6px', borderRadius: '4px' }}>
                    {String(timeLeft.hours).padStart(2, '0')}h
                  </span>
                  :
                  <span style={{ background: 'var(--bg-surface)', padding: '2px 6px', borderRadius: '4px' }}>
                    {String(timeLeft.minutes).padStart(2, '0')}m
                  </span>
                  :
                  <span style={{ background: 'var(--bg-surface)', padding: '2px 6px', borderRadius: '4px' }}>
                    {String(timeLeft.seconds).padStart(2, '0')}s
                  </span>
                </div>
              </div>
            </div>

            {/* Right Media */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative'
            }}>
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '440px',
                aspectRatio: '1/1',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-glow)',
                border: '1px solid var(--border-highlight)'
              }}>
                <img
                  src={slide.image}
                  alt={slide.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
            </div>
          </div>

          {/* Carousel Dots */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
            zIndex: 10
          }}>
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                style={{
                  width: currentSlide === idx ? '28px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: currentSlide === idx ? 'var(--primary)' : 'rgba(255, 255, 255, 0.25)',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>

        {/* Value Propositions / Trust Badges Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginTop: '20px'
        }}>
          {[
            { icon: Truck, title: 'Express Delivery', desc: 'Free express delivery over ₹999' },
            { icon: Shield, title: '100% Authentic Guarantee', desc: 'Direct from verified craft houses' },
            { icon: RotateCcw, title: '30-Day Hassle-Free Returns', desc: 'Instant doorstep pickups' },
            { icon: Headphones, title: '24/7 VIP Concierge', desc: 'Dedicated client support' }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-md)',
                  transition: 'var(--transition-fast)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
