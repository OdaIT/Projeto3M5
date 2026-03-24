const pool = require("../db");
const taskService = require("./taskService");

const getAllTags = async () => {
  const [rows] = await pool.query("SELECT * FROM tags");
  return rows;
};

const getTagById = async (tagId) => {
  const [rows] = await pool.query("SELECT * FROM tags WHERE id = ?", [tagId]);
  if (rows.length === 0) throw new Error("Tag not found");
  return rows[0];
};

const postTag = async (body) => {
  if (!body.name || typeof body.name !== "string" || body.name.trim() === "") {
    throw new Error("Tag name required or invalid");
  }
  const [result] = await pool.query("INSERT INTO tags (name) VALUES (?)", [body.name.trim()]);
  return { id: result.insertId, name: body.name.trim() };
};

const deleteTag = async (tagId) => {
  const tag = await getTagById(tagId);
  await taskService.removeTaskTagsByTagId(parseInt(tagId));
  await pool.query("DELETE FROM tags WHERE id = ?", [tagId]);
  return tag;
};

module.exports = { getAllTags, getTagById, postTag, deleteTag };
