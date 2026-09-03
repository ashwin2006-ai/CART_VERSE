/**
 * API Client Utility for CartVerse
 * Handles all backend API calls with token management, error handling, and request/response interceptors
 */

class APIClient {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_PROXY_TARGET || 'http://localhost:5000';
    this.tokenKey = 'cartverse_token';
    this.userKey = 'aura_user';
  }

  /**
   * Get stored JWT token
   */
  getToken() {
    try {
      return typeof window !== 'undefined' ? localStorage.getItem(this.tokenKey) : null;
    } catch {
      return null;
    }
  }

  /**
   * Set JWT token in storage
   */
  setToken(token) {
    try {
      if (typeof window !== 'undefined' && token) {
        localStorage.setItem(this.tokenKey, token);
      }
    } catch (e) {
      console.warn('Failed to store token:', e);
    }
  }

  /**
   * Clear token from storage
   */
  clearToken() {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
      }
    } catch (e) {
      console.warn('Failed to clear token:', e);
    }
  }

  /**
   * Get stored user object
   */
  getStoredUser() {
    try {
      const user = typeof window !== 'undefined' ? localStorage.getItem(this.userKey) : null;
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  /**
   * Set user object in storage
   */
  setStoredUser(user) {
    try {
      if (typeof window !== 'undefined' && user) {
        localStorage.setItem(this.userKey, JSON.stringify(user));
      }
    } catch (e) {
      console.warn('Failed to store user:', e);
    }
  }

  /**
   * Build headers with auth token
   */
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Parse response and handle errors
   */
  async parseResponse(response) {
    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      let errorData;
      if (contentType?.includes('application/json')) {
        errorData = await response.json();
      } else {
        errorData = { message: await response.text() };
      }

      throw {
        status: response.status,
        message: errorData.message || `HTTP ${response.status}`,
        data: errorData
      };
    }

    if (contentType?.includes('application/json')) {
      return await response.json();
    }

    return response.text();
  }

  /**
   * Make HTTP request with error handling
   */
  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      body = null,
      includeAuth = true,
      timeout = 30000
    } = options;

    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
    const headers = this.getHeaders(includeAuth);

    const fetchOptions = {
      method,
      headers,
      signal: AbortSignal.timeout(timeout)
    };

    if (body) {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    try {
      const response = await fetch(url, fetchOptions);
      return await this.parseResponse(response);
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error);
      throw error;
    }
  }

  /**
   * GET request
   */
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  /**
   * PUT request
   */
  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  /**
   * DELETE request
   */
  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * PATCH request
   */
  patch(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', body });
  }

  // ============================================================================
  // AUTH API METHODS
  // ============================================================================

  /**
   * Register new customer
   */
  async registerCustomer(email, password, name, phone = '') {
    try {
      const response = await this.post('/api/auth/register', {
        email,
        password,
        name,
        phone
      }, { includeAuth: false });

      if (response.success && response.data?.token) {
        this.setToken(response.data.token);
        this.setStoredUser(response.data.user);
      }

      return response;
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  /**
   * Login customer
   */
  async loginCustomer(email, password) {
    try {
      const response = await this.post('/api/auth/login', {
        email,
        password
      }, { includeAuth: false });

      if (response.success && response.data?.token) {
        this.setToken(response.data.token);
        this.setStoredUser(response.data.user);
      }

      return response;
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  /**
   * Admin login
   */
  async adminLogin(email, password) {
    try {
      const response = await this.post('/api/auth/admin-login', {
        email,
        password
      }, { includeAuth: false });

      if (response.success && response.data?.token) {
        this.setToken(response.data.token);
        this.setStoredUser(response.data.adminUser);
      }

      return response;
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  /**
   * Logout (client-side only)
   */
  logout() {
    this.clearToken();
  }

  // ============================================================================
  // PRODUCT API METHODS
  // ============================================================================

  /**
   * Fetch all products with pagination and filters
   */
  async fetchProducts(page = 1, limit = 100, filters = {}) {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...filters
      });

      const response = await this.get(`/api/products?${params}`, { includeAuth: false });
      return response;
    } catch (error) {
      console.warn('Product fetch failed:', error.message);
      return { success: false, data: [] };
    }
  }

  /**
   * Fetch single product by ID
   */
  async fetchProductById(productId) {
    try {
      const response = await this.get(`/api/products/${productId}`, { includeAuth: false });
      return response;
    } catch (error) {
      console.warn(`Product ${productId} fetch failed:`, error.message);
      return { success: false };
    }
  }

  /**
   * Get product categories
   */
  async fetchCategories() {
    try {
      const response = await this.get('/api/products/categories', { includeAuth: false });
      return response;
    } catch (error) {
      console.warn('Categories fetch failed:', error.message);
      return { success: false, data: [] };
    }
  }

  // ============================================================================
  // CART API METHODS
  // ============================================================================

  /**
   * Get user's cart
   */
  async getCart() {
    try {
      const response = await this.get('/api/cart');
      return response;
    } catch (error) {
      console.warn('Cart fetch failed:', error.message);
      return { success: false, data: { items: [] } };
    }
  }

  /**
   * Add item to cart
   */
  async addToCart(productId, quantity = 1, color = null, size = null) {
    try {
      const response = await this.post('/api/cart', {
        productId,
        quantity,
        color,
        size
      });
      return response;
    } catch (error) {
      console.warn('Add to cart failed:', error.message);
      return { success: false, message: error.message };
    }
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(cartItemId, quantity) {
    try {
      const response = await this.put(`/api/cart/${cartItemId}`, {
        quantity
      });
      return response;
    } catch (error) {
      console.warn('Update cart item failed:', error.message);
      return { success: false, message: error.message };
    }
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(cartItemId) {
    try {
      const response = await this.delete(`/api/cart/${cartItemId}`);
      return response;
    } catch (error) {
      console.warn('Remove from cart failed:', error.message);
      return { success: false, message: error.message };
    }
  }

  /**
   * Clear entire cart
   */
  async clearCart() {
    try {
      const response = await this.delete('/api/cart');
      return response;
    } catch (error) {
      console.warn('Clear cart failed:', error.message);
      return { success: false, message: error.message };
    }
  }

  // ============================================================================
  // WISHLIST API METHODS
  // ============================================================================

  /**
   * Get user's wishlist
   */
  async getWishlist() {
    try {
      const response = await this.get('/api/wishlist');
      return response;
    } catch (error) {
      console.warn('Wishlist fetch failed:', error.message);
      return { success: false, data: { items: [] } };
    }
  }

  /**
   * Add product to wishlist
   */
  async addToWishlist(productId) {
    try {
      const response = await this.post('/api/wishlist', {
        productId
      });
      return response;
    } catch (error) {
      console.warn('Add to wishlist failed:', error.message);
      return { success: false, message: error.message };
    }
  }

  /**
   * Remove product from wishlist
   */
  async removeFromWishlist(wishlistItemId) {
    try {
      const response = await this.delete(`/api/wishlist/${wishlistItemId}`);
      return response;
    } catch (error) {
      console.warn('Remove from wishlist failed:', error.message);
      return { success: false, message: error.message };
    }
  }

  /**
   * Check if product is in wishlist
   */
  async checkWishlist(productId) {
    try {
      const response = await this.get(`/api/wishlist/check/${productId}`);
      return response;
    } catch (error) {
      console.warn('Wishlist check failed:', error.message);
      return { success: false, data: { inWishlist: false } };
    }
  }

  // ============================================================================
  // ORDER API METHODS
  // ============================================================================

  /**
   * Create new order
   */
  async createOrder(orderData) {
    try {
      const response = await this.post('/api/orders', orderData);
      return response;
    } catch (error) {
      console.warn('Create order failed:', error.message);
      return { success: false, message: error.message };
    }
  }

  /**
   * Get user's orders
   */
  async getUserOrders() {
    try {
      const response = await this.get('/api/orders');
      return response;
    } catch (error) {
      console.warn('Fetch orders failed:', error.message);
      return { success: false, data: { orders: [] } };
    }
  }

  /**
   * Get order tracking information
   */
  async getOrderTracking(orderId) {
    try {
      const response = await this.get(`/api/orders/${orderId}/track`, { includeAuth: false });
      return response;
    } catch (error) {
      console.warn(`Order tracking for ${orderId} failed:`, error.message);
      return { success: false };
    }
  }

  // ============================================================================
  // COUPON API METHODS
  // ============================================================================

  /**
   * Validate coupon code
   */
  async validateCoupon(code, subtotal = 0) {
    try {
      const response = await this.post('/api/coupons/validate', {
        code,
        subtotal
      }, { includeAuth: false });
      return response;
    } catch (error) {
      console.warn('Coupon validation failed:', error.message);
      return { success: false, message: error.message };
    }
  }

  /**
   * Get active coupons
   */
  async getActiveCoupons() {
    try {
      const response = await this.get('/api/coupons', { includeAuth: false });
      return response;
    } catch (error) {
      console.warn('Active coupons fetch failed:', error.message);
      return { success: false, data: { coupons: [] } };
    }
  }

  // ============================================================================
  // REVIEW API METHODS
  // ============================================================================

  /**
   * Get product reviews with pagination and sorting
   */
  async getProductReviews(productId, page = 1, limit = 10, sort = 'recent') {
    try {
      const response = await this.get(
        `/api/products/${productId}/reviews?page=${page}&limit=${limit}&sort=${sort}`,
        { includeAuth: false }
      );
      return response;
    } catch (error) {
      console.warn(`Reviews fetch for product ${productId} failed:`, error.message);
      return { success: false, data: { reviews: [], stats: {} } };
    }
  }

  /**
   * Add review to product
   */
  async addProductReview(productId, reviewData) {
    try {
      const response = await this.post(
        `/api/products/${productId}/reviews`,
        reviewData
      );
      return response;
    } catch (error) {
      console.warn('Add review failed:', error.message);
      return { success: false, message: error.message };
    }
  }

  /**
   * Update own review
   */
  async updateProductReview(productId, reviewId, reviewData) {
    try {
      const response = await this.put(
        `/api/products/${productId}/reviews/${reviewId}`,
        reviewData
      );
      return response;
    } catch (error) {
      console.warn('Update review failed:', error.message);
      return { success: false, message: error.message };
    }
  }

  /**
   * Delete own review
   */
  async deleteProductReview(productId, reviewId) {
    try {
      const response = await this.delete(
        `/api/products/${productId}/reviews/${reviewId}`
      );
      return response;
    } catch (error) {
      console.warn('Delete review failed:', error.message);
      return { success: false, message: error.message };
    }
  }

  /**
   * Mark review as helpful/unhelpful
   */
  async markReviewHelpful(productId, reviewId, helpful = true) {
    try {
      const response = await this.post(
        `/api/products/${productId}/reviews/${reviewId}/helpful`,
        { helpful },
        { includeAuth: false }
      );
      return response;
    } catch (error) {
      console.warn('Mark review helpful failed:', error.message);
      return { success: false, message: error.message };
    }
  }

  /**
   * Admin: Get pending reviews for approval
   */
  async getPendingReviews(page = 1, limit = 20) {
    try {
      const response = await this.get(
        `/api/admin/reviews/pending?page=${page}&limit=${limit}`
      );
      return response;
    } catch (error) {
      console.warn('Pending reviews fetch failed:', error.message);
      return { success: false, data: { reviews: [] } };
    }
  }

  /**
   * Admin: Approve or reject review
   */
  async verifyReview(reviewId, verified = true) {
    try {
      const response = await this.put(
        `/api/admin/reviews/${reviewId}/verify`,
        { verified }
      );
      return response;
    } catch (error) {
      console.warn('Verify review failed:', error.message);
      return { success: false, message: error.message };
    }
  }

  /**
   * Admin: Reply to review
   */
  async replyToReview(productId, reviewId, reply) {
    try {
      const response = await this.post(
        `/api/products/${productId}/reviews/${reviewId}/reply`,
        { reply }
      );
      return response;
    } catch (error) {
      console.warn('Reply to review failed:', error.message);
      return { success: false, message: error.message };
    }
  }

  // ============================================================================
  // ADMIN PRODUCT MANAGEMENT API METHODS
  // ============================================================================

  /**
   * Create a new product (Admin only)
   */
  async createProduct(productData) {
    try {
      const response = await this.post('/api/products', productData);
      return response;
    } catch (error) {
      console.warn('Create product failed:', error.message);
      return { success: false, message: error.message };
    }
  }

  /**
   * Update an existing product (Admin only)
   */
  async updateProduct(productId, productData) {
    try {
      const response = await this.put(`/api/products/${productId}`, productData);
      return response;
    } catch (error) {
      console.warn('Update product failed:', error.message);
      return { success: false, message: error.message };
    }
  }

  /**
   * Delete a product (Admin only)
   */
  async deleteProduct(productId) {
    try {
      const response = await this.delete(`/api/products/${productId}`);
      return response;
    } catch (error) {
      console.warn('Delete product failed:', error.message);
      return { success: false, message: error.message };
    }
  }

  /**
   * Update product inventory stock (Admin only)
   */
  async updateProductStock(productId, stock) {
    try {
      const response = await this.patch(`/api/products/${productId}/stock`, { stock });
      return response;
    } catch (error) {
      console.warn('Update stock failed:', error.message);
      return { success: false, message: error.message };
    }
  }

  // ============================================================================
  // ADMIN CATEGORY MANAGEMENT API METHODS
  // ============================================================================

  /**
   * Create a new category (Admin only)
   */
  async createCategory(categoryData) {
    try {
      const response = await this.post('/api/categories', categoryData);
      return response;
    } catch (error) {
      console.warn('Create category failed:', error.message);
      return { success: false, message: error.message };
    }
  }

  /**
   * Delete a category (Admin only)
   */
  async deleteCategory(categoryId) {
    try {
      const response = await this.delete(`/api/categories/${categoryId}`);
      return response;
    } catch (error) {
      console.warn('Delete category failed:', error.message);
      return { success: false, message: error.message };
    }
  }

  // ============================================================================
  // ADMIN COUPON MANAGEMENT API METHODS
  // ============================================================================

  /**
   * Create a new coupon (Admin only)
   */
  async createCoupon(couponData) {
    try {
      const response = await this.post('/api/coupons', couponData);
      return response;
    } catch (error) {
      console.warn('Create coupon failed:', error.message);
      return { success: false, message: error.message };
    }
  }

  /**
   * Update a coupon (Admin only)
   */
  async updateCoupon(couponId, couponData) {
    try {
      const response = await this.put(`/api/coupons/${couponId}`, couponData);
      return response;
    } catch (error) {
      console.warn('Update coupon failed:', error.message);
      return { success: false, message: error.message };
    }
  }

  /**
   * Delete a coupon (Admin only)
   */
  async deleteCoupon(couponId) {
    try {
      const response = await this.delete(`/api/coupons/${couponId}`);
      return response;
    } catch (error) {
      console.warn('Delete coupon failed:', error.message);
      return { success: false, message: error.message };
    }
  }

  // ============================================================================
  // ADMIN USER MANAGEMENT API METHODS
  // ============================================================================

  /**
   * Delete a user (Admin only)
   */
  async deleteUser(userId) {
    try {
      const response = await this.delete(`/api/admin/users/${userId}`);
      return response;
    } catch (error) {
      console.warn('Delete user failed:', error.message);
      return { success: false, message: error.message };
    }
  }

  /**
   * Update a user (Admin only)
   */
  async updateUser(userId, userData) {
    try {
      const response = await this.put(`/api/admin/users/${userId}`, userData);
      return response;
    } catch (error) {
      console.warn('Update user failed:', error.message);
      return { success: false, message: error.message };
    }
  }

  // ============================================================================
  // ADMIN PROFILE & SECURITY API METHODS
  // ============================================================================

  /**
   * Get admin profile (Admin only)
   */
  async getAdminProfile() {
    try {
      const response = await this.get('/api/auth/admin/profile');
      return response;
    } catch (error) {
      console.warn('Get admin profile failed:', error.message);
      return { success: false, message: error.message };
    }
  }

  /**
   * Update admin profile (Admin only)
   */
  async updateAdminProfile(profileData) {
    try {
      const response = await this.put('/api/auth/admin/profile', profileData);
      return response;
    } catch (error) {
      console.warn('Update admin profile failed:', error.message);
      return { success: false, message: error.message };
    }
  }

  /**
   * Change admin password (Admin only)
   */
  async changeAdminPassword(currentPassword, newPassword) {
    try {
      const response = await this.post('/api/auth/admin/password', {
        currentPassword,
        newPassword
      });
      return response;
    } catch (error) {
      console.warn('Change admin password failed:', error.message);
      return { success: false, message: error.message };
    }
  }

  /**
   * Update customer profile
   */
  async updateCustomerProfile(profileData) {
    try {
      const response = await this.put('/api/auth/profile', profileData);
      return response;
    } catch (error) {
      console.warn('Update customer profile failed:', error.message);
      return { success: false, message: error.message };
    }
  }
}

// Export singleton instance
export default new APIClient();
