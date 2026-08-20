const express = require('express');
const testimonialController = require('../../controllers/testimonial.controller');

const router = express.Router();

router.get('/', testimonialController.adminList);
router.put('/:id', testimonialController.update);
router.delete('/:id', testimonialController.remove);
router.patch('/:id/approve', testimonialController.approve);
router.patch('/:id/reject', testimonialController.reject);
router.patch('/:id/visibility', testimonialController.toggleVisibility);

module.exports = router;
