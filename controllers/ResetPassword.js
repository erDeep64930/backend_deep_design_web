const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const crypto = require("crypto");
const bycrypt = require("bcryptjs");

// reset password token
exports.resetPasswordToken = async (req, res) => {
  try {
    // get the email from body
    const { email } = req.body.email;

    // check the user for this email, email validation
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found /user is not registered" });
    }
    const token = crypto.randomUUID(); // generate a random token

    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      { token: token, resetPasswordExpires: Date.now() + 5 * 60 * 1000 },
      { new: true }
    );
    // update the user by adding the expiration time
    // generate URL
    const url = `http://localhost:3000/update-password/${token}`;

    await mailSender(
      email,
      "password reset link",
      `password reset link :${url}`
    );

    // return response
    return res.json({
      message: "Password reset link sent to your email",
      success: true,
    });

    // send the mail
  } catch (error) {
    console.error("Error generating reset password token:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// reset password
exports.resetPassword = async (req, res) => {
  try {
    // data fetch
    const { password, confirmPassword, token } = req.body;
    // validation
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    // get the user details
    const userDetails = await User.findOne({
      token: token,
    });
    // check if the token is not expired

    if (!userDetails) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // if no entry => invalid token / token expire

    if (!userDetails || userDetails.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    // hash the password

    const hashedPassword = await bycrypt.hash(password, 10);
    // update the user password
    await User.findOneAndUpdate(
      {
        token: token,
      },
      {
        password: hashedPassword,
        token: null, // clear the token after use
        resetPasswordExpires: null, // clear the expiration time
      }
    );
    // return response
    return res.json({
      message: "Password updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
