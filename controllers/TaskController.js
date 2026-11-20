const Task = require("../models/Task");

async function createTask(data) {
  return await Task.create(data);
}

async function getAllTasks() {
  return await Task.find().sort({ createdAt: -1 });
}

async function getTaskById(id) {
  return await Task.findById(id);
}

async function getTasksByStatus(status) {
  return await Task.find({ status }).sort({ createdAt: -1 });
}

async function updateTask(id, updateData) {
  return await Task.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
}

async function markAsCompleted(id) {
  return await updateTask(id, { status: "completed" });
}

async function deleteTask(id) {
  return await Task.findByIdAndDelete(id); 
}

async function getTasksSummary() {
  const groups = await Task.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const summary = { completed: 0, pending: 0, total: 0 };
  for (const g of groups) {
    summary[g._id] = g.count;
    summary.total += g.count;
  }
  return summary;
}

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  getTasksByStatus,
  updateTask,
  markAsCompleted,
  deleteTask,
  getTasksSummary,
};
