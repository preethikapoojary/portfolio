const express = require('express');
const blogController = require('../../controllers/blog.controller');

const router = express.Router();

router.get('/', blogController.adminList);
router.get('/:id', blogController.adminGetOne);
router.post('/', blogController.create);
router.put('/:id', blogController.update);
router.delete('/:id', blogController.remove);
router.patch('/reorder', blogController.reorder);
router.patch('/:id/visibility', blogController.toggleVisibility);

module.exports = router;
