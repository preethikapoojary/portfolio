const express = require('express');
const contactController = require('../../controllers/contact.controller');
const { publicWriteLimiter } = require('../../middlewares/rateLimit.middleware');

const router = express.Router();

router.post('/', publicWriteLimiter, contactController.submit);

module.exports = router;
