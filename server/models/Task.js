const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fieldId: { type: mongoose.Schema.Types.ObjectId, ref: 'Field' },
  text: { type: String, required: [true, 'Task description is required'] },
  time: { type: String, default: 'Today' },
  priority: { type: String, enum: ['High', 'Normal', 'Low'], default: 'Normal' },
  done: { type: Boolean, default: false },
  completedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
