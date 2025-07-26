const mongoose = require("mongoose");

const SubSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  timeDuration: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  videoURL: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("SubSection", SubSectionSchema);
