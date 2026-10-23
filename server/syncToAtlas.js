const dotenv = require('dotenv');
const mongoose = require('mongoose');
const dataStore = require('./services/dataStore');
const User = require('./models/User');
const Field = require('./models/Field');
const Task = require('./models/Task');
const TelemetryLog = require('./models/TelemetryLog');

dotenv.config();

const sync = async () => {
  console.log('--- SMARTFARM CLOUD SYNC TO MONGODB ATLAS ---');
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('❌ MONGO_URI missing in .env!');
    process.exit(1);
  }

  try {
    console.log('[1/4] Connecting to MongoDB Atlas Cloud...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000, family: 4 });
    console.log('✅ Connected to MongoDB Atlas Cloud!');

    const localData = dataStore.getAllData();

    // 1. Sync Users
    console.log(`[2/4] Syncing ${localData.users.length} Users...`);
    for (const u of localData.users) {
      await User.findOneAndUpdate(
        { phone: u.phone },
        {
          name: u.name,
          phone: u.phone,
          email: u.email,
          password: u.password,
          role: u.role,
          farmLocation: u.farmLocation
        },
        { upsert: true, new: true }
      );
    }
    console.log('✅ Users synced.');

    // 2. Sync Fields
    console.log(`[3/4] Syncing ${localData.fields.length} Fields...`);
    for (const f of localData.fields) {
      await Field.findOneAndUpdate(
        { name: f.name, userId: f.userId },
        {
          name: f.name,
          crop: f.crop,
          area: f.area,
          healthScore: f.healthScore,
          healthStatus: f.healthStatus,
          soilMoisture: f.soilMoisture,
          moistureStatus: f.moistureStatus,
          temp: f.temp,
          weatherText: f.weatherText,
          marketPrice: f.marketPrice,
          zones: f.zones
        },
        { upsert: true, new: true }
      );
    }
    console.log('✅ Fields synced.');

    // 3. Sync Tasks
    console.log(`[4/4] Syncing ${localData.tasks.length} Tasks...`);
    for (const t of localData.tasks) {
      await Task.findOneAndUpdate(
        { text: t.text, userId: t.userId },
        {
          fieldId: t.fieldId,
          text: t.text,
          time: t.time,
          priority: t.priority,
          done: t.done
        },
        { upsert: true, new: true }
      );
    }
    console.log('✅ Tasks synced.');

    console.log('\n🎉 ALL LOCAL DATA SUCCESSFULLY MIGRATED TO MONGODB ATLAS CLOUD!\n');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ SYNC FAILED:', err.message);
    if (err.message.includes('Could not connect to any servers')) {
      console.log('👉 Make sure your laptop is connected to Mobile Hotspot and 0.0.0.0/0 is whitelisted in Atlas.');
    }
    process.exit(1);
  }
};

sync();
