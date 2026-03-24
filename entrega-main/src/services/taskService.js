const pool = require("../db");

const getAllTasks = async () => {
  const [rows] = await pool.query("SELECT * FROM tasks");
  return rows;
};

const getTaskById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [id]);
  if (rows.length === 0) throw new Error("Task not found");
  return rows[0];
};

const postTask = async (body) => {
  const [result] = await pool.query("INSERT INTO tasks (title, done) VALUES (?, ?)", [body.title, false]);
  return { id: result.insertId, title: body.title, done: false };
};

const putTask = async (taskIdParam, body) => {
  const task = await getTaskById(taskIdParam);
  await pool.query("UPDATE tasks SET title = ? WHERE id = ?", [body.title, taskIdParam]);
  return { ...task, title: body.title };
};

const deleteTask = async (taskIdParam) => {
  const [result] = await pool.query("DELETE FROM tasks WHERE id = ?", [taskIdParam]);
  if (result.affectedRows === 0) throw new Error("Task not found");
  return { message: "Task deleted successfully" };
};

const patchDone = async (taskIdParam, done) => {
  const task = await getTaskById(taskIdParam);
  await pool.query("UPDATE tasks SET done = ? WHERE id = ?", [done, taskIdParam]);
  return { ...task, done };
};

const addTaskTag = async (taskIdAdd, tagIdAdd) => {
  const [existing] = await pool.query(
    "SELECT * FROM task_tags WHERE taskId = ? AND tagId = ?",
    [taskIdAdd, tagIdAdd]
  );
  if (existing.length > 0) return null;
  const [result] = await pool.query(
    "INSERT INTO task_tags (taskId, tagId) VALUES (?, ?)",
    [taskIdAdd, tagIdAdd]
  );
  return { id: result.insertId, taskId: taskIdAdd, tagId: tagIdAdd };
};

const getTagsByTaskId = async (taskId) => {
  const [rows] = await pool.query(
    "SELECT tagId FROM task_tags WHERE taskId = ?",
    [taskId]
  );
  return rows.map((r) => r.tagId);
};

const removeTaskTagsByTagId = async (tagId) => {
  await pool.query("DELETE FROM task_tags WHERE tagId = ?", [tagId]);
};

const getTasksByTagId = async (tagId) => {
  const [rows] = await pool.query(
    "SELECT t.* FROM tasks t JOIN task_tags tt ON t.id = tt.taskId WHERE tt.tagId = ?",
    [tagId]
  );
  return rows;
};

const getAllTaskTags = async () => {
  const [rows] = await pool.query("SELECT * FROM task_tags");
  return rows;
};

module.exports = {
  getAllTasks,
  getTaskById,
  postTask,
  putTask,
  deleteTask,
  patchDone,
  addTaskTag,
  getTagsByTaskId,
  removeTaskTagsByTagId,
  getTasksByTagId,
  getAllTaskTags,
};
