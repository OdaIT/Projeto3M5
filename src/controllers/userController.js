const userService = require("../services/userService");
const taskService = require("../services/taskService");

const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers(req.query.sort, req.query.search);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error getting users" });
  }
}

const getUserStats = async (req, res) => {
  try {
    const stats = await userService.getUserStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error getting user stats" });
  }
};

const patchUser = async (req, res) => {
  try {
    const user = await userService.patchUserStatus(req.params.id, req.body.status);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error patching user" });
  }
};

const getUserbyId = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: "Error getting user by id" });
  }
};

const postUser = async (req, res) => {
  try {
    const user = await userService.postUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error posting user" });
  }
};

const putUser = async (req, res) => {
  try {
    const user = await userService.putUser(req.params.id, req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: "Error altering user" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

const postTaskToUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  const { taskId } = req.body;

  try { await userService.getUserById(userId); }
  catch { return res.status(404).json({ message: "User not found" }); }

  try { await taskService.getTaskById(taskId); }
  catch { return res.status(404).json({ message: "Task not found" }); }

  try {
    const association = await userService.postTaskToUser(userId, taskId);
    if (!association) return res.status(409).json({ message: "Association already exists" });
    res.status(201).json(association);
  } catch (err) {
    res.status(500).json({ message: "Error assigning task to user" });
  }
};


const getTasksByUser = async (req, res) => {
  try {
    const tasks = await userService.getTasksByUser(parseInt(req.params.id));
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: `Error getting tasks for user ${req.params.id}` });
  }
};

const deleteTaskFromUser = async (req, res) => {
  try {
    await userService.deleteTaskFromUser(parseInt(req.params.id), parseInt(req.params.taskId));
    res.status(200).json({ message: `Task ${req.params.taskId} removed from user ${req.params.id}` });
  } catch (err) {
    res.status(500).json({ message: "Error removing task from user" });
  }
};

module.exports = { getUsers, getUserStats, getUserbyId, postUser, putUser, patchUser, deleteUser, postTaskToUser, getTasksByUser, deleteTaskFromUser};

//redone