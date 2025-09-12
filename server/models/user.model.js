import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Provide name"]
  },
  email: {
    type: String,
    required: [true, "Provide email"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Provide password"]
  },
  mobile: {
    type: String,
    default: null
  },
  verify_email: {
    type: Boolean,
    default: false
  },
  last_login_date: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ["Active", "Inactive", "Suspended"],
    default: "Active"
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  role: {
    type: String,
    enum: ['ADMIN', 'USER'],
    default: "USER"
  }
}, { timestamps: true });

const UserModel = mongoose.model("User", userSchema);

export default UserModel;