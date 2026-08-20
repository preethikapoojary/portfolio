const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const BlogPost = require('../models/BlogPost');
const { uniqueSlug } = require('../utils/slugify');
const activityLogService = require('../services/activityLog.service');

// ---------------- ADMIN ----------------

const adminList = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const query = {};

  if (req.query.status) query.status = req.query.status;
  if (req.query.category) query.category = req.query.category;
  if (req.query.search) {
    const regex = new RegExp(req.query.search, 'i');
    query.$or = [{ title: regex }, { excerpt: regex }, { tags: regex }];
  }

  const [items, total] = await Promise.all([
    BlogPost.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    BlogPost.countDocuments(query),
  ]);

  new ApiResponse(200, items, 'Blog posts fetched', {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  }).send(res);
});

const adminGetOne = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) throw ApiError.notFound('Blog post not found');
  new ApiResponse(200, post).send(res);
});

const create = asyncHandler(async (req, res) => {
  const slug = req.body.slug ? await uniqueSlug(BlogPost, req.body.slug) : await uniqueSlug(BlogPost, req.body.title);
  const payload = { ...req.body, slug };
  if (payload.status === 'published' && !payload.publishedAt) payload.publishedAt = new Date();

  const post = await BlogPost.create(payload);

  activityLogService.record({
    adminId: req.admin._id,
    action: 'CREATE',
    resource: 'BlogPost',
    resourceId: post._id,
    description: `Created blog post "${post.title}"`,
  });

  new ApiResponse(201, post, 'Blog post created').send(res);
});

const update = asyncHandler(async (req, res) => {
  const existing = await BlogPost.findById(req.params.id);
  if (!existing) throw ApiError.notFound('Blog post not found');

  const payload = { ...req.body };
  if (payload.title && payload.title !== existing.title && !payload.slug) {
    payload.slug = await uniqueSlug(BlogPost, payload.title, existing._id);
  }
  // Transitioning into "published" for the first time stamps publishedAt.
  if (payload.status === 'published' && existing.status !== 'published' && !payload.publishedAt) {
    payload.publishedAt = new Date();
  }

  const post = await BlogPost.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  activityLogService.record({
    adminId: req.admin._id,
    action: 'UPDATE',
    resource: 'BlogPost',
    resourceId: post._id,
    description: `Updated blog post "${post.title}"`,
  });

  new ApiResponse(200, post, 'Blog post updated').send(res);
});

const remove = asyncHandler(async (req, res) => {
  const post = await BlogPost.findByIdAndDelete(req.params.id);
  if (!post) throw ApiError.notFound('Blog post not found');

  activityLogService.record({
    adminId: req.admin._id,
    action: 'DELETE',
    resource: 'BlogPost',
    resourceId: post._id,
    description: `Deleted blog post "${post.title}"`,
  });

  new ApiResponse(200, post, 'Blog post deleted').send(res);
});

const reorder = asyncHandler(async (req, res) => {
  // Blog posts are ordered by publish date rather than a manual order field,
  // so this exists only for API-shape consistency with the rest of the
  // admin dashboard's generic reorder action and is a no-op today.
  new ApiResponse(200, null, 'Blog posts are ordered by date, not manually').send(res);
});

const toggleVisibility = asyncHandler(async (req, res) => {
  // For blog, "visibility" maps to draft/published rather than a boolean flag.
  const post = await BlogPost.findById(req.params.id);
  if (!post) throw ApiError.notFound('Blog post not found');
  post.status = post.status === 'published' ? 'draft' : 'published';
  if (post.status === 'published' && !post.publishedAt) post.publishedAt = new Date();
  await post.save();

  activityLogService.record({
    adminId: req.admin._id,
    action: 'UPDATE',
    resource: 'BlogPost',
    resourceId: post._id,
    description: `${post.status === 'published' ? 'Published' : 'Unpublished'} "${post.title}"`,
  });

  new ApiResponse(200, post, 'Status toggled').send(res);
});

// ---------------- PUBLIC ----------------

const publicList = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 10);
  const query = { status: 'published' };
  if (req.query.category) query.category = req.query.category;
  if (req.query.tag) query.tags = req.query.tag;

  const [items, total] = await Promise.all([
    BlogPost.find(query)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    BlogPost.countDocuments(query),
  ]);

  new ApiResponse(200, items, 'Blog posts fetched', {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  }).send(res);
});

const publicGetBySlug = asyncHandler(async (req, res) => {
  const post = await BlogPost.findOne({ slug: req.params.slug, status: 'published' });
  if (!post) throw ApiError.notFound('Blog post not found');
  new ApiResponse(200, post).send(res);
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
