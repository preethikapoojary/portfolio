const ActivityLog = require('../models/ActivityLog');

/**
 * The only place that writes to ActivityLog. Called automatically by the
 * CRUD factory for standard actions, and directly by controllers for
 * special actions (login, testimonial approve/reject, resume activate)
 * that don't go through the generic factory.
 *
 * Deliberately fire-and-forget from the caller's perspective where possible —
 * logging failures must never break the admin's actual request.
 */
async function record({ adminId, action, resource, resourceId = null, description }) {
  try {
    await ActivityLog.create({ adminId, action, resource, resourceId, description });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[ActivityLog] failed to record entry:', err.message);
  }
}

module.exports = { record };
