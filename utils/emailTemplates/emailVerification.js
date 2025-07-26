const emailVerification = (name, email, verificationLink) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Email Verification</title>
  <style>
    body { background-color: #f4f4f4; font-family: Arial, sans-serif; padding: 0; margin: 0; }
    .container { max-width: 600px; margin: auto; padding: 20px; text-align: center; }
    .btn { background: #007bff; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
    .support { font-size: 14px; color: #888; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Verify Your Email</h2>
    <p>Hello ${name},</p>
    <p>Please verify your email address: <strong>${email}</strong></p>
    <a class="btn" href="${verificationLink}">Verify Email</a>
    <div class="support">If this wasn’t you, ignore this email.</div>
  </div>
</body>
</html>`;
};

module.exports = emailVerification;
