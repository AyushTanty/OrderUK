import jwt from 'jsonwebtoken';

/**
 * Generate JWT access token
 * @param {string} userId - User ID
 * @param {string} role - User role
 * @returns {string} JWT token
 */
export const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY || '1h' }
  );
};

/**
 * Verify JWT access token
 * @param {string} token - JWT token
 * @returns {object} Decoded token
 * @throws {Error} If token is invalid or expired
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error(`Invalid or expired token: ${error.message}`);
  }
};

/**
 * Generate JWT refresh token
 * @param {string} userId - User ID
 * @returns {string} Refresh token
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
  );
};

/**
 * Verify JWT refresh token
 * @param {string} token - Refresh token
 * @returns {object} Decoded token
 * @throws {Error} If token is invalid or expired
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error(`Invalid or expired refresh token: ${error.message}`);
  }
};

/**
 * Decode token without verification (use with caution)
 * @param {string} token - JWT token
 * @returns {object} Decoded token
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};