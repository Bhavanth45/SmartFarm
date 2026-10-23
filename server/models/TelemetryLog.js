const mongoose = require('mongoose');

const TelemetryLogSchema = new mongoose.Schema({
  fieldId: { type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true },
  moistureBefore: Number,
  moistureAfter: Number,
  action: { type: String, default: 'IRRIGATION_PULSE' },
  temp: Number,
  loggedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TelemetryLog', TelemetryLogSchema);
