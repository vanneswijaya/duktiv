const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProjectSchema = new Schema(
  {
    title: String,
    status: String,
    due: Date,
  },
  { timestamps: true }
);

const TaskSchema = new Schema(
  {
    projectId: String,
    title: String,
    status: String,
    due: Date,
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", ProjectSchema);
const Task = mongoose.model("Task", TaskSchema);

module.exports = {
  Project,
  Task,
};
