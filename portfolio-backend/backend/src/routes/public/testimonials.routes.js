const express = require('express');
const testimonialController = require('../../controllers/testimonial.controller');
const { publicWriteLimiter } = require('../../middlewares/rateLimit.middleware');
const { uploadImage } = require('../../middlewares/upload.middleware');
const { verifyTurnstile } = require('../../middlewares/turnstile.middleware');
const { verifyGoogleToken } = require('../../middlewares/googleAuth.middleware');

const router = express.Router();

router.get('/', testimonialController.publicList);
router.post('/upload', publicWriteLimiter, uploadImage.single('file'), testimonialController.uploadAvatar);
router.post('/', publicWriteLimiter, verifyTurnstile, verifyGoogleToken, testimonialController.submit);

module.exports = router;
