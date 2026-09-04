const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    try {
      console.log('[Blaze DB] Connecting to specified MongoDB URI...');
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[Blaze DB] Connected to MongoDB: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[Blaze DB] Could not connect to external MongoDB (${err.message}). Initializing embedded database fallback...`);
    }
  }

  // Fallback to in-memory MongoDB for seamless zero-config local dev & testing
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongod = await MongoMemoryServer.create();
    const memoryUri = mongod.getUri();
    console.log(`[Blaze DB] Starting embedded MongoDB server...`);
    const conn = await mongoose.connect(memoryUri);
    console.log(`[Blaze DB] Connected to embedded MongoDB successfully at ${memoryUri}`);
    return conn;
  } catch (memErr) {
    console.error(`[Blaze DB] Fatal: Failed to initialize MongoDB connection:`, memErr);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
  } catch (err) {
    console.error('[Blaze DB] Error during database disconnect:', err);
  }
};

module.exports = { connectDB, disconnectDB };
