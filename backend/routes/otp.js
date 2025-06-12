const express = require('express');
const router = express.Router();
const sendOtpEmail = require('../utils/email');

const otpStore = new Map();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 📧 Send Email OTP
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

// ✅ Verify Email OTP
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

module.exports = router;
