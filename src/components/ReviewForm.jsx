import React, { useState } from 'react';
import apiClient from '../utils/apiClient.js';
import '../styles/ReviewForm.css';

export default function ReviewForm({ productId, onReviewAdded, onClose }) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim()) {
      setError('Please enter a review title');
      return;
    }

    if (!comment.trim()) {
      setError('Please enter a review comment');
      return;
    }

    if (comment.trim().length < 10) {
      setError('Review must be at least 10 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.addProductReview(productId, {
        rating,
        title: title.trim(),
        comment: comment.trim(),
        purchased: true
      });

      if (response.success) {
        setSuccess('Review submitted successfully!');
        setTitle('');
        setComment('');
        setRating(5);

        setTimeout(() => {
          if (onReviewAdded) onReviewAdded();
          if (onClose) onClose();
        }, 1500);
      } else {
        setError(response.message || 'Failed to submit review');
      }
    } catch (err) {
      setError('Error submitting review: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form-container">
      <h3>Write a Review</h3>

      <form onSubmit={handleSubmit}>
        {/* Rating */}
        <div className="form-group">
          <label htmlFor="rating">Rating</label>
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map((r) => (
              <button
                key={r}
                type="button"
                className={`star-btn ${rating >= r ? 'active' : ''}`}
                onClick={() => setRating(r)}
                title={`Rate ${r} stars`}
              >
                ★
              </button>
            ))}
          </div>
          <span className="rating-value">{rating} out of 5 stars</span>
        </div>

        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Review Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience"
            maxLength={100}
            disabled={loading}
          />
          <small>{title.length}/100</small>
        </div>

        {/* Comment */}
        <div className="form-group">
          <label htmlFor="comment">Review Comment</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your detailed experience with this product"
            rows={6}
            maxLength={1000}
            disabled={loading}
          />
          <small>{comment.length}/1000</small>
        </div>

        {/* Messages */}
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Buttons */}
        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
