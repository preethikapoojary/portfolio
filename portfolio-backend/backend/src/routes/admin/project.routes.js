const express = require('express');
const projectController = require('../../controllers/project.controller');

const router = express.Router();

router.get('/', projectController.adminList);
router.get('/:id', projectController.adminGetOne);
router.post('/', projectController.create);
router.put('/:id', projectController.update);
router.delete('/:id', projectController.remove);
router.patch('/reorder', projectController.reorder);
router.patch('/:id/visibility', projectController.toggleVisibility);

module.exports = router;
