const mongoose = require('mongoose');
const { mediaSchema } = require('./shared.schemas');

// Sub-schema for related projects attached to an experience entry.
const relatedProjectSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    liveDemoUrl: { type: String, default: '' },
  },
  { _id: false }
);

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

    // ---- Detail-page fields (all optional, backward-compatible) ----
    githubUrls: { type: [String], default: [] }, // multiple repository links
    relatedProjects: { type: [relatedProjectSchema], default: [] }, // projects done during this role
    projectReportUrl: { type: String, default: '' }, // external report link
    projectReportPdf: { type: mediaSchema, default: () => ({}) }, // uploaded PDF report
    certificate: { type: mediaSchema, default: () => ({}) }, // internship/work certificate
    attachments: { type: [mediaSchema], default: [] }, // supporting images/documents

    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

experienceSchema.index({ order: 1 });

module.exports = mongoose.model('Experience', experienceSchema);
