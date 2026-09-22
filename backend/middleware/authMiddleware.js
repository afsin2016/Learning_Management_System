const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_jwt_key_lms_2026_secure_token_987'
      );

      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists',
        });
      }

      if (user.status === 'blocked') {
        return res.status(403).json({
          success: false,
          message: 'Your account has been suspended by an administrator. Please contact support.',
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth protect error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, invalid or expired token',
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no bearer token provided',
    });
  }
};

// Optional auth: populate req.user if token is present, but don't fail if not
const optionalAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_jwt_key_lms_2026_secure_token_987'
      );
      const user = await User.findById(decoded.id).select('-password');
      if (user && user.status !== 'blocked') {
        req.user = user;
      }
    } catch (err) {
      // Ignore invalid optional token
    }
  }
  next();
};

module.exports = { protect, optionalAuth };
