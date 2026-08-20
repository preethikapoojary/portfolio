const SystemNotification = require('../models/SystemNotification');
const ContactMessage = require('../models/ContactMessage');
const Testimonial = require('../models/Testimonial');

/**
 * create() is the extensibility hook mentioned in the architecture doc:
 * any future feature can raise a dashboard notification with one line,
 * e.g. notificationService.create({ type: 'github_sync_failed', message: '...' }).
 */
async function create({ type, message, link = null }) {
  return SystemNotification.create({ type, message, link });
}

/**
 * Powers the dashboard notification badges. Counts are computed live from
 * existing collections rather than duplicated/cached, since these are cheap
 * countDocuments queries at personal-portfolio scale.
 */
async function getSummary() {
  const [unreadMessages, pendingTestimonials, systemNotifications] = await Promise.all([
    ContactMessage.countDocuments({ isRead: false }),
    Testimonial.countDocuments({ status: 'pending' }),
    SystemNotification.countDocuments({ isRead: false }),
  ]);
  return { unreadMessages, pendingTestimonials, systemNotifications };
}

module.exports = { create, getSummary };
