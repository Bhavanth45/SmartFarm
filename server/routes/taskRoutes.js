const express = require('express');
const router = express.Router();
const { getTasks, createTask, toggleTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getTasks)
  .post(protect, createTask);

router.patch('/:id/toggle', protect, toggleTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;
