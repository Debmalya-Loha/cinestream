const express = require('express');
const router = express.Router();
const sendOtpEmail = require('../utils/email');

const twilio = require('twilio');

// In-memory OTP store
const otpStore = new Map();

// ===== Send Email OTP using Mailjet =====

// Add this at top if not present
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post('/send-email', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = generateOTP();
  console.log(`📩 Sending email OTP to: ${email}, OTP: ${otp}`);

  try {
    await sendOtpEmail(email, otp);
    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
});

// ===== Send SMS OTP using Twilio =====
router.post('/send-mobile-otp', async (req, res) => {
  const { phone } = req.body;
  const otp = generateOTP();
  otpStore.set(phone, { otp, expires: Date.now() + 5 * 60 * 1000 });

  const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  try {
    await client.messages.create({
      body: `Your CineStream OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phone}`  // Assuming Indian numbers
    });

    res.status(200).json({ message: 'Mobile OTP sent successfully' });
  } catch (error) {
    console.error('Twilio Error:', error);
    res.status(500).json({ error: 'Failed to send mobile OTP' });
  }
});

// ===== Verify both Email & Phone OTPs =====
router.post('/verify', (req, res) => {
  const { email, emailOtp, phone, phoneOtp } = req.body;

  if (!email || !emailOtp || !phone || !phoneOtp) {
    return res.status(400).json({ message: "Missing email/phone or OTPs" });
  }

  const storedEmail = otpStore.get(email);
  const storedPhone = otpStore.get(phone);
  const now = Date.now();

  if (
    !storedEmail || !storedPhone ||
    storedEmail.otp !== emailOtp || storedPhone.otp !== phoneOtp ||
    storedEmail.expires < now || storedPhone.expires < now
  ) {
    return res.status(401).json({ message: "Invalid or expired OTPs" });
  }

  otpStore.set(`${email}:${phone}`, { verified: true });
  res.json({ message: "OTP verified" });
});

module.exports = { router, otpStore };
