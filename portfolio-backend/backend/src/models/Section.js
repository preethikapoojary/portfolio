const mongoose = require('mongoose');

const SECTION_KEYS = [
  'home',
  'about',
  'education',
  'skills',
  'projects',
  'experience',
  'certificates',
  'achievements',
  'gallery',
  'blog',
  'testimonials',
  'resume',
  'github',
  'coding_profiles',
  'contact',
];

const sectionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, enum: SECTION_KEYS },
    label: { type: String, required: true },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

/**
 * Ensures every known section key has a row, so the public site always has
 * something to iterate over even on a freshly-seeded database.
 */
sectionSchema.statics.ensureSeeded = async function ensureSeeded() {
  const existingKeys = new Set((await this.find().select('key').lean()).map((s) => s.key));
  const toInsert = SECTION_KEYS.filter((key) => !existingKeys.has(key)).map((key, i) => ({
    key,
    label: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    order: existingKeys.size + i,
  }));
  if (toInsert.length) await this.insertMany(toInsert);
};

module.exports = mongoose.model('Section', sectionSchema);
module.exports.SECTION_KEYS = SECTION_KEYS;
