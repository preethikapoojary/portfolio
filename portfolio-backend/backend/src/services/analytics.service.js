const crypto = require('crypto');
const AnalyticsEvent = require('../models/AnalyticsEvent');

/**
 * Hash the visitor identity instead of storing raw IP — keeps this
 * privacy-friendly (no PII at rest) while still allowing de-duplication
 * of "unique visitors" for a given day.
 */
function hashVisitor(ip, userAgent) {
  return crypto.createHash('sha256').update(`${ip}::${userAgent}`).digest('hex');
}

/**
 * Fire-and-forget event recording. Never throws into the caller — an
 * analytics failure must never break the public site.
 */
async function recordEvent({ type, refId = null, ip, userAgent, path = '' }) {
  try {
    const visitorHash = hashVisitor(ip, userAgent);
    await AnalyticsEvent.create({ type, refId, visitorHash, path });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[Analytics] failed to record event:', err.message);
  }
}

async function getDashboardStats() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [totalVisitorsAgg, todayVisitorsAgg, resumeDownloads, topProjects] = await Promise.all([
    AnalyticsEvent.aggregate([{ $group: { _id: '$visitorHash' } }, { $count: 'count' }]),
    AnalyticsEvent.aggregate([
      { $match: { createdAt: { $gte: startOfToday } } },
      { $group: { _id: '$visitorHash' } },
      { $count: 'count' },
    ]),
    AnalyticsEvent.countDocuments({ type: 'resume_download' }),
    AnalyticsEvent.aggregate([
      { $match: { type: 'project_view' } },
      { $group: { _id: '$refId', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'projects', localField: '_id', foreignField: '_id', as: 'project' } },
      { $unwind: '$project' },
      { $project: { views: 1, title: '$project.title', slug: '$project.slug' } },
    ]),
  ]);

  return {
    totalVisitors: totalVisitorsAgg[0]?.count || 0,
    todayVisitors: todayVisitorsAgg[0]?.count || 0,
    resumeDownloads,
    topProjects,
  };
}

module.exports = { recordEvent, getDashboardStats, hashVisitor };
