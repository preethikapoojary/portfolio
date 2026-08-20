const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { env } = require('../config/env');
const RefreshToken = require('../models/RefreshToken');

function signAccessToken(admin) {
  return jwt.sign({ sub: admin._id.toString(), role: admin.role }, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn,
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, env.jwt.accessSecret);
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function msFromExpiryString(expiresIn) {
  // Supports simple "15m" / "7d" style strings used elsewhere in this project.
  const match = /^(\d+)([smhd])$/.exec(expiresIn);
  if (!match) return 15 * 60 * 1000;
  const value = Number(match[1]);
  const unit = match[2];
  const unitMs = { s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 };
  return value * unitMs[unit];
}

/**
 * Issues a new refresh token, storing only its hash in the DB. The raw
 * token is returned once, to be set as an httpOnly cookie — it is never
 * persisted in plaintext, so a DB leak alone can't be used to authenticate.
 */
async function issueRefreshToken(adminId) {
  const rawToken = crypto.randomBytes(48).toString('hex');
  const expiresAt = new Date(Date.now() + msFromExpiryString(env.jwt.refreshExpiresIn));

  await RefreshToken.create({
    adminId,
    tokenHash: hashToken(rawToken),
    expiresAt,
  });

  return { rawToken, expiresAt };
}

/**
 * Validates a raw refresh token from the cookie against the stored hash,
 * rejecting it if expired or already revoked.
 */
async function verifyRefreshToken(rawToken) {
  const tokenHash = hashToken(rawToken);
  const record = await RefreshToken.findOne({ tokenHash, revoked: false });
  if (!record) return null;
  if (record.expiresAt < new Date()) return null;
  return record;
}

async function revokeRefreshToken(rawToken) {
  const tokenHash = hashToken(rawToken);
  await RefreshToken.updateOne({ tokenHash }, { revoked: true });
}

async function revokeAllForAdmin(adminId) {
  await RefreshToken.updateMany({ adminId, revoked: false }, { revoked: true });
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
  issueRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
  revokeAllForAdmin,
};
