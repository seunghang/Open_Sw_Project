const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const ResultSchema = new mongoose.Schema({
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

ResultSchema.plugin(AutoIncrement, {
  id: "result_num_counter",
  inc_field: "num",
});
const model = mongoose.model("Result", ResultSchema);

module.exports = model;
