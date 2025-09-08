import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmailFun from "../config/sendEmail.js";
import VerificationEmail from "../utils/verifyEmailTemplate.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generatedRefreshToken from "../utils/generatedRefreshToken.js";

// ===== SIGNUP =====
export async function registerUserController(req, res) {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({
        message: "Provide name, email, mobile, and password",
        error: true,
        success: false,
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already registered with this email",
        error: true,
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new UserModel({
      name,
      email,
      mobile,
      password: hashPassword,
      otp: verifyCode,
      otpExpires: Date.now() + 600000, // 10 min
    });

    await user.save();

    // send verification email
    await sendEmailFun({
      to: email,
      subject: "Verify your account",
      html: VerificationEmail(name, verifyCode),
    });

    // generate tokens
    const accessToken = await generatedAccessToken(user._id);
    const refreshToken = await generatedRefreshToken(user._id);

    const cookieOptions = { httpOnly: true, secure: false, sameSite: "Lax" };
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(201).json({
      message: "User registered successfully! Please verify your email.",
      error: false,
      success: true,
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
}

// ===== EMAIL VERIFICATION =====
export async function verifyEmailController(req, res) {
  try {
    const { email, otp } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user)
      return res.status(400).json({
        error: true,
        success: false,
        message: "User not found",
      });

    if (user.otp !== otp)
      return res.status(400).json({
        error: true,
        success: false,
        message: "Invalid OTP",
      });

    if (user.otpExpires < Date.now())
      return res.status(400).json({
        error: true,
        success: false,
        message: "OTP expired",
      });

    user.verify_email = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return res
      .status(200)
      .json({ error: false, success: true, message: "Email verified successfully" });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
}

// ===== LOGIN =====
export async function loginUserController(req, res) {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user)
      return res.status(400).json({
        message: "User not registered",
        error: true,
        success: false,
      });

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({
        message: "Incorrect password",
        error: true,
        success: false,
      });

    if (user.status !== "Active")
      return res.status(400).json({
        message: "Contact admin",
        error: true,
        success: false,
      });

    const accessToken = await generatedAccessToken(user._id);
    const refreshToken = await generatedRefreshToken(user._id);

    await UserModel.findByIdAndUpdate(user._id, { last_login_date: new Date() });

    const cookieOptions = { httpOnly: true, secure: false, sameSite: "Lax" };
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.json({
      message: "Login successful",
      error: false,
      success: true,
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
}

// ===== LOGOUT =====
export async function logoutController(req, res) {
  try {
    const userId = req.userId;

    const cookieOptions = { httpOnly: true, secure: false, sameSite: "Lax" };
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    await UserModel.findByIdAndUpdate(userId, { refresh_token: "" });

    return res.json({ message: "Logout successful", error: false, success: true });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
}

// ===== GET USER PROFILE =====
export async function getProfileController(req, res) {
  try {
    const user = await UserModel.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
}
