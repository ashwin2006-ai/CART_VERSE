import React, { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient.js';
import '../styles/ReviewList.css';

export default function ReviewList({ productId, refreshTrigger = 0 }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('recent');
  const [pagination, setPagination] = useState({});

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getProductReviews(
        productId,
        page,
        10,
        sort
      );

      if (response.success) {
        setReviews(response.reviews || []);
        setStats(response.stats || {});
        setPagination(response.pagination || {});
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, page, sort, refreshTrigger]);

  const handleMarkHelpful = async (reviewId, helpful) => {
    try {
      await apiClient.markReviewHelpful(productId, reviewId, helpful);
      fetchReviews();
    } catch (error) {
      console.error('Error marking review:', error);
    }
  };

  const RenderStars = ({ rating, size = 'small' }) => {
    return (
      <div className={`stars ${size}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`star ${star <= rating ? 'filled' : ''}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const RatingBreakdown = () => {
    if (!stats.breakdown) return null;

    return (
      <div className="rating-breakdown">
        <div className="avg-rating">
          <div className="big-rating">{stats.avgRating || 0}</div>
          <div className="out-of">out of 5</div>
          <RenderStars rating={Math.round(stats.avgRating || 0)} size="large" />
          <div className="total-reviews">
            {stats.totalReviews || 0} reviews
          </div>
        </div>

        <div className="breakdown-bars">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="breakdown-row">
              <span className="rating-label">{rating} ★</span>
              <div className="bar-container">
                <div
                  className="bar-fill"
                  style={{
                    width: `${
                      stats.totalReviews > 0
                        ? (stats.breakdown[rating] / stats.totalReviews) * 100
                        : 0
                    }%`
                  }}
                />
              </div>
              <span className="count">
                {stats.breakdown[rating] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading && reviews.length === 0) {
    return <div className="loading">Loading reviews...</div>;
  }

  return (
    <div className="review-list-container">
      {/* Rating Summary */}
      <div className="reviews-section">
        <h3>Customer Reviews</h3>
        <RatingBreakdown />

        {/* Sort Options */}
        <div className="sort-section">
          <label htmlFor="sort">Sort by:</label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
          >
            <option value="recent">Most Recent</option>
            <option value="rating-high">Highest Rating</option>
            <option value="rating-low">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>

        {/* Reviews List */}
        <div className="reviews-list">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      {review.avatar ? (
                        <img src={review.avatar} alt={review.userName} />
                      ) : (
                        <div className="avatar-placeholder">
                          {review.userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="reviewer-details">
                      <div className="reviewer-name">
                        {review.userName}
                        {review.verified && (
                          <span className="verified-badge">✓ Verified</span>
                        )}
                      </div>
                      <RenderStars rating={review.rating} />
                      <div className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                {review.title && (
                  <div className="review-title">{review.title}</div>
                )}

                <div className="review-comment">{review.comment}</div>

                {review.adminReply && (
                  <div className="admin-reply">
                    <div className="admin-label">Seller Response</div>
                    <div className="reply-text">{review.adminReply}</div>
                  </div>
                )}

                <div className="review-footer">
                  <div className="helpful-section">
                    <span className="helpful-label">Was this helpful?</span>
                    <button
                      className="helpful-btn"
                      onClick={() => handleMarkHelpful(review.id, true)}
                    >
                      👍 Helpful ({review.helpful || 0})
                    </button>
                    <button
                      className="helpful-btn"
                      onClick={() => handleMarkHelpful(review.id, false)}
                    >
                      👎 Not Helpful ({review.unhelpful || 0})
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-reviews">
              <p>No reviews yet. Be the first to review this product!</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="pagination-btn"
            >
              ← Previous
            </button>

            <div className="page-info">
              Page {pagination.page} of {pagination.totalPages}
            </div>

            <button
              disabled={page === pagination.totalPages}
              onClick={() => setPage(page + 1)}
              className="pagination-btn"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
