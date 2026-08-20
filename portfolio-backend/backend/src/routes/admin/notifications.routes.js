const express = require('express');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const notificationService = require('../../services/notification.service');
const SystemNotification = require('../../models/SystemNotification');

const router = express.Router();

// Powers the dashboard notification badges (unread messages, pending
// testimonials, system notifications). Polled by the admin frontend.
router.get(
  '/summary',
  asyncHandler(async (req, res) => {
    const summary = await notificationService.getSummary();
    new ApiResponse(200, summary).send(res);
  })
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const items = await SystemNotification.find().sort({ createdAt: -1 }).limit(50);
    new ApiResponse(200, items).send(res);
  })
);

router.patch(
  '/:id/read',
  asyncHandler(async (req, res) => {
    const doc = await SystemNotification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    new ApiResponse(200, doc, 'Marked as read').send(res);
  })
);

module.exports = router;
