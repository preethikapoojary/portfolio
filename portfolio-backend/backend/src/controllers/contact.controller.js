const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const ContactMessage = require('../models/ContactMessage');
const activityLogService = require('../services/activityLog.service');

// ---------------- PUBLIC ----------------

const submit = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    throw ApiError.badRequest('Name, email, and message are required');
  }
  const doc = await ContactMessage.create({ name, email, subject, message });
  new ApiResponse(201, { id: doc._id }, "Message sent — thank you! I'll get back to you soon.").send(res);
});

// ---------------- ADMIN ----------------

const list = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const query = {};
  if (req.query.isRead !== undefined) query.isRead = req.query.isRead === 'true';

  const [items, total] = await Promise.all([
    ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    ContactMessage.countDocuments(query),
  ]);

  new ApiResponse(200, items, 'Messages fetched', {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  }).send(res);
});

const toggleRead = asyncHandler(async (req, res) => {
  const msg = await ContactMessage.findById(req.params.id);
  if (!msg) throw ApiError.notFound('Message not found');
  msg.isRead = !msg.isRead;
  await msg.save();
  new ApiResponse(200, msg, `Marked as ${msg.isRead ? 'read' : 'unread'}`).send(res);
});

const remove = asyncHandler(async (req, res) => {
  const msg = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!msg) throw ApiError.notFound('Message not found');

  activityLogService.record({
    adminId: req.admin._id,
    action: 'DELETE',
    resource: 'ContactMessage',
    resourceId: msg._id,
    description: `Deleted message from "${msg.name}"`,
  });

  new ApiResponse(200, msg, 'Message deleted').send(res);
});

module.exports = { submit, list, toggleRead, remove };
