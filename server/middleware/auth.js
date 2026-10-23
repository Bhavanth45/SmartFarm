const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isAtlasConnected } = require('../config/db');
const dataStore = require('../services/dataStore');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (isAtlasConnected()) {
        try {
          req.user = await User.findById(decoded.id).select('-password');
        } catch (dbErr) {
          req.user = dataStore.findUserById(decoded.id);
        }
      } else {
        req.user = dataStore.findUserById(decoded.id);
      }

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found for this token' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Token invalid or expired' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Access denied: No auth token provided' });
  }
};

module.exports = { protect };
