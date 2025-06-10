const express = require("express");
const router = express.Router();
const User = require('../models/User');

// signup route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validation for existing email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'This email is already registered.' });
    }

    // Validation for existing phone
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ message: 'This mobile number is already registered.' });
    }

    //..........
    const sendOtpEmail = require('../utils/email');

router.post('/send-otp-email', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await sendOtpEmail(email, otp);
    req.session.emailOtp = otp;
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to send email OTP", err);
    res.status(500).json({ success: false, message: 'Failed to send OTP. Try again.' });
  }
});
//.........

    const newUser = new User({ name, email, phone, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

module.exports = router;



// Sign In Route
router.post('/signin', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
