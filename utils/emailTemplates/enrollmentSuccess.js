const enrollmentSuccess = (name, courseName, courseLink) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Enrollment Successful</title>
  <style>
    body { background-color: #f4f4f4; font-family: Arial, sans-serif; padding: 0; margin: 0; }
    .container { max-width: 600px; margin: auto; padding: 20px; text-align: center; }
    .btn { background: #28a745; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
    .support { font-size: 14px; color: #888; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <h2>You're Enrolled!</h2>
    <p>Hi ${name},</p>
    <p>You've successfully enrolled in <strong>${courseName}</strong>.</p>
    <a class="btn" href="${courseLink}">Go to Course</a>
    <div class="support">Have questions? Email us at info@deepdesignweb.com</div>
  </div>
</body>
</html>`;
};

module.exports = enrollmentSuccess;
