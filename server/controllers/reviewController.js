import prisma from '../config/prisma.js';

/**
 * Add review to product
 * POST /api/products/:productId/reviews
 */
export const addReview = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.params;
    const { rating, title, comment, purchased = false } = req.body;

    // Validate input
    if (!rating || !comment || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        message: 'Rating (1-5) and comment are required' 
      });
    }

    // Check product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Get user info for review
    const user = userId ? await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, avatar: true }
    }) : null;

    // Create review
    const review = await prisma.review.create({
      data: {
        productId,
        userId: userId || null,
        userName: user?.name || 'Anonymous',
        avatar: user?.avatar || null,
        rating: parseInt(rating),
        title: title || '',
        comment,
        verified: userId ? true : false,
        purchased
      }
    });

    // Update product rating
    const reviews = await prisma.review.findMany({
      where: { productId }
    });

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: parseFloat(avgRating.toFixed(1)),
        reviewCount: reviews.length
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review: {
        id: review.id,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        userName: review.userName,
        verified: review.verified,
        createdAt: review.createdAt
      }
    });
  } catch (error) {
    console.error('Error adding review:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to add review', 
      error: error.message 
    });
  }
};

/**
 * Get product reviews with pagination
 * GET /api/products/:productId/reviews?page=1&limit=10&sort=recent
 */
export const getReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = 'recent' } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Get total count
    const total = await prisma.review.count({
      where: { productId }
    });

    // Sort options
    let orderBy = { createdAt: 'desc' };
    if (sort === 'rating-high') orderBy = { rating: 'desc' };
    if (sort === 'rating-low') orderBy = { rating: 'asc' };
    if (sort === 'helpful') orderBy = { helpful: 'desc' };

    // Get reviews
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: { select: { id: true, avatar: true } }
      },
      skip,
      take: limitNum,
      orderBy
    });

    // Get rating breakdown
    const allReviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true }
    });

    const breakdown = {
      5: allReviews.filter(r => r.rating === 5).length,
      4: allReviews.filter(r => r.rating === 4).length,
      3: allReviews.filter(r => r.rating === 3).length,
      2: allReviews.filter(r => r.rating === 2).length,
      1: allReviews.filter(r => r.rating === 1).length
    };

    const avgRating = allReviews.length > 0
      ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
      : 0;

    return res.json({
      success: true,
      reviews: reviews.map(r => ({
        id: r.id,
        userName: r.userName,
        avatar: r.avatar,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        verified: r.verified,
        helpful: r.helpful,
        unhelpful: r.unhelpful,
        adminReply: r.adminReply,
        createdAt: r.createdAt
      })),
      stats: {
        avgRating: parseFloat(avgRating),
        totalReviews: total,
        breakdown
      },
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch reviews', 
      error: error.message 
    });
  }
};

/**
 * Update review (own reviews only)
 * PUT /api/products/:productId/reviews/:reviewId
 */
export const updateReview = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { productId, reviewId } = req.params;
    const { rating, title, comment } = req.body;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    // Find review
    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!review) {
      return res.status(404).json({ 
        success: false, 
        message: 'Review not found' 
      });
    }

    // Check ownership
    if (review.userId !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only edit your own reviews' 
      });
    }

    // Update review
    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: rating || review.rating,
        title: title !== undefined ? title : review.title,
        comment: comment || review.comment
      }
    });

    // Recalculate product rating
    const reviews = await prisma.review.findMany({
      where: { productId }
    });

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: parseFloat(avgRating.toFixed(1))
      }
    });

    return res.json({
      success: true,
      message: 'Review updated successfully',
      review: updated
    });
  } catch (error) {
    console.error('Error updating review:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to update review', 
      error: error.message 
    });
  }
};

/**
 * Delete review (own reviews or admin only)
 * DELETE /api/products/:productId/reviews/:reviewId
 */
export const deleteReview = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { productId, reviewId } = req.params;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    // Find review
    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!review) {
      return res.status(404).json({ 
        success: false, 
        message: 'Review not found' 
      });
    }

    // Check ownership or admin
    const isOwner = review.userId === userId;
    const isAdmin = req.user?.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to delete this review' 
      });
    }

    // Delete review
    await prisma.review.delete({
      where: { id: reviewId }
    });

    // Recalculate product rating
    const reviews = await prisma.review.findMany({
      where: { productId }
    });

    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await prisma.product.update({
        where: { id: productId },
        data: {
          rating: parseFloat(avgRating.toFixed(1)),
          reviewCount: reviews.length
        }
      });
    }

    return res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to delete review', 
      error: error.message 
    });
  }
};

/**
 * Mark review as helpful (anonymous)
 * POST /api/products/:productId/reviews/:reviewId/helpful
 */
export const markHelpful = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const { helpful = true } = req.body;

    // Find and update review
    const review = await prisma.review.update({
      where: { id: reviewId },
      data: {
        helpful: helpful ? { increment: 1 } : review.helpful,
        unhelpful: !helpful ? { increment: 1 } : review.unhelpful
      }
    });

    return res.json({
      success: true,
      message: helpful ? 'Marked as helpful' : 'Marked as unhelpful',
      helpful: review.helpful,
      unhelpful: review.unhelpful
    });
  } catch (error) {
    console.error('Error marking review:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to mark review', 
      error: error.message 
    });
  }
};

/**
 * Admin: Reply to review
 * POST /api/products/:productId/reviews/:reviewId/reply
 */
export const adminReplyReview = async (req, res) => {
  try {
    const { adminOnly } = req.user?.role !== 'ADMIN' 
      ? { adminOnly: true } 
      : { adminOnly: false };

    if (adminOnly) {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin only' 
      });
    }

    const { reviewId } = req.params;
    const { reply } = req.body;

    if (!reply || reply.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Reply text is required' 
      });
    }

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { adminReply: reply }
    });

    return res.json({
      success: true,
      message: 'Reply added successfully',
      review: updated
    });
  } catch (error) {
    console.error('Error replying to review:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to add reply', 
      error: error.message 
    });
  }
};

/**
 * Admin: Get reviews for approval
 * GET /api/admin/reviews/pending
 */
export const getPendingReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { verified: false },
        include: { product: { select: { name: true } } },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'asc' }
      }),
      prisma.review.count({ where: { verified: false } })
    ]);

    return res.json({
      success: true,
      reviews,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching pending reviews:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch pending reviews', 
      error: error.message 
    });
  }
};

/**
 * Admin: Approve/reject review
 * PUT /api/admin/reviews/:reviewId/verify
 */
export const verifyReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { verified = true } = req.body;

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { verified }
    });

    return res.json({
      success: true,
      message: verified ? 'Review approved' : 'Review rejected',
      review: updated
    });
  } catch (error) {
    console.error('Error verifying review:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to verify review', 
      error: error.message 
    });
  }
};
