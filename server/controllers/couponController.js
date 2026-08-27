import prisma from '../config/prisma.js';

/**
 * Validate and get coupon details
 * POST /api/coupons/validate
 * Body: { code, cartTotal }
 */
export const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }

    const coupon = await prisma.coupon.findFirst({
      where: {
        code: code.toUpperCase(),
        isActive: true
      }
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code' });
    }

    // Check expiration
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ success: false, message: 'Coupon has expired' });
    }

    // Check minimum cart value
    if (coupon.minCartValue && cartTotal < coupon.minCartValue) {
      return res.status(400).json({ 
        success: false, 
        message: `Minimum cart value of ₹${coupon.minCartValue} required` 
      });
    }

    // Check usage limit
    if (coupon.usageLimit) {
      const usageCount = await prisma.order.count({
        where: {
          couponId: coupon.id
        }
      });

      if (usageCount >= coupon.usageLimit) {
        return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
      }
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      }
    } else if (coupon.discountType === 'fixed') {
      discountAmount = coupon.discountValue;
    }

    const finalTotal = Math.max(0, cartTotal - discountAmount);

    return res.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        maxDiscount: coupon.maxDiscount
      },
      discount: parseFloat(discountAmount.toFixed(2)),
      finalTotal: parseFloat(finalTotal.toFixed(2))
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return res.status(500).json({ success: false, message: 'Failed to validate coupon', error: error.message });
  }
};

/**
 * Get active coupons (for display on frontend)
 * GET /api/coupons
 */
export const getActiveCoupons = async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({
      where: {
        isActive: true,
        expiresAt: {
          gt: new Date()
        }
      },
      select: {
        id: true,
        code: true,
        description: true,
        discountType: true,
        discountValue: true,
        maxDiscount: true,
        minCartValue: true,
        expiresAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.json({
      success: true,
      coupons,
      count: coupons.length
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch coupons', error: error.message });
  }
};

/**
 * Admin: Create coupon
 * POST /api/coupons
 * Body: { code, description, discountType, discountValue, maxDiscount, minCartValue, usageLimit, expiresAt }
 */
export const createCoupon = async (req, res) => {
  try {
    const { code, description, discountType, discountValue, maxDiscount, minCartValue, usageLimit, expiresAt } = req.body;

    if (!code || !discountType || !discountValue) {
      return res.status(400).json({ success: false, message: 'Code, discount type, and value are required' });
    }

    // Check if code already exists
    const existing = await prisma.coupon.findFirst({
      where: { code: code.toUpperCase() }
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists' });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        description: description || '',
        discountType,
        discountValue: Number(discountValue),
        maxDiscount: maxDiscount ? Number(maxDiscount) : null,
        minCartValue: minCartValue ? Number(minCartValue) : null,
        usageLimit: usageLimit ? Number(usageLimit) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: true
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Coupon created',
      coupon
    });
  } catch (error) {
    console.error('Error creating coupon:', error);
    return res.status(500).json({ success: false, message: 'Failed to create coupon', error: error.message });
  }
};

/**
 * Admin: Update coupon
 * PUT /api/coupons/:couponId
 */
export const updateCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
    const { description, discountValue, maxDiscount, minCartValue, usageLimit, expiresAt, isActive } = req.body;

    const updateData = {};
    if (description !== undefined) updateData.description = description;
    if (discountValue !== undefined) updateData.discountValue = Number(discountValue);
    if (maxDiscount !== undefined) updateData.maxDiscount = maxDiscount ? Number(maxDiscount) : null;
    if (minCartValue !== undefined) updateData.minCartValue = minCartValue ? Number(minCartValue) : null;
    if (usageLimit !== undefined) updateData.usageLimit = usageLimit ? Number(usageLimit) : null;
    if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;
    if (isActive !== undefined) updateData.isActive = isActive;

    const coupon = await prisma.coupon.update({
      where: { id: couponId },
      data: updateData
    });

    return res.json({
      success: true,
      message: 'Coupon updated',
      coupon
    });
  } catch (error) {
    console.error('Error updating coupon:', error);
    return res.status(500).json({ success: false, message: 'Failed to update coupon', error: error.message });
  }
};

/**
 * Admin: Delete coupon
 * DELETE /api/coupons/:couponId
 */
export const deleteCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;

    await prisma.coupon.delete({
      where: { id: couponId }
    });

    return res.json({
      success: true,
      message: 'Coupon deleted'
    });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete coupon', error: error.message });
  }
};
