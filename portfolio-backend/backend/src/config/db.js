const mongoose = require('mongoose');
const { env } = require('./env');

async function connectDB() {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(env.mongoUri);
    // eslint-disable-next-line no-console
    console.log('[DB] MongoDB Atlas connected');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[DB] Connection failed:', err.message);
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    // eslint-disable-next-line no-console
    console.warn('[DB] MongoDB disconnected');
  });
}

module.exports = connectDB;
