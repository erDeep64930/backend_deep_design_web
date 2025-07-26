const otpTemplate = (name, otp) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>OTP Verification</title>
  <style>
    body { background-color: #f4f4f4; font-family: Arial, sans-serif; padding: 0; margin: 0; }
    .container { max-width: 600px; margin: auto; padding: 20px; text-align: center; }
    .otp-box { background: #007bff; color: #fff; font-size: 24px; padding: 12px 20px; border-radius: 5px; display: inline-block; margin-top: 15px; }
    .support { font-size: 14px; color: #888; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <h2>OTP Verification</h2>
    <p>Hi ${name},</p>
    <p>Use the following OTP to verify your email address:</p>
    <div class="otp-box">${otp}</div>
    <p>This OTP is valid for 10 minutes.</p>
    <div class="support">If you didn’t request this, ignore this email.</div>
  </div>
</body>
</html>`;
};

module.exports = otpTemplate;
