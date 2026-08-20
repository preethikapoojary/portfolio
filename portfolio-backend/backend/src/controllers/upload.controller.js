const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const uploadService = require('../services/upload.service');

// Used by any admin form field that stores a mediaSchema value (Project
// screenshots, Project cover image, Certificate image, Gallery image,
// Profile photo, Site logo, Experience proof image).
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No file uploaded');
  const media = await uploadService.uploadImage(req.file.buffer, req.body.folder || 'portfolio/images');
  new ApiResponse(201, media, 'Image uploaded').send(res);
});

// Generic PDF upload — used by any admin form field that stores a document
// (Project Report PDF). Reuses the exact same uploadService.uploadDocument
// function (and its attachment-flag fix) the Resume module already relies
// on, rather than duplicating that logic.
const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No file uploaded');
  const media = await uploadService.uploadDocument(
    req.file.buffer,
    req.file.originalname,
    req.body.folder || 'portfolio/documents'
  );
  new ApiResponse(201, media, 'Document uploaded').send(res);
});

module.exports = { uploadImage, uploadDocument };
