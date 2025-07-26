const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,

      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    let info = await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM}>`, // sender address
      to: `${email}`, // list of receivers
      subject: `${title}`, // Subject line
      text: `${body}`, // plain text body
      html: `${body}`, // html body
    });
    console.log(info);
    return info;
  } catch (err) {
    console.error("Error sending email:", err.message);
  }
};

module.exports = mailSender;
