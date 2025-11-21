import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    }
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false  // disable updatedAt since you didn't ask for it
    }
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
