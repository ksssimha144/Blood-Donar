const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      console.log('--- Auth Debug ---');
      console.log('Decoded ID:', decoded.id);

      // Get user from the token (exclude password)
      // Ensure we use a direct string comparison or string-to-object conversion
      req.user = await User.findById(decoded.id).select('-password').lean();

      if (!req.user) {
        console.error('Auth Error: User with ID', decoded.id, 'not found in database.');
        res.status(401);
        return next(new Error('Not authorized, user no longer exists'));
      }

      console.log('Auth Success: User', req.user.email, 'verified.');
      console.log('------------------');

      next();
    } catch (error) {
      console.error('Auth Error:', error.message);
      res.status(401);
      return next(error);
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token'));
  }
};

module.exports = { protect };
