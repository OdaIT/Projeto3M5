const express = require("express");
const tagController = require("../controllers/tagController");
const checkTagName = require("../middlewares/checkTagNameMiddleware");
const checkTaskId = require("../middlewares/checkTaskMiddleware").checkTaskId;

const router = express.Router();

router.get("/", tagController.getTags);
router.get("/:id", checkTaskId, tagController.getTagById);
router.post("/", checkTagName, tagController.postTag);
router.delete("/:id", checkTaskId, tagController.deleteTag);
router.get("/:id/tasks", tagController.getTasksByTag);

module.exports = router;