const rateLimit = require('express-rate-limit');

// Strict — protects against brute-force login attempts.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again later.' },
});

// Looser — protects public write endpoints (contact form, testimonials) from spam
// while still allowing genuine visitors through comfortably.
const publicWriteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many submissions. Please try again later.' },
});

module.exports = { loginLimiter, publicWriteLimiter };
