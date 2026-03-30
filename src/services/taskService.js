const pool = require("../db");

const getAllTasks = async (sort, search) => {
  let query = "SELECT * FROM tasks";
  const params = [];

  if (search) {
    query += " WHERE title LIKE ?";
    params.push(`%${search}%`);
  }

  if (sort === "asc" || sort === "desc") {
    query += ` ORDER BY title ${sort.toUpperCase()}`;
  }

  const [rows] = await pool.query(query, params);
  return rows;
};

const getTaskStats = async () => {
  const [[{ total }]] = await pool.query("SELECT COUNT(*) AS total FROM tasks");
  const [[{ done }]] = await pool.query(
    "SELECT COUNT(*) AS done FROM tasks WHERE done = 1",
  );
  const [[{ pending }]] = await pool.query(
    "SELECT COUNT(*) AS pending FROM tasks WHERE done = 0",
  );
  return { total, done, pending };
};

const getTaskById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [id]);
  if (rows.length === 0) throw new Error("Task not found");
  return rows[0];
};

const postTask = async (body) => {
  const [result] = await pool.query(
    "INSERT INTO tasks (title, done) VALUES (?, ?)",
    [body.title.trim(), false],
  );
  return { id: result.insertId, title: body.title.trim(), done: false };
};

const putTask = async (taskIdParam, body) => {
  await pool.query("UPDATE tasks SET title = ? WHERE id = ?", [
    body.title.trim(),
    taskIdParam,
  ]);
  return { message: "Task updated" };
};

const deleteTask = async (taskIdParam) => {
  const task = await getTaskById(taskIdParam);
  await pool.query("DELETE FROM task_tags WHERE taskId = ?", [taskIdParam]);
  await pool.query("DELETE FROM user_task WHERE taskId = ?", [taskIdParam]);
  //await pool.query("DELETE FROM comments WHERE taskId = ?", [taskIdParam]);
  await pool.query("DELETE FROM tasks WHERE id = ?", [taskIdParam]);
  return task;
};

const patchDone = async (taskIdParam, done) => {
  const task = await getTaskById(taskIdParam);
  await pool.query("UPDATE tasks SET done = ? WHERE id = ?", [
    done,
    taskIdParam,
  ]);
  return { ...task, done };
};

const addTaskTag = async (taskIdAdd, tagIdAdd) => {
  const [existing] = await pool.query(
    "SELECT * FROM task_tags WHERE taskId = ? AND tagId = ?",
    [taskIdAdd, tagIdAdd],
  );
  if (existing.length > 0) return null;
  const [result] = await pool.query(
    "INSERT INTO task_tags (taskId, tagId) VALUES (?, ?)",
    [taskIdAdd, tagIdAdd],
  );
  return { id: result.insertId, taskId: taskIdAdd, tagId: tagIdAdd };
};

const getTagsByTaskId = async (taskId) => {
  const [rows] = await pool.query(
    "SELECT tags.* FROM tags JOIN task_tags ON tags.id = task_tags.tagId WHERE task_tags.taskId = ?",
    [taskId]
  );
  return rows;
};

//chamada por tagService.deleteTag
const removeTaskTagsByTagId = async (tagId) => {
  await pool.query("DELETE FROM task_tags WHERE tagId = ?", [tagId]);
};

const removeTagFromTask = async (taskId, tagId) => {
  await pool.query("DELETE FROM task_tags WHERE taskId = ? AND tagId = ?", [taskId, tagId]);
};

const putTaskTag = async (taskTagId, body) => {
  await pool.query(
    "UPDATE task_tags SET taskId = ?, tagId = ? WHERE id = ?",
    [body.taskId, body.tagId, taskTagId]
  );
  return { id: parseInt(taskTagId), taskId: body.taskId, tagId: body.tagId };
};

const deleteTaskTag = async (taskTagId) => {
  await pool.query("DELETE FROM task_tags WHERE id = ?", [taskTagId]);
};

//chamada por tagController.getTasksByTag -> GET /tags/:id/tasks
const getTasksByTagId = async (tagId) => {
  const [rows] = await pool.query(
    "SELECT t.* FROM tasks t JOIN task_tags tt ON t.id = tt.taskId WHERE tt.tagId = ?",
    [tagId],
  );
  return rows;
};


module.exports = {
  getAllTasks,
  getTaskById,
  getTaskStats,
  postTask,
  putTask,
  deleteTask,
  patchDone,
  addTaskTag,
  getTagsByTaskId,
  removeTaskTagsByTagId,
  removeTagFromTask,
  putTaskTag,
  deleteTaskTag,
  getTasksByTagId,
};

//redone