const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin'], default: 'admin' },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true }
);

adminSchema.methods.comparePassword = function comparePassword(plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

adminSchema.statics.hashPassword = function hashPassword(plain) {
  return bcrypt.hash(plain, 12);
};

module.exports = mongoose.model('Admin', adminSchema);
