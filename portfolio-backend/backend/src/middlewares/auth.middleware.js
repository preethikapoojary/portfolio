const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const authService = require('../services/auth.service');
const Admin = require('../models/Admin');

/**
 * Verifies the access token on every protected admin route. This is the
 * real security boundary — frontend route guards are UX only, this
 * middleware is what actually enforces it server-side.
 */
const verifyToken = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) throw ApiError.unauthorized('Access token missing');

  let payload;
  try {
    payload = authService.verifyAccessToken(token);
  } catch (err) {
    throw ApiError.unauthorized('Access token invalid or expired');
  }

  const admin = await Admin.findById(payload.sub);
  if (!admin) throw ApiError.unauthorized('Admin account no longer exists');

  req.admin = admin;
  next();
});

const requireAdmin = (req, res, next) => {
  if (!req.admin || req.admin.role !== 'admin') {
    return next(ApiError.forbidden('Admin access required'));
  }
  next();
};

module.exports = { verifyToken, requireAdmin };
