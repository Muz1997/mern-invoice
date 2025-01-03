import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";

// @desc    Update user profile
// @route   PATCH /api/v1/user/profile
// @access  Private

const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const {
    password,
    passwordConfirm,
    firstName,
    email,
    isEmailVerified,
    provider,
    roles,
    googleID,
    username,
  } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("This user does not exist");
  }
  if (password || passwordConfirm) {
    res.status(400);
    throw new Error(
      "You cannot update password from this route. Please update password functionality"
    );
  }
  if (email || isEmailVerified || provider || roles || googleID) {
    res.status(400);
    throw new Error(
      "You cannot update email, email verification status, provider, roles or googleID from this route. Please use update email functionality"
    );
  }
  const fieldsToUpdate = req.body;
  const updatedProfile = await User.findByIdAndUpdate(
    userId,
    { ...fieldsToUpdate },
    { new: true },
    { runValidators: true }
  ).select("-resetRefershToken");
  res.status(200).json({
    success: true,
    message: `${updatedProfile.firstName}'s profile updated successfully`,
    updatedProfile,
  });
});
export default updateUserProfile;
