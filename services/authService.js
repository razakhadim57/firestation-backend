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
 * Forgot password - generate OTP and send email
 * @param {string} email - User email
 * @returns {boolean} - Success status
 */
export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  
  if (!user) {
    throw new Error('User not found with this email');
  }

  // Generate OTP
  const otp = user.generatePasswordResetOTP();
  await user.save({ validateBeforeSave: false });
console.log("OTP generated: ", otp);
  // Create email message with OTP
  const message = `
    <h1>Password Reset</h1>
    <p>You requested a password reset for your Feuerwehr-TV account.</p>
    <p>Your OTP code is: <strong>${otp}</strong></p>
    <p>This code will expire in 15 minutes.</p>
    <p>If you did not request this reset, please ignore this email.</p>
  `;
  
  try {
    // await sendEmail({
    //   email: user.email,
    //   subject: 'Password Reset OTP',
    //   message,
    //   html: message
    // });
    
    return true;
  } catch (error) {
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpire = undefined;
    await user.save({ validateBeforeSave: false });
    
    throw new Error('Email could not be sent');
  }
};

/**
 * Verify OTP for password reset
 * @param {string} email - User email
 * @param {string} otp - One-time password
 * @returns {boolean} - Success status
 */
export const verifyPasswordResetOTP = async (email, otp) => {
  // Find user by email
  const user = await User.findOne({ 
    email,
    resetPasswordOTPExpire: { $gt: Date.now() }
  });

  if (!user) {
    throw new Error('Invalid email or OTP expired');
  }

  // Verify OTP
  const isValid = user.verifyPasswordResetOTP(otp);
  if (!isValid) {
    throw new Error('Invalid OTP');
  }
  
  return true;
};

/**
 * Reset password using OTP
 * @param {string} email - User email
 * @param {string} otp - One-time password
 * @param {string} newPassword - New password
 * @returns {boolean} - Success status
 */
export const resetPassword = async (email, otp, newPassword) => {
  // Find user by email
  const user = await User.findOne({ 
    email,
    resetPasswordOTPExpire: { $gt: Date.now() }
  });

  if (!user) {
    throw new Error('Invalid email or OTP expired');
  }

  // Verify OTP
  const isValid = user.verifyPasswordResetOTP(otp);
  if (!isValid) {
    throw new Error('Invalid OTP');
  }

  // Set new password and clear reset fields
  user.password = newPassword;
  user.resetPasswordOTP = undefined;
  user.resetPasswordOTPExpire = undefined;
  
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
