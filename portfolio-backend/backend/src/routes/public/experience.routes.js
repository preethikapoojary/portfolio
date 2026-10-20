const express = require('express');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const Experience = require('../../models/Experience');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const items = await Experience.find({ isVisible: true }).sort({ order: 1 });
  new ApiResponse(200, items).send(res);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const item = await Experience.findOne({ _id: req.params.id, isVisible: true });
  if (!item) throw ApiError.notFound('Experience not found');
  new ApiResponse(200, item).send(res);
}));

module.exports = router;
