// Phase 5: MongoDB Order Schema Specification
export const OrderSchema = {
  id: { type: String, required: true, unique: true },
  customerId: { type: String, required: true, index: true },
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned & Refunded'],
    default: 'Confirmed'
  },
  statusStep: { type: Number, default: 2 },
  estimatedDelivery: { type: String },
  trackingNumber: { type: String },
  carrier: { type: String, default: 'Aura Express Air Cargo' },
  items: [{
    id: String,
    name: String,
    color: String,
    size: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  subtotal: Number,
  discount: Number,
  shippingFee: Number,
  tax: Number,
  total: Number,
  paymentMethod: String,
  paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Refunded'], default: 'Paid' },
  shippingAddress: {
    fullName: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    phone: String
  },
  timeline: [{
    step: String,
    time: String,
    done: Boolean
  }],
  returnRequested: { type: Boolean, default: false },
  returnReason: String,
  returnStatus: String
};
