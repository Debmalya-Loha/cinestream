require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const userRoutes = require('./routes/user');
const otpRoutes = require('./routes/otp');
const historyRoutes = require('./routes/history');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB Atlas connection using Mongoose
mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).then(() => {
  console.log("✅ MongoDB (Mongoose) connected");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/otp", otpRoutes); // ✅ Corrected this line

// Test route
app.get("/", (req, res) => {
  res.send("🎬 Cinesteam backend is live!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
