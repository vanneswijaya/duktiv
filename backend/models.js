const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProjectSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  tasks: {
    type: [String],
  },
});

const Project = mongoose.model("Project", ProjectSchema);

module.exports = {
  Project,
};
