const pool = require("../db");

const getAllTaskTags = async () => {
  const [rows] = await pool.query("SELECT * FROM task_tags");
  return rows;
};

const postTaskTag = async (body) => {
  const [result] = await pool.query(
    "INSERT INTO task_tags (taskId, tagId) VALUES (?, ?)",
    [body.taskId, body.tagId]
  );
  return { id: result.insertId, taskId: body.taskId, tagId: body.tagId };
};

const putTaskTag = async (taskTagId, body) => {
  const [rows] = await pool.query("SELECT * FROM task_tags WHERE id = ?", [taskTagId]);
  if (rows.length === 0) throw new Error("TaskTag not found");
  await pool.query(
    "UPDATE task_tags SET taskId = ?, tagId = ? WHERE id = ?",
    [body.taskId, body.tagId, taskTagId]
  );
  return { id: parseInt(taskTagId), taskId: body.taskId, tagId: body.tagId };
};

const deleteTaskTag = async (taskTagId) => {
  await pool.query("DELETE FROM task_tags WHERE id = ?", [taskTagId]);
};

module.exports = { getAllTaskTags, postTaskTag, putTaskTag, deleteTaskTag };
