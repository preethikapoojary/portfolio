const express = require('express');
const contactController = require('../../controllers/contact.controller');
const { publicWriteLimiter } = require('../../middlewares/rateLimit.middleware');
const { verifyTurnstile } = require('../../middlewares/turnstile.middleware');

const router = express.Router();

router.post('/', publicWriteLimiter, verifyTurnstile, contactController.submit);

module.exports = router;
