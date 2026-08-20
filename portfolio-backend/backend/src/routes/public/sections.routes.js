const express = require('express');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const Section = require('../../models/Section');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const sections = await Section.find({ isVisible: true }).sort({ order: 1 });
    new ApiResponse(200, sections).send(res);
  })
);

module.exports = router;
