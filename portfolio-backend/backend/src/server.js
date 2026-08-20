const { env, validateEnv } = require('./config/env');

validateEnv(); // fail fast if required env vars are missing

const app = require('./app');
const connectDB = require('./config/db');
const Section = require('./models/Section');

async function bootstrap() {
  await connectDB();

  // Ensures every known public section (Home, About, Projects, ...) has a
  // row on first boot / a fresh database, so the public site and admin
  // dashboard always have something sensible to render and reorder.
  await Section.ensureSeeded();

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`[Server] Running on port ${env.port} in ${env.nodeEnv} mode`);
  });
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[Server] Failed to start:', err);
  process.exit(1);
});
