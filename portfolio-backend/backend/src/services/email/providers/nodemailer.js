const nodemailer = require('nodemailer');
const { env } = require('../../../config/env');

let transporter = null;

function getTransporter() {
  if (!env.email.gmailUser || !env.email.gmailAppPassword) {
    throw new Error(
      'GMAIL_USER or GMAIL_APP_PASSWORD environment variable is missing on the backend.'
    );
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: env.email.gmailUser,
        pass: env.email.gmailAppPassword, // Gmail App Password, not the account password
      },
    });
  }
  return transporter;
}

async function sendEmail({ to, subject, html }) {
  if (!env.email.gmailUser || !env.email.gmailAppPassword) {
    throw new Error(
      'GMAIL_USER or GMAIL_APP_PASSWORD environment variable is missing on the backend.'
    );
  }
  const info = await getTransporter().sendMail({
    from: `"Portfolio Site" <${env.email.gmailUser}>`,
    to,
    subject,
    html,
  });
  return { id: info.messageId };
}

module.exports = { sendEmail };
