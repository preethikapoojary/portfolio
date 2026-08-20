const mongoose = require('mongoose');
const { mediaSchema, seoSchema } = require('./shared.schemas');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    shortDescription: { type: String, default: '' },
    longDescription: { type: String, default: '' }, // TipTap-authored HTML
    coverImage: { type: mediaSchema, default: () => ({}) }, // separate from screenshots — the public project-card image
    screenshots: { type: [mediaSchema], default: [] },
    reportPdf: { type: mediaSchema, default: () => ({}) }, // optional project report/case-study PDF
    videoUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    liveDemoUrl: { type: String, default: '' },
    technologies: { type: [String], default: [] },
    category: { type: String, default: 'General', trim: true },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
    seo: { type: seoSchema, default: () => ({}) },
  },
  { timestamps: true }
);

projectSchema.index({ order: 1 });
projectSchema.index({ title: 'text', shortDescription: 'text' });

module.exports = mongoose.model('Project', projectSchema);
