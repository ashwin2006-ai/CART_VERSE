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
          minHeight: '220px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '28px 20px 28px 24px',
          gap: '16px',
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
            borderRadius: '100px', padding: '4px 12px',
            marginBottom: '12px',
          }}>
            <span style={{
              fontSize: '0.7rem', fontWeight: 800, color: slide.accent,
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              {slide.badge}
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(1.3rem, 5vw, 2rem)',
            fontWeight: 900, color: '#ffffff',
            lineHeight: 1.2, marginBottom: '8px',
            letterSpacing: '-0.02em',
            fontFamily: "'Inter', sans-serif",
          }}>
            {slide.title}
          </h1>

          <p style={{
            fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)',
            marginBottom: '18px', lineHeight: 1.5,
          }}>
            {slide.sub}
          </p>

          <button
            onClick={() => setSelectedCategory(slide.category)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: slide.accent,
              color: '#fff', borderRadius: '10px',
              padding: '10px 20px', fontSize: '0.84rem', fontWeight: 700,
              boxShadow: `0 6px 20px ${slide.accent}50`,
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            {slide.cta} <ArrowRight size={15} />
          </button>
        </div>

        {/* Right: Product image */}
        <div style={{
          flexShrink: 0, width: '130px', height: '130px',
          borderRadius: '16px', overflow: 'hidden',
          boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
          border: '2px solid rgba(255,255,255,0.1)',
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
            position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)',
            borderRadius: '50%', width: '30px', height: '30px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', zIndex: 2,
          }}
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => goTo((cur + 1) % SLIDES.length)}
          style={{
            position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)',
            borderRadius: '50%', width: '30px', height: '30px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', zIndex: 2,
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Dot indicators */}
      <div style={{
        position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: '6px', zIndex: 2,
      }}>
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            style={{
              width: i === cur ? '20px' : '6px', height: '6px',
              borderRadius: '100px',
              background: i === cur ? '#fff' : 'rgba(255,255,255,0.4)',
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0.4; transform: scale(1.05); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
};
