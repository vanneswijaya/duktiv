const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProjectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["done", "ongoing", "unmarked"],
      required: true,
    },
    due: Date,
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  },
  { timestamps: true }
);

const TaskSchema = new Schema(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project" },
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["done", "ongoing", "unmarked"],
      required: true,
    },
    due: Date,
    subtasks: [{ type: Schema.Types.ObjectId, ref: "Subtask" }],
  },
  { timestamps: true }
);

const SubtaskSchema = new Schema(
  {
    task: { type: Schema.Types.ObjectId, ref: "Task" },
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["done", "ongoing", "unmarked"],
      required: true,
    },
    due: Date,
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", ProjectSchema);
const Task = mongoose.model("Task", TaskSchema);
const Subtask = mongoose.model("Subtask", SubtaskSchema);

module.exports = {
  Project,
  Task,
  Subtask,
};
