import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
    },
    items: [{
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true },
      notes: String
    }],
    totalPrice: { type: Number, required: true, min: 0 },
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'UK' },
      coordinates: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: [Number]
      }
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'pending'
    },
    paymentMethod: { type: String, enum: ['card', 'cash', 'wallet'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    paymentId: String,
    estimatedDeliveryTime: Date,
    actualDeliveryTime: { type: Date, default: null },
    rider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    notes: String,
    cancellationReason: String,
    refundAmount: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    promoCode: String
  },
  { timestamps: true }
);

orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;