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
    select: false
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
    select: false
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
  timestamps: true
});

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ stationIds: 1 });
UserSchema.index({ sponsorIds: 1 });

UserSchema.pre('save', async function(next) {
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

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.generatePasswordResetToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  
  return resetToken;
};

UserSchema.methods.generatePasswordResetOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  this.resetPasswordOTP = crypto
    .createHash('sha256')
    .update(otp)
    .digest('hex');
  
  this.resetPasswordOTPExpire = Date.now() + 15 * 60 * 1000;
  
  return otp;
};

UserSchema.methods.verifyPasswordResetOTP = function(candidateOTP) {
  const hashedOTP = crypto
    .createHash('sha256')
    .update(candidateOTP)
    .digest('hex');
  
  const isValid = 
    this.resetPasswordOTP === hashedOTP && 
    this.resetPasswordOTPExpire > Date.now();
  
  return isValid;
};

const User = mongoose.model('User', UserSchema);

export default User;
