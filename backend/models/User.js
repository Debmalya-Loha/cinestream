// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },     // for "username"
  email: { type: String, required: true },
  phone: { type: String, required: true },     // THIS MUST MATCH!
  password: { type: String, required: true },
  history: [
  {
    id: String,
    title: String,
    poster_path: String,
  }
]
});

module.exports = mongoose.model("User", userSchema);
