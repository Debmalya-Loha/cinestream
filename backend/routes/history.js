// backend/routes/history.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Save movie to user's watch history
router.post('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const movie = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Avoid duplicate movie entries
    const alreadyWatched = user.history.some(m => m.id === movie.id);
    if (!alreadyWatched) {
      user.history.push(movie);
      await user.save();
    }

    res.status(200).json({ message: "History updated" });
  } catch (err) {
    console.error("Error saving history:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
