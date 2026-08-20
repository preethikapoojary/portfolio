const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Admin = require('../models/Admin');
const authService = require('../services/auth.service');
const activityLogService = require('../services/activityLog.service');
const { env } = require('../config/env');

const REFRESH_COOKIE_NAME = 'refreshToken';

function refreshCookieOptions(expiresAt) {
  return {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'lax',
    expires: expiresAt,
    path: '/api/v1/admin/auth', // scoped to auth routes only
    // domain intentionally omitted — no custom domain yet (see architecture §12).
    // When a custom domain spanning subdomains is attached, set domain: '.yoursite.com' here.
  };
}

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw ApiError.badRequest('Email and password are required');

  const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  if (!admin) throw ApiError.unauthorized('Invalid credentials');

  const valid = await admin.comparePassword(password);
  if (!valid) throw ApiError.unauthorized('Invalid credentials');

  admin.lastLoginAt = new Date();
  await admin.save();

  const accessToken = authService.signAccessToken(admin);
  const { rawToken, expiresAt } = await authService.issueRefreshToken(admin._id);

  res.cookie(REFRESH_COOKIE_NAME, rawToken, refreshCookieOptions(expiresAt));

  activityLogService.record({
    adminId: admin._id,
    action: 'LOGIN',
    resource: 'Admin',
    resourceId: admin._id,
    description: `${admin.name} logged in`,
  });

  new ApiResponse(200, {
    accessToken,
    admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
  }, 'Login successful').send(res);
});

const refresh = asyncHandler(async (req, res) => {
  const rawToken = req.cookies[REFRESH_COOKIE_NAME];
  if (!rawToken) throw ApiError.unauthorized('Refresh token missing');

  const record = await authService.verifyRefreshToken(rawToken);
  if (!record) throw ApiError.unauthorized('Refresh token invalid or expired');

  const admin = await Admin.findById(record.adminId);
  if (!admin) throw ApiError.unauthorized('Admin account no longer exists');

  const accessToken = authService.signAccessToken(admin);
  new ApiResponse(200, { accessToken }, 'Token refreshed').send(res);
});

const logout = asyncHandler(async (req, res) => {
  const rawToken = req.cookies[REFRESH_COOKIE_NAME];
  if (rawToken) await authService.revokeRefreshToken(rawToken);
  res.clearCookie(REFRESH_COOKIE_NAME, { path: '/api/v1/admin/auth' });

  if (req.admin) {
    activityLogService.record({
      adminId: req.admin._id,
      action: 'LOGOUT',
      resource: 'Admin',
      resourceId: req.admin._id,
      description: `${req.admin.name} logged out`,
    });
  }

  new ApiResponse(200, null, 'Logged out').send(res);
});

const me = asyncHandler(async (req, res) => {
  new ApiResponse(200, {
    id: req.admin._id,
    name: req.admin.name,
    email: req.admin.email,
    role: req.admin.role,
    lastLoginAt: req.admin.lastLoginAt,
  }).send(res);
});

module.exports = { login, refresh, logout, me };
