const mongoose = require('mongoose');

const systemNotificationSchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, // e.g. "github_sync_failed", "storage_warning"
    message: { type: String, required: true },
    link: { type: String, default: null },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

systemNotificationSchema.index({ isRead: 1, createdAt: -1 });

module.exports = mongoose.model('SystemNotification', systemNotificationSchema);
