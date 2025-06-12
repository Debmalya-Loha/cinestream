const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

async function sendOtpEmail(to, otp) {
  try {
    const info = await transporter.sendMail({
      from: `"CineStream Support" <${process.env.GMAIL_USER}>`,
      to,
      replyTo: process.env.GMAIL_USER,
      subject: 'Verify your CineStream account - OTP inside!',
      headers: {
        'X-Priority': '3',
        'X-Mailer': 'CineStream Mailer'
      },
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; color: #333; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #e50914;">Welcome to CineStream!</h2>
          <p>Hi there,</p>
          <p>To continue signing up, please use the following One-Time Password (OTP) to verify your email address:</p>
          <div style="font-size: 28px; font-weight: bold; background: #f0f0f0; padding: 15px; margin: 20px 0; text-align: center; border-radius: 6px;">
            ${otp}
          </div>
          <p>This code will expire in <strong>5 minutes</strong>.</p>
          <p>If you did not request this email, please ignore it.</p>
          <br>
          <p>Thank you,<br>The CineStream Team</p>
          <hr style="margin-top: 30px;">
          <p style="font-size: 12px; color: #888;">
            You’re receiving this email because someone tried to register a CineStream account using this email address.
            <br>If this wasn't you, no further action is required.
          </p>
        </div>
      `
    });

    console.log('✅ Email sent:', info.response);
    return info;
  } catch (err) {
    console.error('❌ Gmail send error:', err);
    throw err;
  }
}

module.exports = sendOtpEmail;
