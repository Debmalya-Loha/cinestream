const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth"); // ⬅️ router function import
const userRoutes = require('./routes/user');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB Atlas connection using Mongoose
mongoose.connect(
  "mongodb+srv://debmalya99:Debmaly%4099@cluster0.njjk6ti.mongodb.net/cinesteam?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).then(() => {
  console.log("✅ MongoDB (Mongoose) connected");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// Route binding
app.use("/api/auth", authRoutes);

// Test route (optional)
app.get("/", (req, res) => {
  res.send("🎬 Cinesteam backend is live!");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// To fetch user info & history

app.use('/api/history', require('./routes/history'));
app.use('/api/user', require('./routes/user')); // <== should match user.js
