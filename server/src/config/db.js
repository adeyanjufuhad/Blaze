const mongoose = require('mongoose');

const MAX_RETRIES = 5;
const RETRY_INTERVAL_MS = 3000;

let mongod = null;

/**
 * Connect to MongoDB with automated retry logic and exponential/fixed backoff
 */
const connectWithRetry = async (uri, attempt = 1) => {
  try {
    console.log(`[Blaze DB] Connecting to MongoDB (Attempt ${attempt}/${MAX_RETRIES})...`);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log('MongoDB connected');
    console.log(`[Blaze DB] Connection host: ${conn.connection.host} | DB: ${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error(`[Blaze DB] Connection failed on attempt ${attempt}: ${err.message}`);

    if (attempt < MAX_RETRIES) {
      console.log(`[Blaze DB] Retrying connection in ${RETRY_INTERVAL_MS / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL_MS));
      return connectWithRetry(uri, attempt + 1);
    }

    console.error('[Blaze DB] Fatal: Failed to connect to MongoDB Atlas after maximum retry attempts.');
    console.error(err);
    process.exit(1);
  }
};

/**
 * Primary database connection initializer
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    return connectWithRetry(uri.trim());
  }

  // Graceful in-memory fallback for local dev when MONGODB_URI is not yet provided
  console.warn('[Blaze DB] Notice: MONGODB_URI is not set in .env. Initializing local in-memory MongoDB fallback...');
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongod = await MongoMemoryServer.create();
    const memoryUri = mongod.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log('MongoDB connected');
    console.log(`[Blaze DB] Connected to embedded in-memory database at ${memoryUri}`);
    return conn;
  } catch (memErr) {
    console.error('[Blaze DB] Fatal: Failed to initialize in-memory MongoDB connection:', memErr);
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

// Monitor live connection lifecycle events
mongoose.connection.on('disconnected', () => {
  console.warn('[Blaze DB] MongoDB connection dropped / disconnected.');
});

mongoose.connection.on('error', (err) => {
  console.error('[Blaze DB] MongoDB runtime error:', err.message);
});

module.exports = { connectDB, disconnectDB };
