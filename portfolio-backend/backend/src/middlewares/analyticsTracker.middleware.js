const analyticsService = require('../services/analytics.service');

/**
 * Mount with a specific `type` on the public routes worth tracking, e.g.:
 *   router.get('/', trackAnalytics('page_view'), controller.list)
 *   router.get('/:slug', trackAnalytics('project_view', (req, doc) => doc._id), controller.getOne)
 *
 * Runs the DB write without awaiting it in the request/response cycle —
 * analytics must never add latency to, or risk breaking, a real page load.
 */
function trackAnalytics(type, resolveRefId = null) {
  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Attach a small helper the controller can call once it has the resolved
    // resource (e.g. after loading a project by slug), or fire immediately
    // if no resolver is needed (generic page views).
    res.locals.recordAnalytics = (refId = null) => {
      analyticsService.recordEvent({ type, refId, ip, userAgent, path: req.originalUrl });
    };

    if (!resolveRefId) {
      res.locals.recordAnalytics();
    }

    next();
  };
}

module.exports = trackAnalytics;
