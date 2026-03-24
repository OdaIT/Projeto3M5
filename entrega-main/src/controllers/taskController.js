const taskService = require("../services/taskService");
const tagService = require("../services/tagService");
const taskTagService = require("../services/taskTagService");

const getTasks = async (req, res) => {
  const tasks = await taskService.getAllTasks();
  res.json(tasks);
};

const postTask = async (req, res) => {
  const task = await taskService.postTask(req.body);
  res.status(201).json(task);
};

const putTask = async (req, res) => {
  try {
    const task = await taskService.putTask(req.params.id, req.body);
    res.status(200).json(task);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    await taskService.deleteTask(req.params.id);
    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const addTagToTask = async (req, res) => {
  const taskId = parseInt(req.params.id);
  const tagId = req.body.tagId;

  try {
    await taskService.getTaskById(taskId);
  } catch {
    return res.status(404).json({ message: "Task not found" });
  }

  try {
    tagService.getTagById(tagId);
  } catch {
    return res.status(404).json({ message: "Tag not found" });
  }

  const association = await taskService.addTaskTag(taskId, tagId);
  if (!association) {
    return res.status(409).json({ message: "Association already exists" });
  }

  res.status(201).json(association);
};

const getTagsByTask = async (req, res) => {
  const taskId = parseInt(req.params.id);

  try {
    await taskService.getTaskById(taskId);
  } catch {
    return res.status(404).json({ message: "Task not found" });
  }

  const tagIds = await taskService.getTagsByTaskId(taskId);
  const tags = await Promise.all(
    tagIds.map((id) => tagService.getTagById(id).catch(() => null))
  );
  res.json(tags.filter(Boolean));
};

const patchTaskDone = async (req, res) => {
  try {
    const task = await taskService.patchDone(req.params.id, req.body.done);
    res.status(200).json(task);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const putTaskTag = async (req, res) => {
  const taskId = parseInt(req.params.id);

  try {
    await taskService.getTaskById(taskId);
  } catch {
    return res.status(404).json({ message: "Task not found" });
  }

  if (req.body.tagId !== undefined) {
    try {
      tagService.getTagById(req.body.tagId);
    } catch {
      return res.status(404).json({ message: "Tag not found" });
    }
  }

  try {
    const taskTag = await taskTagService.putTaskTag(req.params.taskTagId, req.body);
    res.status(200).json(taskTag);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = { getTasks, postTask, putTask, deleteTask, addTagToTask, getTagsByTask, patchTaskDone, putTaskTag };
