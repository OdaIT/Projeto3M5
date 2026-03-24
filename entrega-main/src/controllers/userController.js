const userService = require("../services/userService");

const getUsers = async (req, res) => {
  const users = await userService.getAllUsers();
  res.json(users);
};

const getUserbyId = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const postUser = async (req, res) => {
  const user = await userService.postUser(req.body);
  res.status(201).json(user);
};

const putUser = async (req, res) => {
  try {
    const user = await userService.putUser(req.params.id, req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

module.exports = { getUsers, postUser, putUser, deleteUser, getUserbyId };
