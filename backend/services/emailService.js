const nodemailer = require("nodemailer");
require("dotenv").config();

// Setup transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendVerificationEmail = async (email, otp) => {
  const mailOptions = {
    from: `"Bazario Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Verification Code",
    text: `Hello! Your OTP is: ${otp}`,
  html: `<p>Hello!</p><p>Your OTP is: <strong>${otp}</strong></p>`
  };
  

  try {
    const info = await transporter.sendMail(mailOptions);
    
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

//Invoice

const sendInvoiceEmail = async ({ to, subject, text, attachments }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Bazario" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    attachments,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { generateOTP, sendVerificationEmail, sendInvoiceEmail};
