const mongoose = require('mongoose');
const { mediaSchema } = require('./shared.schemas');

const resumeVersionSchema = new mongoose.Schema(
  {
    file: { type: mediaSchema, required: true },
    label: { type: String, default: '' },
    isActive: { type: Boolean, default: false },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

resumeVersionSchema.index({ isActive: 1 });

module.exports = mongoose.model('ResumeVersion', resumeVersionSchema);
