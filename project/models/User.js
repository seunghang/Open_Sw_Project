const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: String,
  nick: String,
  password: String,
  phone: String,
});

const model = mongoose.model("User", UserSchema);

module.exports = model;
