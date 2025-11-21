import mongoose from "mongoose";

const taskAuditSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  action: {
    type: String,
    required: true,
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true
  },
  updateContent: {
    type: Object,
  }
});

const TaskAudit = mongoose.model("TaskAudit", taskAuditSchema);

export default TaskAudit;
