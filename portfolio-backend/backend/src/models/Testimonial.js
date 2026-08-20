const mongoose = require('mongoose');
const { mediaSchema } = require('./shared.schemas');

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, default: '' },
    company: { type: String, default: '' },
    email: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    message: { type: String, required: true },
    avatar: { type: mediaSchema, default: () => ({}) },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    // Independent of status: lets an already-approved testimonial be
    // temporarily hidden from the public site without losing its approval.
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

testimonialSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Testimonial', testimonialSchema);
