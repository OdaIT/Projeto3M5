const commentService = require("../services/commentService");

const getComments = async (req, res) => {
  try {
    const comments = await commentService.getCommentsByTaskId(req.params.id, req.query.order);
    res.json(comments);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const postComment = async (req, res) => {
  try {
    const comment = await commentService.postComment(req.params.id, req.body);
    res.status(201).json(comment);
  } catch (error) {
    if (error.message === "Task not found" || error.message === "User not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
};

const putComment = async (req, res) => {
  try {
    const comment = await commentService.putComment(req.params.commentId, req.body);
    res.status(200).json(comment);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    await commentService.deleteComment(req.params.commentId);
    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteAllComments = async (req, res) => {
  try {
    await commentService.deleteAllComments(req.params.id);
    res.status(200).json({ message: "All comments deleted" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = { getComments, postComment, putComment, deleteComment, deleteAllComments };
