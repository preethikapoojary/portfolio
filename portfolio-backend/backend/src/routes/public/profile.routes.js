const express = require('express');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const Profile = require('../../models/Profile');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const profile = await Profile.getSingleton();
    new ApiResponse(200, profile).send(res);
  })
);

module.exports = router;
