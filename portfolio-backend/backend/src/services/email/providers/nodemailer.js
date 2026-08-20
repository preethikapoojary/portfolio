const nodemailer = require('nodemailer');
const { env } = require('../../../config/env');

let transporter = null;

function getTransporter() {
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
  const info = await getTransporter().sendMail({
    from: `"Portfolio Site" <${env.email.gmailUser}>`,
    to,
    subject,
    html,
  });
  return { id: info.messageId };
}

module.exports = { sendEmail };
