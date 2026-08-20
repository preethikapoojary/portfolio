const express = require('express');
const uploadController = require('../../controllers/upload.controller');
const { uploadImage, uploadDocument } = require('../../middlewares/upload.middleware');

const router = express.Router();

router.post('/image', uploadImage.single('file'), uploadController.uploadImage);
router.post('/document', uploadDocument.single('file'), uploadController.uploadDocument);

module.exports = router;
