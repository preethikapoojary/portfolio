const mongoose = require('mongoose');

/**
 * We store a hash of the refresh token, not the token itself, so a database
 * leak alone can't be used to impersonate the admin. Each row is revocable
 * independently, which enables a future "log out of all devices" feature
 * without any schema change.
 */
const refreshTokenSchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true, index: true },
    tokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    revoked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Mongo TTL index — automatically deletes expired tokens, no cleanup job needed.
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
