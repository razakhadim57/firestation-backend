import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false // Don't return password by default in queries
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'station_admin', 'sponsor'],
    required: true
  },
  stationIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FireStation'
  }],
  sponsorIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sponsor'
  }],
  refreshToken: {
    type: String,
    select: false // Don't return refresh token by default in queries
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  resetPasswordOTP: String,
  resetPasswordOTPExpire: Date,
  lastLogin: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt
});

// Create indexes for frequently queried fields
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ stationIds: 1 });
UserSchema.index({ sponsorIds: 1 });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  // Only hash the password if it's modified or new
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate password reset token (legacy method)
UserSchema.methods.generatePasswordResetToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  // Set token expire time (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  
  return resetToken;
};

// Method to generate OTP for password reset
UserSchema.methods.generatePasswordResetOTP = function() {
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Hash OTP before storing
  this.resetPasswordOTP = crypto
    .createHash('sha256')
    .update(otp)
    .digest('hex');
  
  // Set OTP expire time (15 minutes)
  this.resetPasswordOTPExpire = Date.now() + 15 * 60 * 1000;
  
  return otp;
};

// Method to verify password reset OTP
UserSchema.methods.verifyPasswordResetOTP = function(candidateOTP) {
  // Hash the candidate OTP
  const hashedOTP = crypto
    .createHash('sha256')
    .update(candidateOTP)
    .digest('hex');
  
  // Check if OTP matches and is not expired
  const isValid = 
    this.resetPasswordOTP === hashedOTP && 
    this.resetPasswordOTPExpire > Date.now();
  
  return isValid;
};

const User = mongoose.model('User', UserSchema);

export default User;
