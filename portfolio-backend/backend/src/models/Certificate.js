const mongoose = require('mongoose');
const { mediaSchema } = require('./shared.schemas');

const certificateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, default: '' },
    image: { type: mediaSchema, default: () => ({}) },
    credentialUrl: { type: String, default: '' },
    issueDate: { type: Date, default: null },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

certificateSchema.index({ order: 1 });

module.exports = mongoose.model('Certificate', certificateSchema);
