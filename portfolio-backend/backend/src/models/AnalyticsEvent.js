const mongoose = require('mongoose');

const analyticsEventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['page_view', 'project_view', 'resume_download'],
    },
    refId: { type: mongoose.Schema.Types.ObjectId, default: null }, // e.g. project _id
    visitorHash: { type: String, required: true }, // sha256(ip + user-agent) — no raw PII stored
    path: { type: String, default: '' },
  },
  { timestamps: true }
);

analyticsEventSchema.index({ type: 1, createdAt: -1 });
analyticsEventSchema.index({ visitorHash: 1, createdAt: -1 });
analyticsEventSchema.index({ refId: 1, type: 1 });

module.exports = mongoose.model('AnalyticsEvent', analyticsEventSchema);
