const { Resend } = require('resend');
const { env } = require('../../../config/env');

let resendClient = null;

function getResendClient() {
  if (!env.email.resendApiKey) {
    throw new Error(
      'RESEND_API_KEY environment variable is missing on the backend.'
    );
  }
  if (!resendClient) {
    resendClient = new Resend(env.email.resendApiKey);
  }
  return resendClient;
}

async function sendEmail({ to, subject, html }) {
  const client = getResendClient();
  const from = env.email.resendFromEmail || 'onboarding@resend.dev';

  const { data, error } = await client.emails.send({
    from,
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message || JSON.stringify(error)}`);
  }

  return { id: data?.id };
}

module.exports = { sendEmail };
