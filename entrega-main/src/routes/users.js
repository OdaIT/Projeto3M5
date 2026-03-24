const express = require("express");
const userController = require("../controllers/userController");
const checkEmail = require("../middlewares/checkEmailMiddleware");
const checkUserId = require("../middlewares/checkUserExistsMiddleware");

const router = express.Router();

router.get("/", userController.getUsers);
router.get("/:id", checkUserId, userController.getUserbyId);
router.post("/", checkUserId, checkEmail, userController.postUser);
router.put("/:id", checkUserId, checkEmail, userController.putUser);
router.delete("/:id", checkUserId, userController.deleteUser);

module.exports = router;