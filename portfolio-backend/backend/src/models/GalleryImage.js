const mongoose = require('mongoose');
const { mediaSchema } = require('./shared.schemas');

const galleryImageSchema = new mongoose.Schema(
  {
    image: { type: mediaSchema, required: true },
    caption: { type: String, default: '' },
    category: { type: String, default: 'General', trim: true },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

galleryImageSchema.index({ order: 1 });

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
