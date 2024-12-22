import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../../models/userModel.js";
import { systemLogs } from "../../utils/Logger.js";

// Tittle: Login User, get access and refresh toekens
// Path: Post /api/v1/auth/Login
// Auth: Public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide an email and password");
  }
  const existingUser = await User.findOne({ email }).select("+password");
  if (!existingUser || !(await existingUser.comparePassword(password))) {
    res.status(401);
    systemLogs.error("Incorrect email or password");
    throw new Error("Incorrect email or password");
  }
  if (!existingUser.isEmailVerified) {
    res.status(400);
    throw new Error(
      "You are not verified. Check your email, a verification email link was sent when you registered"
    );
  }
  if (!existingUser.active) {
    res.status(400);
    throw new Error(
      "You have been deactivated by Admin. Please reach out use for any query"
    );
  }
  if (existingUser && (await existingUser.comparePassword(password))) {
    const accessToken = jwt.sign(
      {
        id: existingUser._id,
        roles: existingUser.roles,
      },
      process.env.JWT_ACCESS_SECRET_KEY,
      { expiresIn: "1h" }
    );

    const newRefreshToken = jwt.sign(
      {
        id: existingUser._id,
      },
      process.env.JWT_REFRESH_SECRET_KEY,
      { expiresIn: "1d" }
    );

    const cookies = req.cookies;
    let newRefreshTokenArray = !cookies?.jwt
      ? existingUser.refreshToken
      : existingUser.refreshToken.filter((reft) => reft !== cookies.jwt);

    if (cookies?.jwt) {
      const refreshToken = cookies.jwt;
      const existingRefreshToken = await User.findOne({ refreshToken }).exec();

      if (!existingRefreshToken) {
        newRefreshTokenArray = [];
      }
      const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      };
      res.clearCookie("jwt", options);
    }

    existingUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    await existingUser.save();

    const options = {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "none",
    };

    res.cookie("jwt", newRefreshToken, options);
    res.json({
      success: true,
      firstNmae: existingUser.firstName,
      lastName: existingUser.lastName,
      username: existingUser.username,
      provider: existingUser.provider,
      avatar: existingUser.avatar,
      accessToken,
    });
  } else {
    res.status(401);
    throw new Error("Invalid credential provided");
  }
});

export default loginUser;
