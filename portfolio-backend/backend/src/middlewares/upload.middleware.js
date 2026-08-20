const multer = require('multer');
const ApiError = require('../utils/ApiError');

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const ALLOWED_DOC_MIME = new Set(['application/pdf']);

const storage = multer.memoryStorage();

function fileFilter(allowedSet) {
  return (req, file, cb) => {
    if (!allowedSet.has(file.mimetype)) {
      return cb(ApiError.badRequest(`Unsupported file type: ${file.mimetype}`));
    }
    cb(null, true);
  };
}

// Images (project screenshots, certificates, gallery, logo/favicon, avatars)
const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter(ALLOWED_MIME),
});

// Resume uploads (PDF only)
const uploadDocument = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: fileFilter(ALLOWED_DOC_MIME),
});

module.exports = { uploadImage, uploadDocument };
