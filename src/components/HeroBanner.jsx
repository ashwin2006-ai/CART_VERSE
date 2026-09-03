import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    category: 'electronics',
    title: 'Next-Gen Electronics',
    sub: 'Laptops · Tablets · Earbuds · Smart Devices',
    cta: 'Shop Electronics',
    badge: 'Up to 40% off',
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    accent: '#6C63FF',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    category: 'mobiles',
    title: 'Premium Smartphones',
    sub: 'iPhone · Samsung · OnePlus · Redmi',
    cta: 'Shop Mobiles',
    badge: 'No Cost EMI',
    bg: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #2d1b69 100%)',
    accent: '#a855f7',
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    category: 'fashion',
    title: 'Elevate Your Style',
    sub: 'Trending outfits for every occasion',
    cta: 'Shop Fashion',
    badge: 'Min 40% off',
    bg: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b69 50%, #4a1942 100%)',
    accent: '#ec4899',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 4,
    category: 'home',
    title: 'Beautiful Living Spaces',
    sub: 'Furniture · Decor · Kitchen · Appliances',
    cta: 'Shop Home',
    badge: 'Up to 35% off',
    bg: 'linear-gradient(135deg, #0a1628 0%, #1e3a5f 50%, #0d4f3c 100%)',
    accent: '#10b981',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80',
  },
];

export const HeroBanner = () => {
  const { setSelectedCategory } = useShop();
  const [cur, setCur] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = (idx) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCur(idx);
    setTimeout(() => setIsAnimating(false), 350);
  };

  useEffect(() => {
    const t = setInterval(() => goTo((cur + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, [cur]);

  const slide = SLIDES[cur];
  const isMobile = window.innerWidth < 768;
  const isUltraMobile = window.innerWidth < 480;
  const isExtraSmall = window.innerWidth < 360;

  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '0',
      margin: '0',
    }}>
      <div
        style={{
          background: slide.bg,
          transition: 'background 0.5s ease',
          minHeight: isExtraSmall ? '140px' : isUltraMobile ? '160px' : isMobile ? '180px' : '220px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isExtraSmall ? '12px 10px 12px 12px' : isUltraMobile ? '14px 12px 14px 14px' : isMobile ? '16px 14px 16px 16px' : '28px 20px 28px 24px',
          gap: isUltraMobile ? '8px' : isMobile ? '12px' : '16px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background grid decoration */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: `repeating-linear-gradient(0deg, #fff 0, #fff 1px, transparent 1px, transparent 40px),
            repeating-linear-gradient(90deg, #fff 0, #fff 1px, transparent 1px, transparent 40px)`,
          pointerEvents: 'none',
        }} />

        {/* Glow orb */}
        <div style={{
          position: 'absolute', right: '30%', top: '-30%',
          width: '300px', height: '300px', borderRadius: '50%',
          background: `radial-gradient(circle, ${slide.accent}40 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        {/* Left: Text content */}
        <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: `${slide.accent}25`,
            border: `1px solid ${slide.accent}50`,
            borderRadius: '100px', padding: isExtraSmall ? '2px 8px' : isUltraMobile ? '3px 10px' : '4px 12px',
            marginBottom: isUltraMobile ? '6px' : '12px',
          }}>
            <span style={{
              fontSize: isExtraSmall ? '0.55rem' : isUltraMobile ? '0.62rem' : '0.7rem',
              fontWeight: 800, color: slide.accent,
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              {slide.badge}
            </span>
          </div>

          <h1 style={{
            fontSize: isExtraSmall ? 'clamp(0.95rem, 4vw, 1.3rem)' : isUltraMobile ? 'clamp(1.1rem, 4.5vw, 1.6rem)' : 'clamp(1.3rem, 5vw, 2rem)',
            fontWeight: 900, color: '#ffffff',
            lineHeight: 1.2, marginBottom: isUltraMobile ? '4px' : '8px',
            letterSpacing: '-0.02em',
            fontFamily: "'Inter', sans-serif",
          }}>
            {slide.title}
          </h1>

          <p style={{
            fontSize: isExtraSmall ? '0.68rem' : isUltraMobile ? '0.74rem' : '0.82rem',
            color: 'rgba(255,255,255,0.65)',
            marginBottom: isUltraMobile ? '8px' : '18px',
            lineHeight: 1.4,
            display: isExtraSmall ? '-webkit-box' : 'block',
            WebkitLineClamp: isExtraSmall ? 1 : 'unset',
            WebkitBoxOrient: 'vertical',
            overflow: isExtraSmall ? 'hidden' : 'visible',
          }}>
            {slide.sub}
          </p>

          <button
            onClick={() => setSelectedCategory(slide.category)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              background: slide.accent,
              color: '#fff', borderRadius: '8px',
              padding: isExtraSmall ? '6px 12px' : isUltraMobile ? '8px 14px' : '10px 20px',
              fontSize: isExtraSmall ? '0.7rem' : isUltraMobile ? '0.76rem' : '0.84rem',
              fontWeight: 700,
              boxShadow: `0 6px 20px ${slide.accent}50`,
              transition: 'transform 0.15s, box-shadow 0.15s',
              minHeight: '32px',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            {slide.cta} <ArrowRight size={isExtraSmall ? 12 : 15} />
          </button>
        </div>

        {/* Right: Product image */}
        <div style={{
          flexShrink: 0, 
          width: isExtraSmall ? '80px' : isUltraMobile ? '100px' : isMobile ? '110px' : '130px',
          height: isExtraSmall ? '80px' : isUltraMobile ? '100px' : isMobile ? '110px' : '130px',
          borderRadius: isExtraSmall ? '10px' : '16px',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          border: '1.5px solid rgba(255,255,255,0.1)',
          position: 'relative', zIndex: 1,
        }}>
          <img
            key={slide.id}
            src={slide.image}
            alt={slide.title}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              animation: 'fadeIn 0.4s ease',
            }}
          />
        </div>

        {/* Prev/Next arrows */}
        <button
          onClick={() => goTo((cur - 1 + SLIDES.length) % SLIDES.length)}
          style={{
            position: 'absolute', left: '6px', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)',
            borderRadius: '50%',
            width: isUltraMobile ? '36px' : '40px',
            height: isUltraMobile ? '36px' : '40px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', zIndex: 2,
            border: '1px solid rgba(255,255,255,0.2)',
            transition: 'all 0.2s',
            opacity: isMobile ? 0.7 : 1,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
        >
          <ChevronLeft size={isUltraMobile ? 14 : 18} />
        </button>
        <button
          onClick={() => goTo((cur + 1) % SLIDES.length)}
          style={{
            position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)',
            borderRadius: '50%',
            width: isUltraMobile ? '36px' : '40px',
            height: isUltraMobile ? '36px' : '40px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', zIndex: 2,
            border: '1px solid rgba(255,255,255,0.2)',
            transition: 'all 0.2s',
            opacity: isMobile ? 0.7 : 1,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
        >
          <ChevronRight size={isUltraMobile ? 14 : 18} />
        </button>
      </div>

      {/* Dot indicators */}
      <div style={{
        position: 'absolute', bottom: isUltraMobile ? '8px' : '12px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: isUltraMobile ? '4px' : '6px', zIndex: 2,
      }}>
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            style={{
              width: i === cur ? (isUltraMobile ? '14px' : '20px') : '5px',
              height: '5px',
              borderRadius: '100px',
              background: i === cur ? '#fff' : 'rgba(255,255,255,0.4)',
              transition: 'all 0.3s',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          />
        ))}
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0.4; transform: scale(1.05); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
};
