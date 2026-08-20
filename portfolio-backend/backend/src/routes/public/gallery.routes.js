const express = require('express');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const GalleryImage = require('../../models/GalleryImage');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 24);
  const query = { isVisible: true };
  if (req.query.category) query.category = req.query.category;

  const [items, total] = await Promise.all([
    GalleryImage.find(query).sort({ order: 1 }).skip((page - 1) * limit).limit(limit),
    GalleryImage.countDocuments(query),
  ]);

  new ApiResponse(200, items, 'Gallery fetched', { page, limit, total, totalPages: Math.ceil(total / limit) }).send(res);
}));

module.exports = router;
