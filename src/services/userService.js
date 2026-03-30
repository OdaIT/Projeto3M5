const pool = require("../db");

const getAllUsers = async (sort, search) => {
  let query = "SELECT * FROM users";
  const params = [];

  if (search) {
    query += " WHERE name LIKE ?";
    params.push(`%${search}%`);
  }

  if (sort === "asc" || sort === "desc") {
    query += ` ORDER BY name ${sort.toUpperCase()}`;
  }

  const [rows] = await pool.query(query, params);
  return rows;
};

const getUserStats = async () => {
  const [[{ total }]] = await pool.query("SELECT COUNT(*) AS total FROM users");
  const [[{ active }]] = await pool.query(
    "SELECT COUNT(*) AS active FROM users WHERE status = 1",
  );
  const [[{ inactive }]] = await pool.query(
    "SELECT COUNT(*) AS inactive FROM users WHERE status = 0",
  );
  return { total, active, inactive };
};

const patchUserStatus = async (userId, status) => {
  const user = await getUserById(userId);
  await pool.query("UPDATE users SET status = ? WHERE id = ?", [
    status,
    userId,
  ]);
  return { ...user, status };
};

const getUserById = async (userId) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [userId]);
  if (rows.length === 0) throw new Error("User not found");
  return rows[0];
};


//tem um insertid apesar de ter autoincremento na base de dados
const postUser = async (body) => {
  const [result] = await pool.query(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [body.name, body.email.toLowerCase()],
  );
  return { id: result.insertId, name: body.name, email: body.email };
};

const putUser = async (userId, body) => {
  if (!body.name || typeof body.name !== "string" || body.name.trim() === "") {
    throw new Error("User name required or invalid");
  }
  const user = await getUserById(userId);
  await pool.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [
    body.name.trim(),
    body.email.trim(),
    userId,
  ]);
  return { ...user, name: body.name.trim(), email: body.email.trim() };
};

const deleteUser = async (userId) => {
  const user = await getUserById(userId);
  //await pool.query("DELETE FROM comments WHERE userId = ?", [userId]);
  await pool.query("DELETE FROM user_task WHERE userId = ?", [userId]);
  await pool.query("DELETE FROM users WHERE id = ?", [userId]);
  return user;
};

const postTaskToUser = async (userId, taskId) => {
  const [existing] = await pool.query(
    "SELECT * FROM user_task WHERE userId = ? AND taskId = ?",
    [userId, taskId]
  );
  if (existing.length > 0) return null;
  const [result] = await pool.query(
    "INSERT INTO user_task (userId, taskId) VALUES (?, ?)",
    [userId, taskId]
  );
  return { id: result.insertId, userId, taskId };
};

const getTasksByUser = async (userId) => {
  const [rows] = await pool.query(
    "SELECT tasks.* FROM tasks JOIN user_task ON tasks.id = user_task.taskId WHERE user_task.userId = ?",
    [userId]
  );
  return rows;
};

const deleteTaskFromUser = async (userId, taskId) => {
  await pool.query(
    "DELETE FROM user_task WHERE userId = ? AND taskId = ?",
    [userId, taskId]
  );
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserStats,
  postUser,
  putUser,
  patchUserStatus,
  deleteUser,
  postTaskToUser,
  getTasksByUser,
  deleteTaskFromUser
};

//redone