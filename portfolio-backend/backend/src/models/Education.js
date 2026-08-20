const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true, trim: true },
    degree: { type: String, default: '' },
    fieldOfStudy: { type: String, default: '' },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    grade: { type: String, default: '' },
    description: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

educationSchema.index({ order: 1 });

module.exports = mongoose.model('Education', educationSchema);
