const mongoose = require("mongoose");
const { token } = require("morgan");

const userSchema = mongoose.Schema({
  nickname: String,
  email: String,
  password: String,
  role: String,
  token: String,
  // likedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "events" }],
  // postedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "events" }],
  badges: String,
});

const User = mongoose.model("users", userSchema);

module.exports = User;
