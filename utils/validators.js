/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (international format)
 * @param {string} phone - Phone number
 * @returns {boolean} True if valid
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/[\s\-()]/g, ''));
};

/**
 * Validate password strength
 * Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 special char
 * @param {string} password - Password
 * @returns {object} { isValid: boolean, errors: string[] }
 */
export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/@\$!%\*?&^#()/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&^#())');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate MongoDB ObjectId
 * @param {string} id - ObjectId string
 * @returns {boolean} True if valid
 */
export const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Validate postal code (UK format)
 * @param {string} postcode - UK postcode
 * @returns {boolean} True if valid
 */
export const isValidUKPostcode = (postcode) => {
  const postcodeRegex = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i;
  return postcodeRegex.test(postcode.replace(/\s/g, ''));
};

/**
 * Validate coordinates (latitude, longitude)
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {boolean} True if valid
 */
export const isValidCoordinates = (lat, lng) => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

/**
 * Validate URL format
 * @param {string} url - URL
 * @returns {boolean} True if valid
 */
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Sanitize string input
 * @param {string} input - Input string
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};