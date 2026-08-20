const express = require('express');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const ActivityLog = require('../../models/ActivityLog');

const router = express.Router();

// Append-only: only a list endpoint is exposed. No update/delete routes,
// by design, so the audit trail can't be tampered with from the dashboard.
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 20);
    const query = {};
    if (req.query.resource) query.resource = req.query.resource;

    const [items, total] = await Promise.all([
      ActivityLog.find(query)
        .populate('adminId', 'name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      ActivityLog.countDocuments(query),
    ]);

    new ApiResponse(200, items, 'Activity log fetched', {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    }).send(res);
  })
);

module.exports = router;
