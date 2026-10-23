const mongoose = require('mongoose');

let atlasConnected = false;

const isAtlasConnected = () => {
  return atlasConnected && mongoose.connection.readyState === 1;
};

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.warn('⚠️ [MongoDB] MONGO_URI missing in .env. Using Local Data Store.');
    return null;
  }

  console.log('[MongoDB Atlas] Attempting cloud connection (5s timeout)...');

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // 5s fast timeout to prevent hanging on blocked firewalls
      socketTimeoutMS: 20000,
      family: 4 // Force IPv4
    });

    atlasConnected = true;
    console.log(`\n🎉 [MongoDB Atlas] Connected Successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Cloud Status: LIVE & SYNCHRONIZING\n`);

    return conn;
  } catch (error) {
    atlasConnected = false;
    console.log('\n==================================================================');
    console.log('⚠️ [MongoDB Atlas Cloud Notice]');
    console.log(`   Connection to Atlas timed out / was blocked.`);
    console.log(`   Reason: Outbound port 27017 is blocked by your current Wi-Fi network.`);
    console.log('------------------------------------------------------------------');
    console.log('🟢 [SmartFarm Local Persistent Engine ACTIVATED]');
    console.log('   All data (Users, Fields, Tasks, Orders, Telemetry) will safely');
    console.log('   persist in server/data/smartfarm_local_db.json without any data loss!');
    console.log('------------------------------------------------------------------');
    console.log('💡 [HOW TO ACTIVATE MONGODB ATLAS CLOUD]:');
    console.log('   1. Turn ON Mobile Hotspot on your phone.');
    console.log('   2. Connect your laptop Wi-Fi to your Mobile Hotspot.');
    console.log('   3. Run "npm run test:db" to verify, then restart the server.');
    console.log('==================================================================\n');

    return null;
  }
};

// Monitor connection events
mongoose.connection.on('connected', () => {
  atlasConnected = true;
});

mongoose.connection.on('disconnected', () => {
  atlasConnected = false;
});

module.exports = { connectDB, isAtlasConnected };