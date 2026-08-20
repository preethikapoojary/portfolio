const mongoose = require('mongoose');

const codingProfileSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true, trim: true }, // free text — LeetCode, Codeforces, etc.
    username: { type: String, default: '' },
    profileUrl: { type: String, required: true },
    icon: { type: String, default: '' },
    stats: { type: mongoose.Schema.Types.Mixed, default: {} },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

codingProfileSchema.index({ order: 1 });

module.exports = mongoose.model('CodingProfile', codingProfileSchema);
