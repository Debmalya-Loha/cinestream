const express = require('express');
const router = express.Router();
const sendOtpEmail = require('../utils/email');
const twilio = require('twilio');

const otpStore = new Map();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send Email OTP
router.post('/send-email', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = generateOTP();
  otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });

  try {
    await sendOtpEmail(email, otp);
    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
});

// Send SMS OTP
router.post('/phone', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: "Phone number is required" });

  const otp = generateOTP();
  otpStore.set(phone, { otp, expires: Date.now() + 5 * 60 * 1000 });

  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  try {
    await client.messages.create({
      body: `Your CineStream OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phone}`
    });

    res.status(200).json({ message: 'Mobile OTP sent successfully' });
  } catch (error) {
    console.error('Twilio Error:', error);
    res.status(500).json({ error: 'Failed to send mobile OTP' });
  }
});

// Verify Email OTP
router.post('/verify-email', (req, res) => {
  const { email, emailOtp } = req.body;
  const now = Date.now();
  const stored = otpStore.get(email);

  if (!stored || stored.otp !== emailOtp || stored.expires < now) {
    return res.status(401).json({ message: "Invalid or expired email OTP" });
  }

  otpStore.set(email, { ...stored, verified: true });
  res.json({ message: "Email OTP verified" });
});

// Verify Phone OTP
router.post('/verify-phone', (req, res) => {
  const { phone, phoneOtp } = req.body;
  const now = Date.now();
  const stored = otpStore.get(phone);

  if (!stored || stored.otp !== phoneOtp || stored.expires < now) {
    return res.status(401).json({ message: "Invalid or expired phone OTP" });
  }

  otpStore.set(phone, { ...stored, verified: true });
  res.json({ message: "Phone OTP verified" });
});

module.exports = router;
