const tagService = require("../services/tagService");
const taskService = require("../services/taskService");

const getTags = async (req, res) => {
  try {
    const tags = await tagService.getAllTags();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: "Error getting tags" });
  }
};

const postTag = async (req, res) => {
  try {
    const tag = await tagService.postTag(req.body);
    res.status(201).json(tag);
  } catch (error) {
    res.status(400).json({ message: "Error posting the tag" });
  }
};

const getTagById = async (req, res) => {
  try {
    const tag = await tagService.getTagById(req.params.id);
    res.status(200).json(tag);
  } catch (error) {
    res.status(404).json({ message: "Error getting the Tag by Id" });
  }
};

const deleteTag = async (req, res) => {
  try {
    const tag = await tagService.deleteTag(req.params.id);
    res.status(200).json(tag);
  } catch (error) {
    res.status(404).json({ message: "Error deleting tag" });
  }
};

const getTasksByTag = async (req, res) => {
  const tagId = parseInt(req.params.id);
  try {
    await tagService.getTagById(tagId);
  } catch {
    return res.status(404).json({ message: "Tag not found" });
  }

  try {
    const tasks = await taskService.getTasksByTagId(tagId);
    res.json(tasks);
  } catch {
    res.status(500).json({ message: "Error getting tasks by tag" });
  }
};



module.exports = { getTags, postTag, deleteTag, getTasksByTag, getTagById };

//redone