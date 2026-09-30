const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Testimonial = require('../models/Testimonial');
const uploadService = require('../services/upload.service');
const activityLogService = require('../services/activityLog.service');
const { sendEmail } = require('../services/email');
const { env } = require('../config/env');

// ---------------- PUBLIC ----------------

// Lets a visitor upload their own profile photo before submitting a
// testimonial. Deliberately unauthenticated (rate-limited at the route
// level) and restricted to images only, via the same upload.middleware
// used everywhere else — reuses the existing Cloudinary flow, just exposed
// on a public route for this one specific use case.
const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No file uploaded');
  const media = await uploadService.uploadImage(req.file.buffer, 'portfolio/testimonial-avatars');
  new ApiResponse(201, media, 'Photo uploaded').send(res);
});

const submit = asyncHandler(async (req, res) => {
  const { name, role, company, email, linkedinUrl, githubUrl, message, avatar } = req.body;
  if (!name || !role || !message) {
    throw ApiError.badRequest('Name, role, and testimonial message are required');
  }

  const testimonial = await Testimonial.create({
    name,
    role,
    company,
    email,
    linkedinUrl,
    githubUrl,
    message,
    avatar: avatar || undefined,
    status: 'pending', // never shown publicly until an admin approves it
  });

  if (env.email.contactNotifyTo) {
    sendEmail({
      to: env.email.contactNotifyTo,
      subject: `[Portfolio Alert] New Testimonial Pending Review from ${name}`,
      html: `
        <h2>New Testimonial Submitted</h2>
        <p>A new testimonial is waiting for your review and approval in the admin dashboard.</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Role:</strong> ${role}</p>
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
        ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
        <p><strong>Submitted At:</strong> ${testimonial.createdAt ? new Date(testimonial.createdAt).toLocaleString() : new Date().toLocaleString()}</p>
        <hr />
        <h3>Testimonial Message:</h3>
        <p style="white-space: pre-wrap;">${message}</p>
      `,
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.error('[Email Notification Error] Failed to send testimonial notification email:', err.message);
    });
  }

  new ApiResponse(
    201,
    { id: testimonial._id },
    'Thank you! Your testimonial has been submitted and is pending approval.'
  ).send(res);
});

const publicList = asyncHandler(async (req, res) => {
  const items = await Testimonial.find({ status: 'approved', isVisible: true }).sort({ createdAt: -1 });
  new ApiResponse(200, items).send(res);
});

// ---------------- ADMIN ----------------

const adminList = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const query = {};
  if (req.query.status) query.status = req.query.status;

  const [items, total] = await Promise.all([
    Testimonial.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Testimonial.countDocuments(query),
  ]);

  new ApiResponse(200, items, 'Testimonials fetched', {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  }).send(res);
});

const update = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!testimonial) throw ApiError.notFound('Testimonial not found');

  activityLogService.record({
    adminId: req.admin._id,
    action: 'UPDATE',
    resource: 'Testimonial',
    resourceId: testimonial._id,
    description: `Edited testimonial from "${testimonial.name}"`,
  });

  new ApiResponse(200, testimonial, 'Testimonial updated').send(res);
});

const remove = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if (!testimonial) throw ApiError.notFound('Testimonial not found');

  activityLogService.record({
    adminId: req.admin._id,
    action: 'DELETE',
    resource: 'Testimonial',
    resourceId: testimonial._id,
    description: `Deleted testimonial from "${testimonial.name}"`,
  });

  new ApiResponse(200, testimonial, 'Testimonial deleted').send(res);
});

const approve = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndUpdate(
    req.params.id,
    { status: 'approved' },
    { new: true }
  );
  if (!testimonial) throw ApiError.notFound('Testimonial not found');

  activityLogService.record({
    adminId: req.admin._id,
    action: 'APPROVE',
    resource: 'Testimonial',
    resourceId: testimonial._id,
    description: `Approved testimonial from "${testimonial.name}"`,
  });

  new ApiResponse(200, testimonial, 'Testimonial approved').send(res);
});

const reject = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndUpdate(
    req.params.id,
    { status: 'rejected' },
    { new: true }
  );
  if (!testimonial) throw ApiError.notFound('Testimonial not found');

  activityLogService.record({
    adminId: req.admin._id,
    action: 'REJECT',
    resource: 'Testimonial',
    resourceId: testimonial._id,
    description: `Rejected testimonial from "${testimonial.name}"`,
  });

  new ApiResponse(200, testimonial, 'Testimonial rejected').send(res);
});

const toggleVisibility = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) throw ApiError.notFound('Testimonial not found');
  testimonial.isVisible = !testimonial.isVisible;
  await testimonial.save();

  activityLogService.record({
    adminId: req.admin._id,
    action: 'UPDATE',
    resource: 'Testimonial',
    resourceId: testimonial._id,
    description: `${testimonial.isVisible ? 'Showed' : 'Hid'} testimonial from "${testimonial.name}"`,
  });

  new ApiResponse(200, testimonial, 'Visibility toggled').send(res);
});

module.exports = {
  uploadAvatar,
  submit,
  publicList,
  adminList,
  update,
  remove,
  approve,
  reject,
  toggleVisibility,
};
