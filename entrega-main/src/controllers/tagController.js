const tagService = require("../services/tagService");
const taskService = require("../services/taskService");

const getTags = async (req, res) => {
  const tags = await tagService.getAllTags();
  res.json(tags);
};

const postTag = async (req, res) => {
  try {
    const tag = await tagService.postTag(req.body);
    res.status(201).json(tag);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getTagById = async (req, res) => {
  try {
    const tag = await tagService.getTagById(req.params.id);
    res.status(200).json(tag);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteTag = async (req, res) => {
  try {
    const tag = await tagService.deleteTag(req.params.id);
    res.status(200).json(tag);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getTasksByTag = async (req, res) => {
  const tagId = parseInt(req.params.id);

  try {
    await tagService.getTagById(tagId);
  } catch {
    return res.status(404).json({ message: "Tag not found" });
  }

  let tasks = await taskService.getTasksByTagId(tagId);

  if (req.query.done !== undefined) {
    const done = req.query.done === "true";
    tasks = tasks.filter((t) => t.done === done);
  }

  res.json(tasks);
};

module.exports = { getTags, postTag, deleteTag, getTasksByTag, getTagById };
