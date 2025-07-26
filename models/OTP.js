const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 60, // OTP will expire after 5 minutes
  },
});

// a function to send email

async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "OTP Verification",
      `Your OTP is: ${otp}`
    );
    console.log("Email sent successfully:", mailResponse);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
}

// pre middleware to send OTP email

OTPSchema.pre("save", async function(){
  await sendVerificationEmail(this.email, this.otp);
  next();
}
)
module.exports = mongoose.model("OTP", OTPSchema);
