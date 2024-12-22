import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";

// @desc    Get user profile
// @route   GET /api/v1/user/profile
// @access  Private

const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const userProfile = await User.findById(userId, {
    refreshToken: 0,
    roles: 0,
    _id: 0,
  }).lean();
  if (!userProfile) return res.status(204).send({ message: "User not found" });
  res.status(200).send({ success: true, userProfile });
});

export default getUserProfile;
