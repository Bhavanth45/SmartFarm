const express = require('express');
const router = express.Router();
const { getOrders, createOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getOrders)
  .post(protect, createOrder);

module.exports = router;
