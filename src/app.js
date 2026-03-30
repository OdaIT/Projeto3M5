const path = require("path");
const express = require("express");
const app = express();

app.use(express.json());

//funciona como uma especie de pagina 'mãe/index', caso o user não adicione nada depois de http://localhost:3000
/*app.get("/", (req, res) => {
  res.send("Hello Word");
});*/

app.use(express.static(path.join(__dirname, "public")))

const taskRoutes = require("./routes/tasks");
app.use("/tasks", taskRoutes);

const userRoutes = require("./routes/users");
app.use("/users", userRoutes);

const tagsRoutes = require("./routes/tags");
app.use("/tags", tagsRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

