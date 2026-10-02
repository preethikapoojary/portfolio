/**
 * Centralized environment access + boot-time validation.
 *
 * Why: failing fast at startup with a clear message ("JWT_ACCESS_SECRET is missing")
 * is far better than the app booting successfully and then throwing a confusing
 * error deep inside a request handler the first time that variable is used.
 */
require('dotenv').config();

const REQUIRED_VARS = [
  'MONGO_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'CLIENT_URL',
  'ADMIN_URL',
];

function validateEnv() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    // eslint-disable-next-line no-console
    console.error(
      `\n[BOOT ERROR] Missing required environment variables: ${missing.join(', ')}\n` +
        'Copy .env.example to .env and fill these in before starting the server.\n'
    );
    process.exit(1);
  }
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  isProduction: process.env.NODE_ENV === 'production',

  mongoUri: process.env.MONGO_URI,

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  clientUrl: process.env.CLIENT_URL,
  adminUrl: process.env.ADMIN_URL,

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  email: {
    provider: process.env.EMAIL_PROVIDER || 'nodemailer',
    gmailUser: process.env.GMAIL_USER,
    gmailAppPassword: process.env.GMAIL_APP_PASSWORD,
    resendApiKey: process.env.RESEND_API_KEY,
    resendFromEmail: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
    contactNotifyTo: process.env.CONTACT_NOTIFY_TO,
  },

  github: {
    username: process.env.GITHUB_USERNAME,
    token: process.env.GITHUB_TOKEN,
  },

  turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
};

module.exports = { env, validateEnv };
