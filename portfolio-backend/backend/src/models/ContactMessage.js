const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    subject: { type: String, default: '' },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

contactMessageSchema.index({ isRead: 1, createdAt: -1 });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
