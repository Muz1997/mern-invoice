import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";

// @desc    Delete user account
// @route   DELETE /api/v1/user/profile
// @access  Private

const deleteMyAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  await User.findByIdAndDelete(userId);
  res
    .status(200)
    .json({ success: true, message: "User account deleted successfully" });
});

export default deleteMyAccount;
