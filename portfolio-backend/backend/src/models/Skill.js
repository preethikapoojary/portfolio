const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, default: 'General', trim: true }, // free text — new categories need no schema change
    proficiency: { type: Number, min: 0, max: 100, default: 80 },
    icon: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

skillSchema.index({ order: 1 });

module.exports = mongoose.model('Skill', skillSchema);
