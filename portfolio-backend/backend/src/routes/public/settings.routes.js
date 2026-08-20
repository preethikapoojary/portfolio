const express = require('express');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const SiteSettings = require('../../models/SiteSettings');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const settings = await SiteSettings.getSingleton();
    new ApiResponse(200, settings).send(res);
  })
);

module.exports = router;
