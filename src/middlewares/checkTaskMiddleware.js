const pool = require("../db");

const checkTaskId = async (req, res, next) => {
    try {
        const [rows] = await pool.query("SELECT id FROM tasks");
        const id = parseInt(req.params.id);
        const exists = rows.find((row)=> row.id === id);
        if(!exists){
            res.status(404).json({ message: "Id doesnt exist" })
        }else{
            next();
        }
    } catch (error) {
        res.status(500).json({ message: "There was an issue acessing the task Id", error: error.message }); 
    }
};

const checkTaskTitle = (req, res, next) => {
    try {
        const title = req.body.title;
        if (typeof title !== "string" || title === "" || title.length < 3) {
            res.status(406).json({ message: "Invalid title" });    
        }else{
            next(); 
        }
    } catch (error) {
        res.status(500).json({ message: "There was an issue with the title", error: error.message });  
    }
}

const checkCommentContent = (req, res, next) => {
    try {
        const content = req.body.content;
        if (typeof content !== "string" || content === "" || content.length < 3) {
            res.status(406).json({ message: "Invalid content" });    
        }else{
            next();
        }
    } catch (error) {
        res.status(500).json({ message: "There was an issue with the content", error: error.message });  
    }
}

const checkCommentId = async (req, res, next) => {
    try {
        const [rows] = await pool.query("SELECT id FROM comments");
        const id = parseInt(req.params.commentId);
        const exists = rows.find((row)=> row.id === id);
        if(!exists){
            res.status(404).json({ message: "Id doesnt exist" })
        }else{
            next();
        }
    } catch (error) {
        res.status(500).json({ message: "There was an issue acessing the comment Id", error: error.message }); 
    } 
}



module.exports = { checkTaskTitle, checkTaskId, checkCommentContent, checkCommentId };

//redone