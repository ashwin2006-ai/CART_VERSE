// Phase 5: MongoDB Product Schema Specification
export const ProductSchema = {
  name: { type: String, required: true },
  category: { type: String, required: true, index: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  discount: { type: Number, default: 0 },
  rating: { type: Number, default: 5.0 },
  reviewCount: { type: Number, default: 0 },
  stock: { type: Number, required: true, default: 0 },
  featured: { type: Boolean, default: false },
  bestSeller: { type: Boolean, default: false },
  isNew: { type: Boolean, default: true },
  dealOfTheDay: { type: Boolean, default: false },
  images: [{ type: String }],
  description: { type: String },
  features: [{ type: String }],
  colors: [{
    name: String,
    hex: String,
    inStock: Boolean
  }],
  sizes: [{ type: String }],
  specs: { type: Map, of: String },
  createdAt: { type: Date, default: Date.now }
};
