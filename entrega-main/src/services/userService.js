const pool = require("../db");

const getAllUsers = async () => {
  const [rows] = await pool.query("SELECT * FROM users");
  return rows;
};

const getUserById = async (userId) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [userId]);
  if (rows.length === 0) throw new Error("User not found");
  return rows[0];
};

const postUser = async (body) => {
  const [result] = await pool.query(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [body.name, body.email]
  );
  return { id: result.insertId, name: body.name, email: body.email };
};

const putUser = async (userId, body) => {
  const user = await getUserById(userId);
  await pool.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [body.name, body.email, userId]);
  return { ...user, name: body.name, email: body.email };
};

const deleteUser = async (userId) => {
  const user = await getUserById(userId);
  await pool.query("DELETE FROM users WHERE id = ?", [userId]);
  return user;
};

module.exports = { getAllUsers, getUserById, postUser, putUser, deleteUser };
