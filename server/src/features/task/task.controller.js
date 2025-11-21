import Task from "./task.Schema.js";
import TaskAudit from "./task.audit.schema.js";

// CREATE TASK
export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    const task = await Task.create({ title, description });

    // Audit log
    await TaskAudit.create({
      action: "create",
      taskId: task._id,
      updateContent: { title, description },
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET TASK BY ID
export const getTasks = async (req, res) => {
  try {
    
    const tasks = await Task.find().lean(); // returns an array

    if (tasks.length == 0) {
      return res.json({
        msg: "No tasks",
      });
    }

    res.json({ tasks }); // send whole array
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE TASK
export const updateTask = async (req, res) => {
  try {
    const { id, title, description } = req.body;

    const updates = {
      title,
      description,
    };

    const task = await Task.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });

    // Audit log
    await TaskAudit.create({
      action: "update",
      taskId: task._id,
      updateContent: updates,
    });

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE TASK
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.body;
    const task = await Task.findByIdAndDelete(id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    // Audit log
    await TaskAudit.create({
      action: "delete",
      taskId: task._id,
      updateContent: { deleted: true },
    });

    res.status(200).json({
      message: "Task deleted successfully",
      taskId: task._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllTaskAudit = async (req, res) => {
  try {
    const audits = await TaskAudit.find().sort({ timestamp: -1 }); // newest first
    if (audits.length == 0) {
      return res.json({
        msg: "No audit tasks",
      });
    }

    res.json({ audits });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
