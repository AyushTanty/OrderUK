import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Menu item name is required'],
      trim: true,
      minlength: 2
    },
    description: {
      type: String,
      required: true,
      minlength: 10
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0
    },
    image: { type: String, default: null },
    category: {
      type: String,
      required: true,
      enum: ['Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Sides', 'Combo']
    },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    isAvailable: { type: Boolean, default: true },
    preparationTime: { type: Number, default: 20 },
    ratings: { type: Number, default: 0, min: 0, max: 5 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    allergens: [String],
    vegetarian: { type: Boolean, default: false },
    vegan: { type: Boolean, default: false },
    spicyLevel: { type: Number, default: 0, min: 0, max: 5 },
    calories: { type: Number, default: null },
    stock: { type: Number, default: null },
    popular: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;