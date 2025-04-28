import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendEmail } from '../utils/emailSender.js';

// Token expiration times
const ACCESS_TOKEN_EXPIRE = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRE = '7d'; // 7 days

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Object} - Newly created user
 */
export const register = async (userData) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  // Create new user
  const user = await User.create(userData);
  
  // Remove password from response
  const userResponse = user.toObject();
  delete userResponse.password;
  
  return userResponse;
};

/**
 * Generate access token (short-lived)
 * @param {string} userId - User ID
 * @returns {string} - JWT access token
 */
export const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId, type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRE || ACCESS_TOKEN_EXPIRE }
  );
};

/**
 * Generate refresh token (long-lived)
 * @param {string} userId - User ID
 * @returns {string} - JWT refresh token
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || REFRESH_TOKEN_EXPIRE }
  );
};

/**
 * Login user and generate access and refresh tokens
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} - User data, access token, and refresh token
 */
export const login = async (email, password) => {
  // Find user with password included
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check if password matches
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // Update last login time
  user.lastLogin = new Date();
  
  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  
  // Store refresh token in database
  user.refreshToken = refreshToken;
  await user.save();

  // Remove password from response
  const userResponse = user.toObject();
  delete userResponse.password;
  delete userResponse.refreshToken;
  
  return { 
    user: userResponse, 
    accessToken,
    refreshToken 
  };
};

/**
 * Forgot password - generate reset token and send email
 * @param {string} email - User email
 * @param {string} resetUrl - Base URL for reset link
 * @returns {boolean} - Success status
 */
export const forgotPassword = async (email, resetUrl) => {
  const user = await User.findOne({ email });
  
  if (!user) {
    throw new Error('User not found with this email');
  }

  // Generate reset token
  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetLink = `${resetUrl}/reset-password/${resetToken}`;

  // Send email
  const message = `You requested a password reset. Please go to this link to reset your password: ${resetLink}`;
  
  try {
    // await sendEmail({
    //   email: user.email,
    //   subject: 'Password Reset Token',
    //   message
    // });
    
    return true;
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    
    throw new Error('Email could not be sent');
  }
};

/**
 * Reset password using token
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {boolean} - Success status
 */
export const resetPassword = async (token, newPassword) => {
  // Hash the token for comparison with stored hash
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // Find user with valid token
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    throw new Error('Invalid or expired token');
  }

  // Set new password and clear reset fields
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  
  await user.save();
  
  return true;
};

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Object} - User data
 */
export const getUserById = async (userId) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
};
