const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { env } = require('../config/env');

/**
 * Cloudflare Turnstile server-side verification middleware.
 * Verifies the turnstileToken passed in request body against Cloudflare's siteverify API.
 */
const verifyTurnstile = asyncHandler(async (req, res, next) => {
  if (!env.turnstileSecretKey) {
    // If Turnstile secret key is not configured (e.g. local dev), pass through
    return next();
  }

  const token = req.body?.turnstileToken;
  if (!token) {
    throw ApiError.badRequest('Security verification token (turnstileToken) is required');
  }

  const remoteip = req.ip || (req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0].trim() : undefined);

  const formData = new URLSearchParams();
  formData.append('secret', env.turnstileSecretKey);
  formData.append('response', token);
  if (remoteip) {
    formData.append('remoteip', remoteip);
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!data.success) {
      throw ApiError.badRequest('Security verification failed. Please try again.');
    }
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw ApiError.badRequest('Security verification service error.');
  }

  next();
});

module.exports = { verifyTurnstile };
