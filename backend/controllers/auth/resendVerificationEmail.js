import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import VerifyResetToken from "../../models/verifyResetTokenModel.js";
import sendEmail from "../../utils/sendEmail.js";
import { randomBytes } from "crypto";

const domainURL = process.env.DOMAIN;
const { randomByte } = await import("crypto");

// Tittle: Resend Email Verification Token
// Path: Post /api/v1/auth/resend_email_token
// Auth: Public

const resendEmaiVerificationToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error("An email must be provided");
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("We were unable to find a user with that email address");
  }
  if (user.isEmailVerified) {
    res.status(400);
    throw new Error("This acount has already been verified. Please login");
  }
  let verificationToken = await VerifyResetToken.findOne({ _userId: user._id });
  if (verificationToken) {
    await verificationToken.deleteOne();
  }
  const resetToken = randomBytes(32).toString("hex");
  let emailToken = await new VerifyResetToken({
    _userId: user._id,
    token: resetToken,
  }).save();

  const emailLink = `${domainURL}/api/v1/auth/verify/${emailToken.token}/${user._id}`;

  const payload = {
    name: user.firstName,
    link: emailLink,
  };
  await sendEmail(
    user.email,
    "Acount Verification",
    payload,
    "accountVerification.handlebars"
  );
  res.json({
    success: true,
    message: `${user.firstName}, an email has been send to your account please verify within 15 minutes`,
  });
});

export default resendEmaiVerificationToken;
