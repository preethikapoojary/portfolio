const mongoose = require('mongoose');
const { mediaSchema } = require('./shared.schemas');

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    location: { type: String, default: '' },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null }, // ignored for display when isCurrent is true
    isCurrent: { type: Boolean, default: false },
    description: { type: String, default: '' }, // short professional overview
    responsibilities: { type: [String], default: [] }, // "What I worked on" bullet list
    technologies: { type: [String], default: [] },
    proofFile: { type: mediaSchema, default: () => ({}) }, // optional certificate/proof image
    proofUrl: { type: String, default: '' }, // optional certificate/proof link (alternative to upload)
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

experienceSchema.index({ order: 1 });

module.exports = mongoose.model('Experience', experienceSchema);
