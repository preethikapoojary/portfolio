const express = require('express');
const projectController = require('../../controllers/project.controller');
const trackAnalytics = require('../../middlewares/analyticsTracker.middleware');

const router = express.Router();

router.get('/', projectController.publicList);
router.get('/:slug', trackAnalytics('project_view', true), projectController.publicGetBySlug);

module.exports = router;
