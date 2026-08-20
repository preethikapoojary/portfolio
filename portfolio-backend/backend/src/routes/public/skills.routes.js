const express = require('express');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const Skill = require('../../models/Skill');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const query = { isVisible: true };
  if (req.query.category) query.category = req.query.category;
  const items = await Skill.find(query).sort({ order: 1 });
  new ApiResponse(200, items).send(res);
}));

module.exports = router;
