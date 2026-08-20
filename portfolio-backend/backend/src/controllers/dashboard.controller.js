const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const analyticsService = require('../services/analytics.service');
const notificationService = require('../services/notification.service');

const getStats = asyncHandler(async (req, res) => {
  const [analytics, notifications] = await Promise.all([
    analyticsService.getDashboardStats(),
    notificationService.getSummary(),
  ]);
  new ApiResponse(200, { analytics, notifications }).send(res);
});

module.exports = { getStats };
