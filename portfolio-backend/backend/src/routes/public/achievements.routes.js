const express = require('express');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const Achievement = require('../../models/Achievement');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const items = await Achievement.find({ isVisible: true }).sort({ order: 1 });
  new ApiResponse(200, items).send(res);
}));

module.exports = router;
