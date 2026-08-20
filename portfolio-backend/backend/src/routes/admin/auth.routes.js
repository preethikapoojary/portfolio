const express = require('express');
const authController = require('../../controllers/auth.controller');
const { verifyToken } = require('../../middlewares/auth.middleware');
const { loginLimiter } = require('../../middlewares/rateLimit.middleware');

const router = express.Router();

router.post('/login', loginLimiter, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', verifyToken, authController.logout);
router.get('/me', verifyToken, authController.me);

module.exports = router;
