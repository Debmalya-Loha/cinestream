const express = require("express");
const router = express.Router();
const User = require('../models/User');

// SIGN UP
router.post('/signup', async (req, res) => {
  try {
    const { username, email, mobile, password } = req.body;

    // Check if username exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken.' });
    }

    // Check if email exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'This email is already registered.' });
    }

    // Check if phone exists
    const existingPhone = await User.findOne({ phone: mobile });
    if (existingPhone) {
      return res.status(400).json({ message: 'This mobile number is already registered.' });
    }

    const newUser = new User({
      username,
      email,
      phone: mobile,
      password
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// SIGN IN
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        username: user.username,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (err) {
    console.error("Signin Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
