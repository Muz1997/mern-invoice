import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import VerificationToken from "../../models/verifyResetTokenModel.js";
import sendEmail from "../../utils/sendEmail.js";

const domainURL = process.env.DOMAIN;
import { randomBytes } from "crypto"; // Node.js built-in module

// @desc    Request password reset
// @route   POST /api/v1/auth/reset_password_request
// @access  Public

const resetPasswordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("You must provide an email address");
  }
  const existingUser = await User.findOne({ email }).select("-password");
  if (!existingUser) {
    res.status(404);
    throw new Error("That email address is not registered");
  }
  let verficationToken = VerificationToken.findOne({
    _userId: existingUser._id,
  });
  if (verficationToken) {
    await verficationToken.deleteOne();
  }
  const resetToken = randomBytes(32).toString("hex");

  let newVerificationToken = await new VerificationToken({
    _userId: existingUser._id,
    token: resetToken,
    createdAt: Date.now(),
  }).save();

  if (existingUser && existingUser.isEmailVerified) {
    const emailLink = `${domainURL}/auth/reset_password?emailToken=${newVerificationToken.token}$userId=${existingUser._id}`;
    const payload = {
      name: existingUser.firstName,
      link: emailLink,
    };
    await sendEmail(
      existingUser.email,
      "Password Reset Request",
      payload,
      "requestResetPassword.handlebars"
    );
    res.status(200).json({
      success: true,
      message: `Hey, ${existingUser.firstName}, we have sent you an email with instructions to reset your passwords`,
    });
  } else {
    res.status(400);
    throw new Error(
      "Your email address has not been verified, please verify your email address first"
    );
  }
});

// @desc    Reset User password
// @route   POST /api/v1/auth/reset_password
// @access  Public

const resetPassword = asyncHandler(async (req, res) => {
  const { password, passwordConfirm, userId, emailToken } = req.body;
  if (!password) {
    res.status(400);
    throw new Error("Please provide a new password");
  }
  if (!passwordConfirm) {
    res.status(400);
    throw new Error("Please confirm your new password");
  }
  if (password !== passwordConfirm) {
    res.status(400);
    throw new Error("Passwords do not match");
  }

  if (password.length < 8) {
    res.status(400);
    throw new Error("Password must be at least 8 characters long");
  }
  const passwordResetToken = await VerificationToken.findOne({
    _userId: userId,
  });
  if (!passwordResetToken) {
    res.status(404);
    throw new Error(
      "Invalid or expired password reset token, try resetting your password again"
    );
  }
  const user = await User.findById({ _id: passwordResetToken._userId }).select(
    "-password"
  );

  if (user && passwordResetToken) {
    user.password = password;
    await user.save();
    await passwordResetToken.deleteOne();

    const payload = {
      name: user.firstName,
    };
    await sendEmail(
      user.email,
      "Password Reset Successful",
      payload,
      "resetPassword.handlebars"
    );
    res.status(200).json({
      success: true,
      message:
        "Password reset successful, you can now login with your new password",
    });
  }
});

export { resetPasswordRequest, resetPassword };
