const express = require('express');
const resumeController = require('../../controllers/resume.controller');
const trackAnalytics = require('../../middlewares/analyticsTracker.middleware');

const router = express.Router();

router.get('/download', trackAnalytics('resume_download', true), resumeController.download);

module.exports = router;
