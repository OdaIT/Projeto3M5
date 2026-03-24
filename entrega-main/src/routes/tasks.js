const express = require("express");
const taskController = require("../controllers/taskController");
const commentController = require("../controllers/commentController");
const { checkTaskTitle, checkTaskId } = require("../middlewares/checkTaskMiddleware.js");
const router = express.Router();

//router das tasks
router.get("/", taskController.getTasks);
router.post("/", checkTaskTitle, taskController.postTask);
router.put("/:id",checkTaskId ,checkTaskTitle, taskController.putTask);
router.delete("/:id",checkTaskId, taskController.deleteTask);
router.patch("/:id/done",checkTaskId, taskController.patchTaskDone);

//router das tags
router.post("/:id/tags", taskController.addTagToTask);
router.get("/:id/tags", taskController.getTagsByTask);
router.put("/:id/tags/:taskTagId", taskController.putTaskTag);

//router dos comments
router.get("/:id/comments", checkTaskId, commentController.getComments);
router.post("/:id/comments", checkTaskId, commentController.postComment);
router.put("/:id/comments/:commentId", checkTaskId, commentController.putComment);
router.delete("/:id/comments/:commentId",checkTaskId, commentController.deleteComment);
router.delete("/:id/comments", checkTaskId, commentController.deleteAllComments)

module.exports = router;