import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Star, Sparkles } from 'lucide-react';

export const ReviewModal = () => {
  const { reviewProductId, setReviewProductId, products, addReview, user } = useShop();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState(user.name || '');

  if (!reviewProductId) return null;

  const product = products.find(p => p.id === reviewProductId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    addReview(reviewProductId, {
      userName: name.trim() || 'Verified Customer',
      rating,
      comment: comment.trim()
    });

    setReviewProductId(null);
    setComment('');
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
        backdropFilter: 'blur(10px)',
        zIndex: 2500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={() => setReviewProductId(null)}
    >
      <div
        className="glass-panel animate-scale-in"
        style={{
          background: 'var(--bg-card-solid)',
          width: '100%',
          maxWidth: '520px',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          border: '1px solid var(--border-highlight)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setReviewProductId(null)}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sparkles size={18} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Write a Review</h2>
        </div>

        {product && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 14px',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px'
          }}>
            <img src={product.images[0]} alt={product.name} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {product.name}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Star Selector */}
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px' }}>
              Your Overall Rating
            </label>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{ padding: '4px', cursor: 'pointer' }}
                >
                  <Star
                    size={32}
                    fill={(hoverRating || rating) >= star ? '#f59e0b' : 'none'}
                    color={(hoverRating || rating) >= star ? '#f59e0b' : '#64748b'}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Reviewer Name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
              Your Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Mercer"
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem'
              }}
            />
          </div>

          {/* Comment */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
              Detailed Experience & Feedback
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you love about the build quality, sound, materials, or delivery speed?"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                resize: 'none'
              }}
            />
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={() => setReviewProductId(null)}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1.5 }}
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
