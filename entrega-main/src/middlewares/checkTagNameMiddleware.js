const tagService = require("../services/tagService");

//verifica se a tag já existe
const checkTagName = (req, res, next) => {
  const { name } = req.body;
  const exists = tagService.getAllTags().find(
    (t) => t.name.toLowerCase() === name?.toLowerCase().trim()
  );

  if (exists) {
    return res.status(409).json({ message: "Tag name already exists" });
  }

  next();
};

module.exports = checkTagName;
