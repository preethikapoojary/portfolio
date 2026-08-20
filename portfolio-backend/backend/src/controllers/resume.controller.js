const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const ResumeVersion = require('../models/ResumeVersion');
const uploadService = require('../services/upload.service');
const activityLogService = require('../services/activityLog.service');

// ---------------- ADMIN ----------------

const list = asyncHandler(async (req, res) => {
  const versions = await ResumeVersion.find().sort({ uploadedAt: -1 });

  // Recompute the delivery URL from the stored publicId rather than trusting
  // the persisted url — this retroactively fixes any resume uploaded before
  // the attachment-flag fix, without needing a re-upload.
  const fixed = versions.map((v) => {
    const doc = v.toObject();
    if (doc.file?.publicId) doc.file.url = uploadService.getRawAttachmentUrl(doc.file.publicId);
    return doc;
  });

  new ApiResponse(200, fixed).send(res);
});

const upload = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No file uploaded');

  const file = await uploadService.uploadDocument(req.file.buffer, req.file.originalname);
  const isFirstVersion = (await ResumeVersion.countDocuments()) === 0;

  const version = await ResumeVersion.create({
    file,
    label: req.body.label || '',
    isActive: isFirstVersion, // first-ever upload becomes active automatically
  });

  activityLogService.record({
    adminId: req.admin._id,
    action: 'CREATE',
    resource: 'ResumeVersion',
    resourceId: version._id,
    description: `Uploaded resume version "${version.label || version._id}"`,
  });

  new ApiResponse(201, version, 'Resume uploaded').send(res);
});

const activate = asyncHandler(async (req, res) => {
  const version = await ResumeVersion.findById(req.params.id);
  if (!version) throw ApiError.notFound('Resume version not found');

  await ResumeVersion.updateMany({ _id: { $ne: version._id } }, { isActive: false });
  version.isActive = true;
  await version.save();

  activityLogService.record({
    adminId: req.admin._id,
    action: 'ACTIVATE',
    resource: 'ResumeVersion',
    resourceId: version._id,
    description: `Set resume version "${version.label || version._id}" as active`,
  });

  new ApiResponse(200, version, 'Resume version activated').send(res);
});

const remove = asyncHandler(async (req, res) => {
  const version = await ResumeVersion.findById(req.params.id);
  if (!version) throw ApiError.notFound('Resume version not found');
  if (version.isActive) {
    throw ApiError.badRequest('Cannot delete the active resume version — activate another version first');
  }

  await uploadService.destroy(version.file?.publicId, 'raw');
  await version.deleteOne();

  activityLogService.record({
    adminId: req.admin._id,
    action: 'DELETE',
    resource: 'ResumeVersion',
    resourceId: version._id,
    description: `Deleted resume version "${version.label || version._id}"`,
  });

  new ApiResponse(200, version, 'Resume version deleted').send(res);
});

// ---------------- PUBLIC ----------------

const download = asyncHandler(async (req, res) => {
  const active = await ResumeVersion.findOne({ isActive: true });
  if (!active?.file?.publicId) throw ApiError.notFound('No active resume available');

  const downloadUrl = uploadService.getRawAttachmentUrl(active.file.publicId);

  res.locals.recordAnalytics?.();
  res.redirect(downloadUrl);
});

module.exports = { list, upload, activate, remove, download };
