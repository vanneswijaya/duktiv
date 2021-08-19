import mongoose from "mongoose";
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

export const Project = mongoose.model("Project", ProjectSchema);
