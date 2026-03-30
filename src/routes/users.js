const express = require("express");
const userController = require("../controllers/userController");
const {checkUserId, checkEmail} = require("../middlewares/checkUserMiddleware");
const router = express.Router();

router.get("/", userController.getUsers);
router.get("/stats", userController.getUserStats);
router.get("/:id", checkUserId, userController.getUserbyId);
router.post("/", checkEmail, userController.postUser);
router.put("/:id", checkUserId, checkEmail, userController.putUser);
router.patch("/:id", checkUserId, userController.patchUser);
router.delete("/:id", checkUserId, userController.deleteUser);
router.post("/:id/tasks", checkUserId, userController.postTaskToUser);
router.get("/:id/tasks", checkUserId, userController.getTasksByUser);
router.delete("/:id/tasks/:taskId", checkUserId, userController.deleteTaskFromUser);


module.exports = router;

//redone