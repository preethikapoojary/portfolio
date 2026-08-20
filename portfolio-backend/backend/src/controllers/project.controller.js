const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Project = require('../models/Project');
const { uniqueSlug } = require('../utils/slugify');
const activityLogService = require('../services/activityLog.service');

// ---------------- ADMIN ----------------

const adminList = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const query = {};

  if (req.query.category) query.category = req.query.category;
  if (req.query.isFeatured !== undefined) query.isFeatured = req.query.isFeatured === 'true';
  if (req.query.search) {
    const regex = new RegExp(req.query.search, 'i');
    query.$or = [{ title: regex }, { shortDescription: regex }, { technologies: regex }];
  }

  const [items, total] = await Promise.all([
    Project.find(query)
      .sort({ order: 1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Project.countDocuments(query),
  ]);

  new ApiResponse(200, items, 'Projects fetched', {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  }).send(res);
});

const adminGetOne = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw ApiError.notFound('Project not found');
  new ApiResponse(200, project).send(res);
});

const create = asyncHandler(async (req, res) => {
  const slug = req.body.slug ? await uniqueSlug(Project, req.body.slug) : await uniqueSlug(Project, req.body.title);
  const project = await Project.create({ ...req.body, slug });

  activityLogService.record({
    adminId: req.admin._id,
    action: 'CREATE',
    resource: 'Project',
    resourceId: project._id,
    description: `Created project "${project.title}"`,
  });

  new ApiResponse(201, project, 'Project created').send(res);
});

const update = asyncHandler(async (req, res) => {
  const existing = await Project.findById(req.params.id);
  if (!existing) throw ApiError.notFound('Project not found');

  const payload = { ...req.body };
  // Regenerate the slug only if the title changed and no explicit slug was sent.
  if (payload.title && payload.title !== existing.title && !payload.slug) {
    payload.slug = await uniqueSlug(Project, payload.title, existing._id);
  }

  const project = await Project.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  activityLogService.record({
    adminId: req.admin._id,
    action: 'UPDATE',
    resource: 'Project',
    resourceId: project._id,
    description: `Updated project "${project.title}"`,
  });

  new ApiResponse(200, project, 'Project updated').send(res);
});

const remove = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) throw ApiError.notFound('Project not found');

  activityLogService.record({
    adminId: req.admin._id,
    action: 'DELETE',
    resource: 'Project',
    resourceId: project._id,
    description: `Deleted project "${project.title}"`,
  });

  new ApiResponse(200, project, 'Project deleted').send(res);
});

const reorder = asyncHandler(async (req, res) => {
  const items = req.body.items;
  if (!Array.isArray(items) || !items.length) {
    throw ApiError.badRequest('items must be a non-empty array of { id, order }');
  }
  await Promise.all(items.map(({ id, order }) => Project.updateOne({ _id: id }, { $set: { order } })));

  activityLogService.record({
    adminId: req.admin._id,
    action: 'REORDER',
    resource: 'Project',
    resourceId: null,
    description: `Reordered ${items.length} project(s)`,
  });

  new ApiResponse(200, null, 'Projects reordered').send(res);
});

const toggleVisibility = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw ApiError.notFound('Project not found');
  project.isVisible = !project.isVisible;
  await project.save();

  activityLogService.record({
    adminId: req.admin._id,
    action: 'UPDATE',
    resource: 'Project',
    resourceId: project._id,
    description: `${project.isVisible ? 'Showed' : 'Hid'} project "${project.title}"`,
  });

  new ApiResponse(200, project, 'Visibility toggled').send(res);
});

// ---------------- PUBLIC ----------------

const publicList = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 20);
  const query = { isVisible: true };
  if (req.query.category) query.category = req.query.category;
  if (req.query.featured === 'true') query.isFeatured = true;

  const [items, total] = await Promise.all([
    Project.find(query)
      .sort({ order: 1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Project.countDocuments(query),
  ]);

  new ApiResponse(200, items, 'Projects fetched', {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  }).send(res);
});

const publicGetBySlug = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug, isVisible: true });
  if (!project) throw ApiError.notFound('Project not found');

  res.locals.recordAnalytics?.(project._id);

  new ApiResponse(200, project).send(res);
});

module.exports = {
  adminList,
  adminGetOne,
  create,
  update,
  remove,
  reorder,
  toggleVisibility,
  publicList,
  publicGetBySlug,
};
