const TelemetryLog = require('../models/TelemetryLog');

// @desc    Get historical telemetry & mandi insights
// @route   GET /api/analytics/:fieldId
exports.getFieldAnalytics = async (req, res, next) => {
  try {
    const logs = await TelemetryLog.find({ fieldId: req.params.fieldId })
      .sort({ loggedAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        telemetryLogs: logs,
        mandiOutlook: {
          recommendation: 'Harvest within 4 days to maximize spot margins.',
          regionalDemand: 'Very High (+14%)',
          nearestMandi: 'Vashi APMC Market'
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
