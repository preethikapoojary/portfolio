const mongoose = require('mongoose');

// Reused wherever an image/file is stored (Cloudinary-backed).
const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, default: null },
    publicId: { type: String, default: null }, // needed to delete from Cloudinary later
    alt: { type: String, default: '' },
  },
  { _id: false }
);

// Reused on Project, BlogPost, SiteSettings for per-entity SEO overrides.
const seoSchema = new mongoose.Schema(
  {
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    ogImage: { type: mediaSchema, default: () => ({}) },
  },
  { _id: false }
);

module.exports = { mediaSchema, seoSchema };
