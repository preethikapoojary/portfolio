const mongoose = require('mongoose');
const { mediaSchema, seoSchema } = require('./shared.schemas');

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, default: '' },
    content: { type: String, default: '' }, // TipTap-authored HTML
    coverImage: { type: mediaSchema, default: () => ({}) },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    category: { type: String, default: 'General', trim: true },
    tags: { type: [String], default: [] },
    seo: { type: seoSchema, default: () => ({}) },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

module.exports = mongoose.model('BlogPost', blogPostSchema);
