import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: 2
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
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
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    role: {
      type: String,
      enum: ['customer', 'restaurant', 'rider', 'admin'],
      default: 'customer'
    },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: { type: String, default: 'UK' },
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: {
          type: [Number],
          default: [0, 0]
        }
      }
    },
    profileImage: {
      type: String,
      default: null
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: {
      type: Date,
      default: null
    },
    refreshTokens: [{
      token: String,
      createdAt: { type: Date, default: Date.now, expires: 604800 }
    }]
  },
  { timestamps: true }
);

userSchema.index({ 'address.coordinates': '2dsphere' });

/**
 * Pre-save middleware to hash password
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Method to compare password with hashed password
 */
userSchema.methods.comparePassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

/**
 * Method to hide sensitive fields
 */
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.refreshTokens;
  return user;
};

const User = mongoose.model('User', userSchema);
export default User;