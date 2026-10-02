const { OAuth2Client } = require('google-auth-library');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { env } = require('../config/env');

const googleClient = new OAuth2Client();

/**
 * Verifies the Google ID token passed in request body (googleCredential).
 * Cryptographically verifies the token with Google and attaches verified user claims (name, email, picture) to req.googleUser.
 */
const verifyGoogleToken = asyncHandler(async (req, res, next) => {
  if (!env.googleClientId) {
    throw ApiError.internal('Google Sign-In is not configured on the server.');
  }

  const credential = req.body?.googleCredential;
  if (!credential) {
    throw ApiError.badRequest('Google Sign-In is required to submit a testimonial.');
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: env.googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email_verified) {
      throw ApiError.badRequest('Unverified or invalid Google account.');
    }

    req.googleUser = {
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
      sub: payload.sub,
    };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw ApiError.badRequest('Google authentication verification failed.');
  }

  next();
});

module.exports = { verifyGoogleToken };
