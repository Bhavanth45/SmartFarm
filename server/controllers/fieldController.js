const Field = require('../models/Field');
const TelemetryLog = require('../models/TelemetryLog');
const { isAtlasConnected } = require('../config/db');
const dataStore = require('../services/dataStore');

// @desc    Get all fields for logged-in user
// @route   GET /api/fields
exports.getFields = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    if (isAtlasConnected()) {
      try {
        const fields = await Field.find({ userId }).sort({ createdAt: -1 });
        return res.json({ success: true, storageMode: 'MONGODB_ATLAS', count: fields.length, data: fields });
      } catch (atlasErr) {
        console.warn('[Fields] Atlas read failed, checking local store:', atlasErr.message);
      }
    }

    const localFields = dataStore.getFields(userId);
    res.json({ success: true, storageMode: 'LOCAL_PERSISTENT_STORE', count: localFields.length, data: localFields });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new field
// @route   POST /api/fields
exports.createField = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { name, crop, soilMoisture, marketPrice, area, zones } = req.body;

    const moistureVal = Number(soilMoisture) || 65;
    const health = moistureVal >= 60 ? 92 : 78;

    if (isAtlasConnected()) {
      try {
        const newField = await Field.create({
          userId,
          name,
          crop,
          area: area || '5.0 Acres',
          soilMoisture: moistureVal,
          healthScore: health,
          healthStatus: health >= 90 ? 'Excellent' : 'Good',
          moistureStatus: moistureVal >= 60 ? 'Healthy & Moist' : 'Needs Water',
          marketPrice: marketPrice || '₹50 / kg',
          zones: zones || [
            { name: 'Plot A (North)', status: 'Healthy', color: '#22c55e' },
            { name: 'Plot B (Center)', status: moistureVal < 60 ? 'Needs Water' : 'Good', color: moistureVal < 60 ? '#eab308' : '#22c55e' },
            { name: 'Plot C (South)', status: 'Healthy', color: '#22c55e' }
          ]
        });

        // Also sync copy to local store
        dataStore.createField(userId, req.body);

        return res.status(201).json({ success: true, storageMode: 'MONGODB_ATLAS', data: newField });
      } catch (atlasErr) {
        console.warn('[Fields] Atlas create failed, using local store:', atlasErr.message);
      }
    }

    const localField = dataStore.createField(userId, req.body);
    res.status(201).json({ success: true, storageMode: 'LOCAL_PERSISTENT_STORE', data: localField });
  } catch (error) {
    next(error);
  }
};

// @desc    Simulate watering field (Drip Irrigation Pulse)
// @route   POST /api/fields/:id/water
exports.waterField = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const fieldId = req.params.id;

    if (isAtlasConnected()) {
      try {
        const field = await Field.findOne({ _id: fieldId, userId });
        if (field) {
          const previousMoisture = field.soilMoisture;
          const newMoisture = Math.min(95, previousMoisture + 15);

          field.soilMoisture = newMoisture;
          field.moistureStatus = 'Freshly Watered';
          field.healthScore = Math.min(98, field.healthScore + 6);
          field.healthStatus = 'Excellent';
          field.lastWateredAt = new Date();

          if (field.zones) {
            field.zones.forEach(zone => {
              zone.status = 'Healthy';
              zone.color = '#22c55e';
            });
          }

          await field.save();

          await TelemetryLog.create({
            fieldId: field._id,
            moistureBefore: previousMoisture,
            moistureAfter: newMoisture,
            action: '15_MIN_PULSE_IRRIGATION',
            temp: field.temp
          });

          // Also mirror to local
          dataStore.waterField(fieldId, userId);

          return res.json({ success: true, storageMode: 'MONGODB_ATLAS', message: 'Irrigation executed successfully', data: field });
        }
      } catch (atlasErr) {
        console.warn('[Fields] Atlas watering failed, falling back to local store:', atlasErr.message);
      }
    }

    const updated = dataStore.waterField(fieldId, userId);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Field not found' });
    }

    res.json({ success: true, storageMode: 'LOCAL_PERSISTENT_STORE', message: 'Irrigation executed successfully', data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a field
// @route   DELETE /api/fields/:id
exports.deleteField = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const fieldId = req.params.id;

    if (isAtlasConnected()) {
      try {
        await Field.findOneAndDelete({ _id: fieldId, userId });
      } catch (err) {}
    }

    dataStore.deleteField(fieldId, userId);
    res.json({ success: true, message: 'Field removed successfully from database' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update field market price dynamically & reflect in mandi
// @route   PATCH /api/fields/:id/price
exports.updatePrice = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const fieldId = req.params.id;
    const { price } = req.body;

    if (price === undefined || price === null || price === '') {
      return res.status(400).json({ success: false, message: 'Price is required' });
    }

    const formattedPrice = String(price).startsWith('₹') ? String(price) : `₹${price} / kg`;

    if (isAtlasConnected()) {
      try {
        const field = await Field.findOne({ _id: fieldId, userId });
        if (field) {
          field.marketPrice = formattedPrice;
          await field.save();
          dataStore.updateFieldPrice(fieldId, userId, formattedPrice);
          return res.json({
            success: true,
            storageMode: 'MONGODB_ATLAS',
            message: 'Mandi price updated successfully in MongoDB Atlas!',
            data: field
          });
        }
      } catch (atlasErr) {
        console.warn('[Fields] Atlas price update failed, using local store:', atlasErr.message);
      }
    }

    const updated = dataStore.updateFieldPrice(fieldId, userId, formattedPrice);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Field not found' });
    }

    res.json({
      success: true,
      storageMode: 'LOCAL_PERSISTENT_STORE',
      message: 'Mandi price updated successfully in database!',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

