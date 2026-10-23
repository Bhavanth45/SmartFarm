const dataStore = require('../services/dataStore');

// @desc    Get buyer orders
// @route   GET /api/orders
exports.getOrders = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const orders = dataStore.getOrders(userId);
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Create buyer order
// @route   POST /api/orders
exports.createOrder = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const newOrder = dataStore.createOrder({
      buyerId: userId,
      ...req.body
    });
    res.status(201).json({ success: true, message: 'Order persisted successfully', data: newOrder });
  } catch (error) {
    next(error);
  }
};
