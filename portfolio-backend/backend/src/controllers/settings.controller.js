const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const SiteSettings = require('../models/SiteSettings');
const activityLogService = require('../services/activityLog.service');

const getSettings = asyncHandler(async (req, res) => {
  const settings = await SiteSettings.getSingleton();
  new ApiResponse(200, settings).send(res);
});

const updateSettings = asyncHandler(async (req, res) => {
  const settings = await SiteSettings.getSingleton();

  // Deep-merge nested objects (theme, hero, seo) rather than overwriting
  // them wholesale, so a partial update (e.g. just primaryColor) doesn't
  // wipe out sibling fields the admin didn't send.
  ['theme', 'hero', 'seo'].forEach((key) => {
    if (req.body[key]) {
      settings[key] = { ...settings[key]?.toObject?.() ?? settings[key], ...req.body[key] };
    }
  });

  Object.entries(req.body).forEach(([key, value]) => {
    if (!['theme', 'hero', 'seo'].includes(key)) settings[key] = value;
  });

  await settings.save();

  activityLogService.record({
    adminId: req.admin._id,
    action: 'UPDATE',
    resource: 'SiteSettings',
    resourceId: settings._id,
    description: 'Updated site settings',
  });

  new ApiResponse(200, settings, 'Settings updated').send(res);
});

module.exports = { getSettings, updateSettings };
