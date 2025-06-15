const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },           // clearer than 'name'
  email: { type: String, required: true, unique: true },// used for login
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
