const pool = require("../db");

//verifica se a tag já existe
const checkTagName = async (req, res, next) => {
  const name = req.body.name;
  try {
    const [rows] = await pool.query("SELECT * FROM tags");
    const exists = rows.find((row) => row.name.toLowerCase() === name.toLowerCase());
    if(exists){
      res.status(400).json({ message: "Tag already exists" });
    }else if(req.body.name.length > 20){
      res.status(400).json({ message: "Name too long, max 20 chars" });
    }else{
      next();
    }
  } catch (error) {
    res.status(500).json({ message: "There was an issue acessing the DB", error: error.message });
  }
}

//verifica se a TagId existe
const checkTagId = async (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    const [rows] = await pool.query("SELECT * FROM tags");
    const exists = rows.find((row) => row.id === id);
    if (!exists) {
      res.status(404).json({ message: "Tag not found" });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json({ message: "There was an issue acessing the DB", error: error.message });
  }
};

//error: error.message apenas para verificar o que a BD envia

module.exports = { checkTagName, checkTagId };

//redone