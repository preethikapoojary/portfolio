const express = require('express');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');
const trackAnalytics = require('../middlewares/analyticsTracker.middleware');

const router = express.Router();

// ---------------- PUBLIC (read-only, unauthenticated) ----------------
const publicRouter = express.Router();
publicRouter.use(trackAnalytics('page_view'));

publicRouter.use('/profile', require('./public/profile.routes'));
publicRouter.use('/settings', require('./public/settings.routes'));
publicRouter.use('/sections', require('./public/sections.routes'));
publicRouter.use('/education', require('./public/education.routes'));
publicRouter.use('/skills', require('./public/skills.routes'));
publicRouter.use('/projects', require('./public/projects.routes'));
publicRouter.use('/experience', require('./public/experience.routes'));
publicRouter.use('/certificates', require('./public/certificates.routes'));
publicRouter.use('/achievements', require('./public/achievements.routes'));
publicRouter.use('/gallery', require('./public/gallery.routes'));
publicRouter.use('/blog', require('./public/blog.routes'));
publicRouter.use('/coding-profiles', require('./public/coding-profiles.routes'));
publicRouter.use('/resume', require('./public/resume.routes'));
publicRouter.use('/contact', require('./public/contact.routes'));
publicRouter.use('/testimonials', require('./public/testimonials.routes'));
// Still pending: /github — not part of this phase's scope.


router.use('/', publicRouter);

// ---------------- ADMIN (protected) ----------------
const adminRouter = express.Router();

// Auth routes are mounted before the guard since /login and /refresh must
// be reachable without an existing valid token.
adminRouter.use('/auth', require('./admin/auth.routes'));

// Everything below this line requires a valid admin JWT.
adminRouter.use(verifyToken, requireAdmin);

adminRouter.use('/profile', require('./admin/profile.routes'));
adminRouter.use('/settings', require('./admin/settings.routes'));
adminRouter.use('/sections', require('./admin/section.routes'));
adminRouter.use('/dashboard', require('./admin/dashboard.routes'));
adminRouter.use('/notifications', require('./admin/notifications.routes'));
adminRouter.use('/activity-log', require('./admin/activityLog.routes'));
adminRouter.use('/education', require('./admin/education.routes'));
adminRouter.use('/skills', require('./admin/skill.routes'));
adminRouter.use('/projects', require('./admin/project.routes'));
adminRouter.use('/experience', require('./admin/experience.routes'));
adminRouter.use('/certificates', require('./admin/certificate.routes'));
adminRouter.use('/achievements', require('./admin/achievement.routes'));
adminRouter.use('/gallery', require('./admin/gallery.routes'));
adminRouter.use('/blog', require('./admin/blog.routes'));
adminRouter.use('/coding-profiles', require('./admin/codingProfile.routes'));
adminRouter.use('/resume', require('./admin/resume.routes'));
adminRouter.use('/upload', require('./admin/upload.routes'));
adminRouter.use('/messages', require('./admin/messages.routes'));
adminRouter.use('/testimonials', require('./admin/testimonial.routes'));

router.use('/admin', adminRouter);

module.exports = router;
