const taskService = require("../services/taskService");
const tagService = require("../services/tagService");


const getTasks = async (req, res) => {
  try {
    const tasks = await taskService.getAllTasks(req.query.sort, req.query.search);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error getting the tasks" });
  }
};

const getTasksById = async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error getting the task" });
  }
};

//returns all tasks,total, done, pending
const getTaskStats = async (req, res) => {
  try {
    const stats = await taskService.getTaskStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error getting the tasks stats" });
  }
};

const postTask = async (req, res) => {
  try {
    const task = await taskService.postTask(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error posting task" });
  }
};

const putTask = async (req, res) => {
  try {
    const task = await taskService.putTask(req.params.id, req.body);
    res.status(200).json(task);
  } catch (error) {
    res.status(404).json({ message: "Error putting task" });
  }
};

const deleteTask = async (req, res) => {
  try {
    await taskService.deleteTask(req.params.id);
    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(404).json({ message: "Error deleting task" });
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
    await tagService.getTagById(tagId);
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
  const tags = await taskService.getTagsByTaskId(taskId);
  res.json(tags);
};


const patchTaskDone = async (req, res) => {
  try {
    const task = await taskService.patchDone(req.params.id, req.body.done);
    res.status(200).json(task);
  } catch (error) {
    res.status(404).json({ message: "Error patching task 'done' parameter" });
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
      await tagService.getTagById(req.body.tagId);
    } catch {
      return res.status(404).json({ message: "Tag not found" });
    }
  }

  try {
    const taskTag = await taskService.putTaskTag(req.params.taskTagId, req.body);
    res.status(200).json(taskTag);
  } catch (error) {
    res.status(404).json({ message: "Error putting tag on task" });
  }
};

const removeTagFromTask = async (req, res) => {
  try {
    await taskService.removeTagFromTask(parseInt(req.params.id), parseInt(req.params.tagId));
    res.status(200).json({ message: `Tag ${req.params.tagId} removed from task ${req.params.id}` });
  } catch (error) {
    res.status(500).json({ message: "Error removing tag from task" });
  }
};

module.exports = { getTasks, getTaskStats, postTask, putTask, deleteTask, addTagToTask, getTagsByTask, patchTaskDone, putTaskTag, removeTagFromTask, getTasksById };

//redone