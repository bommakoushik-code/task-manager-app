const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to verify JSON Web Tokens.
 *
 * This middleware checks for a token in the `Authorization` header with the
 * scheme `Bearer`. If a valid token is found, the user’s ID is extracted
 * and attached to the request object. If the token is missing or invalid,
 * a 401 status is returned. Protected routes can then access
 * `req.user` to identify the authenticated user.
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

module.exports = { protect };