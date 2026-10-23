const dotenv = require('dotenv');
const { connectDB, isAtlasConnected } = require('./config/db');
const User = require('./models/User');
const Field = require('./models/Field');
const Task = require('./models/Task');
const dataStore = require('./services/dataStore');

dotenv.config();

const seedData = async () => {
  try {
    console.log('--- SMARTFARM UNIVERSAL DATABASE SEEDER ---');
    await connectDB();

    if (isAtlasConnected()) {
      console.log('[Atlas Seeder] Clearing existing Atlas cloud collections...');
      await User.deleteMany();
      await Field.deleteMany();
      await Task.deleteMany();

      // 1. Create Default Demo Farmer
      const user = await User.create({
        name: 'Ramesh Kumar',
        phone: '9876543210',
        email: 'ramesh@kisan.in',
        password: 'password123',
        role: 'Farmer',
        farmLocation: 'Nashik, Maharashtra'
      });

      // Create Default Demo Buyer
      const buyerUser = await User.create({
        name: 'Priya Sharma',
        phone: '9988776655',
        email: 'priya@apmcmarket.in',
        password: 'password123',
        role: 'Buyer',
        farmLocation: 'Vashi APMC, Mumbai'
      });

      // 2. Create Initial Fields
      const field1 = await Field.create({
        userId: user._id,
        name: 'Field 1: Poblano Peppers',
        crop: 'Poblano Pepper (Capsicum)',
        healthScore: 94,
        healthStatus: 'Excellent',
        soilMoisture: 68,
        moistureStatus: 'Healthy & Moist',
        temp: 24,
        weatherText: 'Sunny & Warm',
        rainChance: '10%',
        wind: '9 km/h (Gentle breeze)',
        marketPrice: '₹65 / kg',
        marketTrend: '+8% this week',
        zones: [
          { name: 'North Plot', status: 'Healthy', color: '#22c55e' },
          { name: 'Center Plot', status: 'Needs Water', color: '#eab308' },
          { name: 'South Plot', status: 'Healthy', color: '#22c55e' }
        ]
      });

      const field2 = await Field.create({
        userId: user._id,
        name: 'Field 2: Sharbati Wheat',
        crop: 'Winter Wheat (Gehun)',
        healthScore: 82,
        healthStatus: 'Good',
        soilMoisture: 45,
        moistureStatus: 'Slightly Dry',
        temp: 21,
        weatherText: 'Breezy & Mild',
        rainChance: '25%',
        wind: '18 km/h (Moderate gusts)',
        marketPrice: '₹28 / kg',
        marketTrend: '+3% this week',
        zones: [
          { name: 'Upper Ridge', status: 'Slightly Dry', color: '#eab308' },
          { name: 'Main Meadow', status: 'Healthy', color: '#22c55e' },
          { name: 'Lowland', status: 'Healthy', color: '#22c55e' }
        ]
      });

      // 3. Create Initial Tasks
      await Task.create([
        { userId: user._id, fieldId: field1._id, text: 'Water the center plot before 2 PM', time: 'Today', priority: 'High', done: false },
        { userId: user._id, fieldId: field1._id, text: 'Check pepper leaves for morning bugs', time: 'Tomorrow', priority: 'Normal', done: true },
        { userId: user._id, fieldId: field2._id, text: 'Postpone drone spray due to windy weather', time: 'Today', priority: 'High', done: false }
      ]);

      console.log('🎉 [Atlas Seeder] MongoDB Atlas Cloud seeded successfully!');
    } else {
      console.log('ℹ️ [Local Seeder] Atlas port 27017 blocked on this Wi-Fi. Seeded local persistent store at server/data/smartfarm_local_db.json.');
    }

    const stats = dataStore.getStats();
    console.log(`[Storage Summary] Users: ${stats.usersCount}, Fields: ${stats.fieldsCount}, Tasks: ${stats.tasksCount}`);
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error] ${error.message}`);
    process.exit(1);
  }
};

seedData();
