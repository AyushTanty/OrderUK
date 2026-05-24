import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
      minlength: 2
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number']
    },
    cuisineTypes: [{
      type: String,
      enum: ['Italian', 'Chinese', 'Indian', 'Mexican', 'Japanese', 'Thai', 'American', 'Fast Food', 'Vegetarian', 'Mediterranean'],
      required: true
    }],
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'UK' },
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: { type: [Number], required: true }
      }
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    operatingHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String }
    },
    minOrder: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    image: { type: String, default: null },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    menu: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],
    isActive: { type: Boolean, default: true },
    description: { type: String, default: '' },
    totalOrders: { type: Number, default: 0 }
  },
  { timestamps: true }
);

restaurantSchema.index({ 'address.coordinates': '2dsphere' });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;