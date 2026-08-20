const express = require('express');
const resumeController = require('../../controllers/resume.controller');
const { uploadDocument } = require('../../middlewares/upload.middleware');

const router = express.Router();

router.get('/', resumeController.list);
router.post('/', uploadDocument.single('file'), resumeController.upload);
router.patch('/:id/activate', resumeController.activate);
router.delete('/:id', resumeController.remove);

module.exports = router;
