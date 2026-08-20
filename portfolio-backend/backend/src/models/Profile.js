const mongoose = require('mongoose');
const { mediaSchema } = require('./shared.schemas');

const socialLinkSchema = new mongoose.Schema(
  { platform: String, url: String, icon: String },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    title: { type: String, default: '' },
    aboutMe: { type: String, default: '' },
    careerObjective: { type: String, default: '' },
    profilePhoto: { type: mediaSchema, default: () => ({}) },
    coverBanner: { type: mediaSchema, default: () => ({}) },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    socialLinks: { type: [socialLinkSchema], default: [] },
  },
  { timestamps: true }
);

/**
 * Singleton helper: there is always exactly one Profile document.
 * Rather than trusting callers to know the id, this always finds-or-creates it.
 */
profileSchema.statics.getSingleton = async function getSingleton() {
  let doc = await this.findOne();
  if (!doc) doc = await this.create({});
  return doc;
};

module.exports = mongoose.model('Profile', profileSchema);
