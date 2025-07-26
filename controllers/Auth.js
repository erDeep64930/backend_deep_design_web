const User = require("../models/User");
const OTP = require("../models/OTP");
const Profiler = require("../models/Profiler");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// sendOTP

exports.sendOTP = async (req, res) => {
  // fetch email from request body
  try {
    const { email } = req.body;
    //    check if user exists
    const checkUserPresent = await User.findOne({ email });
    if (!checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already exists, please login instead.",
      });
    }

    // generate OTP
    const otp = otpGenerator.generate(6, {
      uppercase: false,
      specialChars: false,
      digits: true,
      alphabets: false,
      lowercase: false,
    });
    console.log("Generated OTP:", otp);

    // check unique otp or not
    const result = await OTP.findOne({ otp: otp });

    while (result) {
      console.log("OTP already exists, generating a new one.");
      otp = otpGenerator.generate(6, {
        uppercase: false,
        specialChars: false,
        digits: true,
        alphabets: false,
        lowercase: false,
      });
      console.log("New OTP:", otp);
      result = await OTP.findOne({ otp: otp });
    }

    // for production level you can use the package to generate the unique otp code

    // save OTP in database
    const otpPayload = {
      otp: otp,
      email: email,
    };

    // create an entry  for otp

    const otpBody = await OTP.create(otpPayload);
    console.log("OTP saved in database:", otpBody);
    console.log(otpBody);
    res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
      otp,
    });
  } catch (error) {
    console.log("Error in sendOTP:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error." + error.message,
      error: error.message,
    });
  }
};

// signup
exports.signup = async (req, res) => {
  try {
    const {
      email,
      password,
      confirmPassword,
      otp,
      accountType,
      contactNumber,
      firstName,
      lastName,
    } = req.body;

    // Validate input
    if (
      !email ||
      !password ||
      !confirmPassword ||
      !otp ||
      !accountType ||
      !contactNumber ||
      !firstName ||
      !lastName
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists, please login instead.",
      });
    }

    const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });
    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "No OTP found for this email.",
      });
    }

    if (otp !== recentOtp.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profileDetails = await Profiler.create({
      gender: null,
      dateOfBirth: null,
      address: null,
      contactNumber: null,
    });

    const user = await User.create({
      email,
      password: hashedPassword,
      accountType,
      contactNumber,
      firstName,
      lastName,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    // Optionally: delete OTP after successful signup
    await OTP.deleteMany({ email });

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      user,
    });
  } catch (error) {
    console.log("Error in signup:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// login

exports.login = async (req, res) => {
  try {
    // fetch email and password from request body
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }
// Check if user exists
    const user = await User.findOne({ email }).populate("additionalDetails");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please sign up.",
      });
    }
// match the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password. Please try again.",
      });
    }

    const payload = {
      id: user._id,
      email: user.email,
      accountType: user.accountType,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    user.token = token;
    user.password = undefined;

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      httpOnly: true,
    };

    res.cookie("token", token, options).status(200).json({
      success: true,
      message: "User logged in successfully.",
      token,
      user,
    });
  } catch (error) {
    console.log("Error in login:", error);
    return res.status(500).json({
      success: false,
      message: "Login failure. Please try again.",
      error: error.message,
    });
  }
};


// changePassword

// changePassword
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you are using auth middleware to set req.user
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    // Validate input
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match.",
      });
    }

    // Get user from DB
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check if old password matches
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect.",
      });
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Error in changePassword:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};
