const mongoose = require('mongoose');

const ZoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ['Healthy', 'Needs Water', 'Attention', 'Good', 'Optimal'], default: 'Healthy' },
  color: { type: String, default: '#22c55e' }
});

const FieldSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: [true, 'Field name is required'], trim: true },
  crop: { type: String, required: [true, 'Crop name is required'], trim: true },
  area: { type: String, default: '10.0 ha' },
  healthScore: { type: Number, min: 0, max: 100, default: 90 },
  healthStatus: { type: String, default: 'Good' },
  soilMoisture: { type: Number, min: 0, max: 100, default: 65 },
  moistureStatus: { type: String, default: 'Healthy & Moist' },
  temp: { type: Number, default: 24.5 },
  weatherText: { type: String, default: 'Sunny & Warm' },
  rainChance: { type: String, default: '10%' },
  wind: { type: String, default: '9 km/h (Gentle breeze)' },
  marketPrice: { type: String, default: '₹50 / kg' },
  marketTrend: { type: String, default: '+5% this week' },
  zones: [ZoneSchema],
  lastWateredAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Field', FieldSchema);
