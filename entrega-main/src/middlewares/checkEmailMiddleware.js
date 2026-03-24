const userService = require("../services/userService");

//verifica se o email já pertence a algum user, POST E PUT
const checkEmail = (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;
  try {
    userService.getAllUsers().find(
    (u) => u.email.toLowerCase() === email.toLowerCase());
  } catch (error) {
    return res.status(409).json({ message: "Invalid email / format" })
  }

  const exists = userService.getAllUsers().find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (exists && (name !== undefined || null || "")) {
    return res.status(409).json({ message: "Email already in use or invalid name" });
  }

  next();
};

module.exports = checkEmail;
