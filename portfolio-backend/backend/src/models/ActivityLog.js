const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    action: {
      type: String,
      required: true,
      enum: ['CREATE', 'UPDATE', 'DELETE', 'REORDER', 'LOGIN', 'LOGOUT', 'APPROVE', 'REJECT', 'ACTIVATE'],
    },
    resource: { type: String, required: true }, // e.g. "Project", "Profile", "SiteSettings"
    resourceId: { type: mongoose.Schema.Types.ObjectId, default: null },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

activityLogSchema.index({ resource: 1, createdAt: -1 });
activityLogSchema.index({ createdAt: -1 });

// No update/delete statics exposed deliberately — this collection is append-only.
module.exports = mongoose.model('ActivityLog', activityLogSchema);
