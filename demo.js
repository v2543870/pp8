require("dotenv").config();
const mongoose = require("mongoose");
const Task = require("./models/Task");
const ctrl = require("./controllers/TaskController");

const DB_URI = process.env.DB_URI; // використовуємо змінні середовища

function log(title, data) {
  console.log(`\n=== ${title} ===`);
  console.log(data);
}

async function main() {
  await mongoose.connect(DB_URI);
  console.log("✅ Підключено до MongoDB Atlas");

  await Task.deleteMany({}); // чиста колекція для демонстрації

  // CREATE
  const t1 = await ctrl.createTask({
    title: "  Вивчити Mongoose  ",
    description: "Пройти документацію по схемах",
    priority: 5,
    dueDate: new Date("2026-12-01"),
  });
  const t2 = await ctrl.createTask({ title: "Купити хліб", priority: 2 });
  const t3 = await ctrl.createTask({ title: "Здати ПЗ 8", priority: 4 });
  log("CREATE: createTask (title обрізано trim, status = pending)", [t1, t2, t3]);

  // READ
  log("READ: getAllTasks (новіші першими)", await ctrl.getAllTasks());
  log("READ: getTaskById", await ctrl.getTaskById(t1._id));
  log("READ: getTasksByStatus('pending')", await ctrl.getTasksByStatus("pending"));

  // UPDATE
  log(
    "UPDATE: updateTask",
    await ctrl.updateTask(t2._id, { description: "Білий, нарізаний", priority: 3 })
  );
  log("UPDATE: markAsCompleted", await ctrl.markAsCompleted(t1._id));
  log("READ: getTasksByStatus('completed')", await ctrl.getTasksByStatus("completed"));

  // Перевірка валідації
  try {
    await ctrl.updateTask(t3._id, { priority: 10 });
  } catch (err) {
    log("VALIDATION: priority 10 відхилено", err.message);
  }

  // AGGREGATION
  log("AGGREGATION: getTasksSummary", await ctrl.getTasksSummary());

  // DELETE
  log("DELETE: deleteTask", await ctrl.deleteTask(t2._id));
  log("READ: getAllTasks після видалення", await ctrl.getAllTasks());
  log("AGGREGATION: getTasksSummary після видалення", await ctrl.getTasksSummary());
}

main()
  .catch((err) => console.error("❌ Помилка:", err))
  .finally(() => mongoose.disconnect());
