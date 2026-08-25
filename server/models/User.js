// Phase 5 & 6: MongoDB User & RBAC Schema Specification
export const UserSchema = {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin', 'superadmin'], default: 'customer' },
  phone: { type: String },
  avatar: { type: String },
  tier: { type: String, default: 'VIP Platinum' },
  rewardPoints: { type: Number, default: 0 },
  addresses: [{
    title: String,
    fullName: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
    isDefault: Boolean
  }],
  wishlist: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
};
