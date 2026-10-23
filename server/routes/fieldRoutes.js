const express = require('express');
const router = express.Router();
const { getFields, createField, waterField, deleteField, updatePrice } = require('../controllers/fieldController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getFields)
  .post(protect, createField);

router.post('/:id/water', protect, waterField);
router.patch('/:id/price', protect, updatePrice);
router.delete('/:id', protect, deleteField);

module.exports = router;
