import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";

// @desc    Deactivate user account
// @route   Patach /api/v1/user/:id/deactivate
// @access  Private/Admin

const deactivateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.active = false;
    const updatedUser = await user.save();
    res.json({
      success: true,
      message: `User ${user.firstName} account deactivated successfully`,
      updatedUser,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export default deactivateUser;
