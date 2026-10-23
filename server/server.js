const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB, isAtlasConnected } = require('./config/db');
const dataStore = require('./services/dataStore');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect Database (Atlas with graceful local fallback)
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors({ origin: '*' }));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/fields', require('./routes/fieldRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Accurate Health Check endpoint showing live storage state
app.get('/api/health', (req, res) => {
  const atlas = isAtlasConnected();
  const stats = dataStore.getStats();
  res.json({
    status: 'HEALTHY',
    timestamp: new Date(),
    uptime: process.uptime(),
    database: {
      mode: atlas ? 'MONGODB_ATLAS' : 'LOCAL_PERSISTENT_STORE',
      atlasConnected: atlas,
      statusLabel: atlas ? 'MongoDB Atlas Cloud (Live)' : 'Local Persistent Engine (Disk Saved)',
      localFile: dataStore.dbFilePath,
      counts: stats,
      wifiNotice: atlas ? null : 'Wi-Fi port 27017 is blocked. Saving to local persistent database. Connect to Mobile Hotspot to activate Atlas cloud.'
    }
  });
});

// Centralized Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`[SmartFarm Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Graceful rejection handler
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Error] ${err.message}`);
});
