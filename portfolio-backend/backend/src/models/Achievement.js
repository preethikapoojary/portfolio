const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    date: { type: Date, default: null },
    icon: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

achievementSchema.index({ order: 1 });

module.exports = mongoose.model('Achievement', achievementSchema);
