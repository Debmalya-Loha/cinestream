const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET user's watch history from MongoDB
router.get('/:id/history', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.history || []);
  } catch (err) {
    console.error("Error fetching user history:", err);
    res.status(500).json({ message: 'Error fetching history' });
  }
});

module.exports = router;
