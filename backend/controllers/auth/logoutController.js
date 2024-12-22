import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private

const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    res.status(204);
    throw new Error("No cookies found");
  }

  const refreshToken = cookies.jwt;
  const existingUser = await User.findOne({ refreshToken });
  console.log(existingUser);
  if (!existingUser) {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.status(204);
  }
  existingUser.refreshToken = existingUser.refreshToken.filter(
    (reft) => reft !== refreshToken
  );
  await existingUser.save();
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.status(200).json({
    success: true,
    message: `${existingUser.firstName}, you have been logged out successfully`,
  });
});

export default logout;
