const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { isAtlasConnected } = require('../config/db');
const dataStore = require('../services/dataStore');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
};

// @desc    Register a new farmer or buyer
// @route   POST /api/auth/register
exports.registerUser = async (req, res, next) => {
  try {
    const { name, phone, email, password, role, farmLocation } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Name, phone, and password are required' });
    }

    if (isAtlasConnected()) {
      try {
        const userExists = await User.findOne({ phone });
        if (userExists) {
          return res.status(400).json({ success: false, message: 'Account with this phone already exists' });
        }

        const user = await User.create({ name, phone, email, password, role, farmLocation });
        return res.status(201).json({
          success: true,
          storageMode: 'MONGODB_ATLAS',
          token: generateToken(user._id),
          user: { id: user._id, name: user.name, phone: user.phone, email: user.email, role: user.role }
        });
      } catch (atlasErr) {
        console.warn('[Auth] Atlas save failed, falling back to local persistent store:', atlasErr.message);
      }
    }

    // Local Persistent Storage fallback
    const existing = dataStore.findUserWithPassword(phone);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Account with this phone already exists in database' });
    }

    const newUser = await dataStore.createUser({ name, phone, email, password, role, farmLocation });
    res.status(201).json({
      success: true,
      storageMode: 'LOCAL_PERSISTENT_STORE',
      token: generateToken(newUser._id),
      user: { id: newUser._id, name: newUser.name, phone: newUser.phone, email: newUser.email, role: newUser.role }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login farmer or buyer & return JWT
// @route   POST /api/auth/login
exports.loginUser = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Identifier and password are required' });
    }

    if (isAtlasConnected()) {
      try {
        const user = await User.findOne({
          $or: [{ phone: identifier }, { email: identifier }]
        });

        if (user && (await user.matchPassword(password))) {
          return res.json({
            success: true,
            storageMode: 'MONGODB_ATLAS',
            token: generateToken(user._id),
            user: { id: user._id, name: user.name, phone: user.phone, email: user.email, role: user.role }
          });
        }
      } catch (atlasErr) {
        console.warn('[Auth] Atlas login failed, checking local store:', atlasErr.message);
      }
    }

    // Local DataStore check
    const localUser = dataStore.findUserWithPassword(identifier);
    if (localUser) {
      const isMatch = await bcrypt.compare(password, localUser.password);
      if (isMatch) {
        return res.json({
          success: true,
          storageMode: 'LOCAL_PERSISTENT_STORE',
          token: generateToken(localUser._id),
          user: { id: localUser._id, name: localUser.name, phone: localUser.phone, email: localUser.email, role: localUser.role }
        });
      }
    }

    return res.status(401).json({ success: false, message: 'Invalid phone/email or password' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Current User Profile
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};
