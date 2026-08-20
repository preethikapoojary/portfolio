const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const Profile = require('../models/Profile');
const activityLogService = require('../services/activityLog.service');

const getProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.getSingleton();
  new ApiResponse(200, profile).send(res);
});

const updateProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.getSingleton();
  Object.assign(profile, req.body);
  await profile.save();

  activityLogService.record({
    adminId: req.admin._id,
    action: 'UPDATE',
    resource: 'Profile',
    resourceId: profile._id,
    description: 'Updated profile information',
  });

  new ApiResponse(200, profile, 'Profile updated').send(res);
});

module.exports = { getProfile, updateProfile };
