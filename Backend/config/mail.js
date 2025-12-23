const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function sendOtpEmail(email, otp) {
  await transporter.sendMail({
    from: `"Reward App" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Verify your account",
    html: `
      <p>Your OTP is <b>${otp}</b></p>
      <p>This OTP is valid for 10 minutes.</p>
    `,
  });
}


module.exports={sendOtpEmail};