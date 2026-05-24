import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      minlength: 10,
      maxlength: 1000
    },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', default: null },
    isVerified: { type: Boolean, default: false },
    helpfulCount: { type: Number, default: 0 },
    images: [String],
    reviewType: { type: String, enum: ['restaurant', 'food'], default: 'restaurant' },
    response: {
      text: String,
      respondedAt: Date,
      respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }
  },
  { timestamps: true }
);

reviewSchema.pre('save', async function (next) {
  if (this.order) {
    const Order = mongoose.model('Order');
    const order = await Order.findById(this.order);
    if (order) this.isVerified = true;
  }
  next();
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;