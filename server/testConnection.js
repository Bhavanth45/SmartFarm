const dotenv = require('dotenv');
const mongoose = require('mongoose');
const dns = require('dns');

dotenv.config();

console.log('--- SMARTFARM MONGODB CONNECTION DIAGNOSTIC ---');
console.log('Node.js Version:', process.version);
console.log('MONGO_URI from .env:', process.env.MONGO_URI ? process.env.MONGO_URI.replace(/:([^:@]+)@/, ':****@') : 'NOT FOUND');

const test = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error('❌ ERROR: MONGO_URI is missing in server/.env!');
      process.exit(1);
    }

    // Step 1: Test DNS resolution
    const hostMatch = uri.match(/@([^/?]+)/);
    if (hostMatch && hostMatch[1]) {
      const host = hostMatch[1];
      console.log(`[Step 1] Testing DNS for cluster host: ${host}...`);
      dns.resolveSrv(`_mongodb._tcp.${host}`, (err, addresses) => {
        if (err) {
          console.warn(`⚠️ Warning: DNS SRV lookup failed (${err.code}). Your ISP DNS might be blocking SRV records.`);
        } else {
          console.log(`✅ DNS SRV lookup succeeded! Found ${addresses.length} MongoDB shard hosts.`);
        }
      });
    }

    // Step 2: Attempt Mongoose Connection
    console.log('[Step 2] Attempting Mongoose connection to Atlas (30s timeout)...');
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
      family: 4
    });

    console.log('\n🎉 SUCCESS! Connected to MongoDB Atlas Cloud Database!');
    console.log('Host:', conn.connection.host);
    console.log('Database:', conn.connection.name);
    console.log('Connection State:', conn.connection.readyState === 1 ? 'Connected (1)' : conn.connection.readyState);

    await mongoose.disconnect();
    console.log('[Done] Test completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ CONNECTION FAILED:');
    console.error('Error Name:', err.name);
    console.error('Error Message:', err.message);

    if (err.message.includes('Could not connect to any servers') || err.name === 'MongooseServerSelectionError') {
      console.error('\n👉 SOLUTION:');
      console.error('1. Go to MongoDB Atlas (cloud.mongodb.com)');
      console.error('2. Click "Network Access" in the left sidebar.');
      console.error('3. Make sure IP "0.0.0.0/0" is added and status says "Active".');
      console.error('4. If status still says "Pending", wait 1-2 minutes for Atlas to finish deploying.');
    } else if (err.message.includes('Authentication failed') || err.message.includes('bad auth')) {
      console.error('\n👉 SOLUTION:');
      console.error('Password or username is incorrect in server/.env.');
    }
    process.exit(1);
  }
};

test();
