const express = require('express');
const blogController = require('../../controllers/blog.controller');

const router = express.Router();

router.get('/', blogController.publicList);
router.get('/:slug', blogController.publicGetBySlug);

module.exports = router;
