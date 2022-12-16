const mongoose = require("mongoose");

const PetSchema = new mongoose.Schema({
  image: String,
  center_name: String,
  type: String,
  link: String,
});

const model = mongoose.model("Pet", PetSchema);

module.exports = model;
