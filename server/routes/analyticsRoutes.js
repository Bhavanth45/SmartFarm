const express = require('express');
const router = express.Router();
const { getFieldAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/:fieldId', protect, getFieldAnalytics);

module.exports = router;
