import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";

// @desc    Delete user account - An Admin user can delete any user account
// @route   DELETE /api/v1/user/:id
// @access  Private/Admin

const deleteUserAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    const result = await user.deleteOne();
    res.json({
      success: true,
      message: `User ${user.firstName} account deleted successfully`,
      result,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export default deleteUserAccount;
