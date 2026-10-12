const mongoose = require('mongoose');
const { env } = require('./env');

let cachedPromise = null;

async function connectDB() {
  // If already connected, return existing connection immediately
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  // If a connection is already in progress, reuse the existing promise
  if (!cachedPromise) {
    mongoose.set('strictQuery', true);
    cachedPromise = mongoose
      .connect(env.mongoUri, {
        serverSelectionTimeoutMS: 5000,
      })
      .then((m) => {
        // eslint-disable-next-line no-console
        console.log('[DB] MongoDB Atlas connected');
        return m;
      })
      .catch((err) => {
        cachedPromise = null;
        // eslint-disable-next-line no-console
        console.error('[DB] Connection failed:', err.message);
        throw err;
      });
  }

  return cachedPromise;
}

module.exports = connectDB;
