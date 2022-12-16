const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: () => Date.now(),
  },
  creator: {
    type: String,
  },
  num: Number,
});

PostSchema.plugin(AutoIncrement, { inc_field: "num" });
const model = mongoose.model("Post", PostSchema);

module.exports = model;
