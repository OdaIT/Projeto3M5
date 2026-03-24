const userService = require("../services/userService");

const checkUserId = (req, res, next) => {
    const id = parseInt(req.params.id);
    const exists = userService.getAllUsers().find(
    (u) => u.id === id);

    if (!exists) {
    return res.status(409).json({ message: "Id doesnt exist" });
  } else {
    res.status(200).json({ message: "User deleted" })
  }

  next();
}

module.exports = checkUserId;