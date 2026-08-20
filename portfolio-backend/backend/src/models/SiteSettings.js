const mongoose = require('mongoose');
const { mediaSchema, seoSchema } = require('./shared.schemas');

const navItemSchema = new mongoose.Schema(
  {
    label: String,
    path: String,
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { _id: true }
);

const footerLinkSchema = new mongoose.Schema({ label: String, url: String }, { _id: false });

const siteSettingsSchema = new mongoose.Schema(
  {
    logo: { type: mediaSchema, default: () => ({}) },
    favicon: { type: mediaSchema, default: () => ({}) },

    theme: {
      primaryColor: { type: String, default: '#6366F1' },
      secondaryColor: { type: String, default: '#8B5CF6' },
      accentColor: { type: String, default: '#F59E0B' },
      fontFamily: { type: String, default: 'Inter' },
    },

    footerText: { type: String, default: '' },
    footerLinks: { type: [footerLinkSchema], default: [] },
    navItems: { type: [navItemSchema], default: [] },

    seo: { type: seoSchema, default: () => ({}) },

    hero: {
      headline: { type: String, default: '' },
      subheadline: { type: String, default: '' },
      ctaText: { type: String, default: '' },
      ctaLink: { type: String, default: '' },
      backgroundImage: { type: mediaSchema, default: () => ({}) },
    },

    githubUsername: { type: String, default: '' },
  },
  { timestamps: true }
);

siteSettingsSchema.statics.getSingleton = async function getSingleton() {
  let doc = await this.findOne();
  if (!doc) doc = await this.create({});
  return doc;
};

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
