import Joi from 'joi';

export const schemas = {
  register: Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid('customer', 'restaurant', 'rider', 'admin').default('customer')
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
  }),

  updateUser: Joi.object({
    firstName: Joi.string().min(2).max(50),
    lastName: Joi.string().min(2).max(50),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/),
    address: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      postalCode: Joi.string(),
      country: Joi.string()
    }),
    profileImage: Joi.string().uri()
  }),

  createRestaurant: Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
    cuisineTypes: Joi.array().items(Joi.string()).min(1).required(),
    address: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      postalCode: Joi.string().required(),
      country: Joi.string().default('UK'),
      coordinates: Joi.object({
        type: Joi.string().default('Point'),
        coordinates: Joi.array().items(Joi.number()).length(2).required()
      }).required()
    }).required(),
    description: Joi.string(),
    image: Joi.string().uri(),
    minOrder: Joi.number().min(0),
    deliveryFee: Joi.number().min(0)
  }),

  createMenuItem: Joi.object({
    name: Joi.string().min(2).required(),
    description: Joi.string().min(10).required(),
    price: Joi.number().min(0).required(),
    category: Joi.string().valid('Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Sides', 'Combo').required(),
    restaurant: Joi.string().required(),
    image: Joi.string().uri(),
    preparationTime: Joi.number().min(1).default(20),
    vegetarian: Joi.boolean(),
    vegan: Joi.boolean(),
    spicyLevel: Joi.number().min(0).max(5)
  }),

  createOrder: Joi.object({
    restaurant: Joi.string().required(),
    items: Joi.array().items(
      Joi.object({
        itemId: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        notes: Joi.string()
      })
    ).min(1).required(),
    deliveryAddress: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      postalCode: Joi.string().required(),
      country: Joi.string().default('UK'),
      coordinates: Joi.object({
        type: Joi.string().default('Point'),
        coordinates: Joi.array().items(Joi.number()).length(2)
      })
    }).required(),
    paymentMethod: Joi.string().valid('card', 'cash', 'wallet').required(),
    notes: Joi.string(),
    promoCode: Joi.string()
  }),

  createReview: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().min(10).max(1000).required(),
    restaurant: Joi.string().required(),
    order: Joi.string(),
    menuItem: Joi.string(),
    reviewType: Joi.string().valid('restaurant', 'food').default('restaurant'),
    images: Joi.array().items(Joi.string().uri())
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required()
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(8).required(),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
  })
};

/**
 * Validation middleware factory
 */
export const validate = (schemaName, source = 'body') => {
  return (req, res, next) => {
    const schema = schemas[schemaName];

    if (!schema) {
      return res.status(500).json({
        success: false,
        message: `Validation schema '${schemaName}' not found`
      });
    }

    const data = req[source];
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    req[source] = value;
    next();
  };
};