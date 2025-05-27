import * as authService from '../services/authService.js';
import * as tokenService from '../services/tokenService.js';
 
export const register = async (req, res, next) => {
  try {
    const userData = {
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      role: req.body.role,
      stationIds: req.body.stationIds || [],
      sponsorIds: req.body.sponsorIds || []
    };

    const user = await authService.register(userData);
    
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const { user, accessToken, refreshToken } = await authService.login(email, password);
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });
    
    res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address'
      });
    }

    await authService.forgotPassword(email);
    
    res.status(200).json({
      success: true,
      message: 'OTP sent to your email address',
      data: {
        email
      }
    });
  } catch (error) {
    next(error);
  }
};
export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and OTP'
      });
    }

    await authService.verifyPasswordResetOTP(email, otp);
    
    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        email,
        verified: true
      }
    });
  } catch (error) {
    next(error);
  }
};
export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;
    
    if (!email || !otp || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, OTP, and new password'
      });
    }

    await authService.resetPassword(email, otp, password);
    
    res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    next(error);
  }
};
export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is required'
      });
    }
 
    const { accessToken, user } = await tokenService.refreshAccessToken(refreshToken);
    
    res.status(200).json({
      success: true,
      accessToken,
      data: user
    });
  } catch (error) {
    if (error.message === 'Refresh token expired' || 
        error.message === 'Invalid refresh token') {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try { 
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }
 
    const userId = req.user?.id;
    
    if (userId) { 
      await tokenService.invalidateRefreshToken(userId, refreshToken);
    }
     
    res.clearCookie('refreshToken');
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};
