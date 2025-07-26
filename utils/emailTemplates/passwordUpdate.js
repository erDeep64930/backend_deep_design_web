const passwordUpdate = (email, name) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Password Update</title>
  <style>
    body { background-color: #f4f4f4; font-family: Arial, sans-serif; padding: 0; margin: 0; }
    .container { max-width: 600px; margin: auto; padding: 20px; text-align: center; }
    .support { font-size: 14px; color: #888; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Password Updated</h2>
    <p>Hello ${name},</p>
    <p>Your password was successfully updated for your email: <strong>${email}</strong>.</p>
    <p>If this wasn’t you, please contact support immediately.</p>
    <div class="support">info@deepdesignweb.com</div>
  </div>
</body>
</html>`;
};

module.exports = passwordUpdate;
