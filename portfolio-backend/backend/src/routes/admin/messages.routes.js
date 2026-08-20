const express = require('express');
const contactController = require('../../controllers/contact.controller');

const router = express.Router();

router.get('/', contactController.list);
router.patch('/:id/read', contactController.toggleRead);
router.delete('/:id', contactController.remove);

module.exports = router;
