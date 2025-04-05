const nodemailer = require("nodemailer");
require("dotenv").config();

// Setup transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // App password (not your normal password)
  },
});

// Function to send verification email
exports.sendVerificationEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Admin Verification Code",
    text: `Your verification code for Bazario app is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};
