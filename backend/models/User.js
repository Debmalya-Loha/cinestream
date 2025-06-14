const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // username stored as name
  email: { type: String, required: true, unique: true }, // <-- make email unique
  phone: { type: String, required: true },
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
