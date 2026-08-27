import React, { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient.js';
import '../styles/AdminReviewPanel.css';

export default function AdminReviewPanel() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const fetchPendingReviews = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getPendingReviews(page, 20);
      if (response.success) {
        setReviews(response.reviews || []);
        setPagination(response.pagination || {});
      }
    } catch (error) {
      console.error('Error fetching pending reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingReviews();
  }, [page]);

  const handleApprove = async (reviewId) => {
    try {
      await apiClient.verifyReview(reviewId, true);
      setReviews(reviews.filter((r) => r.id !== reviewId));
    } catch (error) {
      console.error('Error approving review:', error);
    }
  };

  const handleReject = async (reviewId) => {
    try {
      await apiClient.verifyReview(reviewId, false);
      setReviews(reviews.filter((r) => r.id !== reviewId));
    } catch (error) {
      console.error('Error rejecting review:', error);
    }
  };

  const handleReply = async (productId, reviewId) => {
    if (!replyText.trim()) return;

    try {
      await apiClient.replyToReview(productId, reviewId, replyText);
      setReplyingTo(null);
      setReplyText('');
      fetchPendingReviews();
    } catch (error) {
      console.error('Error replying to review:', error);
    }
  };

  const RenderStars = ({ rating }) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`star ${star <= rating ? 'filled' : ''}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading pending reviews...</div>;
  }

  return (
    <div className="admin-review-panel">
      <h2>Review Management</h2>
      <p className="subtitle">
        Pending Reviews: {pagination.total || 0}
      </p>

      {reviews.length > 0 ? (
        <>
          <div className="reviews-grid">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="card-header">
                  <div className="reviewer-info">
                    <div className="reviewer-name">{review.userName}</div>
                    <RenderStars rating={review.rating} />
                  </div>
                  <div className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="card-body">
                  <div className="product-info">
                    Product: <strong>{review.product?.name}</strong>
                  </div>

                  {review.title && (
                    <div className="review-title">{review.title}</div>
                  )}

                  <div className="review-text">{review.comment}</div>

                  {review.purchased && (
                    <div className="badge verified">✓ Verified Purchase</div>
                  )}
                </div>

                <div className="card-actions">
                  <button
                    className="btn-approve"
                    onClick={() => handleApprove(review.id)}
                  >
                    ✓ Approve
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => handleReject(review.id)}
                  >
                    ✕ Reject
                  </button>
                  <button
                    className="btn-reply"
                    onClick={() => setReplyingTo(review.id)}
                  >
                    Reply
                  </button>
                </div>

                {replyingTo === review.id && (
                  <div className="reply-section">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write your reply to this review..."
                      rows={3}
                      maxLength={500}
                    />
                    <div className="reply-actions">
                      <button
                        className="btn-send"
                        onClick={() => handleReply(review.productId, review.id)}
                        disabled={!replyText.trim()}
                      >
                        Send Reply
                      </button>
                      <button
                        className="btn-cancel"
                        onClick={() => setReplyingTo(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                ← Previous
              </button>
              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                disabled={page === pagination.totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <p>No pending reviews. All reviews have been processed!</p>
        </div>
      )}
    </div>
  );
}
