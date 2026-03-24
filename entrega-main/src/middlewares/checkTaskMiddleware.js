const taskService = require("../services/taskService");

const checkTaskTitle = (req, res, next) => {
    const title = req.body.title;
    if (typeof(title) !== "string" || title.length < 3){
        return res.status(409).json({ message: "Invalid title for task" })
    }

    next();
}

const checkTaskId = (req, res, next) => {
    const id = parseInt(req.params.id);
    if(!taskService.getAllTasks().find((u) => u.id === id)){
        return res.status(404).json({ message: "Task not found" })
    }
    next();
}

module.exports = { checkTaskTitle, checkTaskId };