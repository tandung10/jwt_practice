const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendEmail = async (email, url) => {
  // Tạo transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_SECRET,
      pass: process.env.PASSWORD_SECRET,
    },
  });

  // Cấu hình nội dung email
  const mailOptions = {
    from: process.env.EMAIL_SECRET,
    to: email,
    subject: "Reset password",
    text: `Click this link to reset your password: ${url}`,
  };

  // Gửi email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
};

module.exports = sendEmail;
