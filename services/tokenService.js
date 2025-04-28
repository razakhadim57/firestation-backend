import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Refresh token service
 * Handles token refresh functionality
 */

/**
 * Verify refresh token and generate new access token
 * @param {string} refreshToken - Refresh token
 * @returns {Object} - New access token and user data
 */
export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error('Refresh token is required');
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );

    // Check if token is refresh type
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    // Find user with this refresh token
    const user = await User.findOne({
      _id: decoded.id,
      refreshToken
    }).select('+refreshToken');

    if (!user) {
      throw new Error('Invalid refresh token');
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { id: user._id, type: 'access' },
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m' 
      }
    );

    return {
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Refresh token expired');
    }
    throw error;
  }
};

/**
 * Invalidate refresh token (logout)
 * @param {string} userId - User ID
 * @param {string} refreshToken - Refresh token to invalidate
 * @returns {boolean} - Success status
 */
export const invalidateRefreshToken = async (userId, refreshToken) => {
  const user = await User.findById(userId).select('+refreshToken');
  
  if (!user) {
    throw new Error('User not found');
  }

  // Only clear if the token matches
  if (user.refreshToken === refreshToken) {
    user.refreshToken = undefined;
    await user.save();
  }
  
  return true;
};
