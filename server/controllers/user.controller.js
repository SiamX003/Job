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
        message: "User already registered",
        error: true,
        success: false,
      });
    }

    const hashPassword = await bcryptjs.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new UserModel({
      name,
      email,
      mobile,
      password: hashPassword,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
    });

    await user.save();

    // send verification email (optional)
    // await sendEmailFun({ to: email, subject: "Verify your email", html: VerificationEmail(name, otp) });

    const accessToken = generatedAccessToken(user._id);
    const refreshToken = generatedRefreshToken(user._id);

    const cookieOptions = { httpOnly: true, sameSite: "Lax" };
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(201).json({
      message: "User registered successfully",
      error: false,
      success: true,
      data: { accessToken, refreshToken },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message, error: true, success: false });
  }
}

// ===== LOGIN =====
export async function loginUserController(req, res) {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    const accessToken = generatedAccessToken(user._id);
    const refreshToken = generatedRefreshToken(user._id);

    res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: "Lax" });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "Lax" });

    return res.json({ message: "Login successful", error: false, success: true, data: { accessToken, refreshToken } });
  } catch (err) {
    return res.status(500).json({ message: err.message, error: true, success: false });
  }
}

// ===== LOGOUT =====
export async function logoutController(req, res) {
  try {
    const userId = req.userId;
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    await UserModel.findByIdAndUpdate(userId, { refresh_token: "" });
    return res.json({ message: "Logout successful", error: false, success: true });
  } catch (err) {
    return res.status(500).json({ message: err.message, error: true, success: false });
  }
}

// ===== GET PROFILE =====
export async function getProfileController(req, res) {
  try {
    const user = await UserModel.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found", error: true, success: false });
    return res.json({ name: user.name, email: user.email, mobile: user.mobile });
  } catch (err) {
    return res.status(500).json({ message: err.message, error: true, success: false });
  }
}

// ===== VERIFY EMAIL =====
export async function verifyEmailController(req, res) {
  try {
    const { email, otp } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found", error: true, success: false });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP", error: true, success: false });
    if (user.otpExpires < Date.now()) return res.status(400).json({ message: "OTP expired", error: true, success: false });

    user.verify_email = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return res.json({ message: "Email verified successfully", error: false, success: true });
  } catch (err) {
    return res.status(500).json({ message: err.message, error: true, success: false });
  }
}
