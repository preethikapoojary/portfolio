const { env } = require('../../config/env');

/**
 * Provider-agnostic email facade. Every caller in the app (contact form
 * notifications, testimonial alerts, etc.) only ever imports this file and
 * calls sendEmail({ to, subject, html }) — never a specific provider.
 *
 * To switch providers later (e.g. to Resend): add
 * `services/email/providers/resend.js` implementing the same sendEmail
 * signature, then change EMAIL_PROVIDER=resend in .env. Nothing else in
 * the codebase changes.
 */
const providers = {
  nodemailer: () => require('./providers/nodemailer'),
  resend: () => require('./providers/resend'),
};

function getProvider() {
  const factory = providers[env.email.provider];
  if (!factory) {
    throw new Error(`Unknown EMAIL_PROVIDER "${env.email.provider}"`);
  }
  return factory();
}

async function sendEmail(payload) {
  return getProvider().sendEmail(payload);
}

module.exports = { sendEmail };
