import {
  getTasks,
  getStats,
  postTask,
  getTaskById,
  deleteTask,
  patchTaskDone,
  addTagToTask,
  updateTaskTag,
  getTaskTagsById,
  updateTask,
} from "./api/apiTaskService.js";
import {
  getAllTags,
  getTagById,
  postTag,
  deleteTag,
  getTasksByTagId,
  deleteTaskTag,
} from "./api/apiTagService.js";
import {
  getAllUsers,
  getUserStats,
  getUserById,
  postUser,
  putUser,
  patchUserStatus,
  deleteUser,
  postTaskToUser,
  getTasksByUser,
  deleteTaskFromUser,
} from "./api/apiUserService.js";

// ── READ ──────────────────────────────────────────────────────────────────────

/*// Test getTasks
const allTasks = await getTasks();
console.log("All tasks:", allTasks);

// Test getStats
const allStats = await getStats();
console.log("Stats:", allStats);

// Test getTaskById 
const taskById = await getTaskById(5);
console.log("Task by id:", taskById);

// Test getTaskTagsById
const taskTags = await getTaskTagsById(1);
console.log("Tags of task 1:", taskTags);

// Test getAllTags
const allTags = await getAllTags();
console.log("All tags:", allTags);

// Test getTagById
const tag = await getTagById(1);
console.log("Tag by id:", tag);

// Test getTasksByTagId
const tasksByTag = await getTasksByTagId(1);
console.log("Tasks with tag 1:", tasksByTag);

// Test getAllUsers
const allUsers = await getAllUsers();
console.log("All users:", allUsers);

// Test getUserStats
const userStats = await getUserStats();
console.log("User stats:", userStats);

// Test getUserById
const user = await getUserById(1);
console.log("User by id:", user);

// Test getTasksByUser
const userTasks = await getTasksByUser(2);
console.log("Tasks of user 2:", userTasks);

// ── CREATE ────────────────────────────────────────────────────────────────────

// Test postTask
const newTask = await postTask("My new task");
console.log("New Task:", newTask);

// Test postTag
const newTag = await postTag("teste");
console.log("Created tag:", newTag);

// Test postUser
const newUser = await postUser("John Doe", "john@example.com");
console.log("Created user:", newUser);

// ── UPDATE ────────────────────────────────────────────────────────────────────

// Test patchTaskDone
const patched = await patchTaskDone(1, true);
console.log("Patched done:", patched);

// Test addTagToTask
const association = await addTagToTask(1, 2);
console.log("Added tag to task:", association);

// Test updateTaskTag
const updatedTag = await updateTaskTag(1, 1, { taskId: 2, tagId: 3 });
console.log("Updated task tag:", updatedTag);

// Test updateTask
const updatedTask = await updateTask(2, { id: 2, title: "Add dark mode support (updated)", done: false });
console.log("Updated task:", updatedTask);

// Test patchUserStatus
const patchedUser = await patchUserStatus(1, false);
console.log("Patched user status:", patchedUser);

// Test putUser
const updated = await putUser(1, {
  id: 1,
  name: "Jane Doe Tester",
  email: "jane@example.com",
  status: true,
});
console.log("Updated user:", updated);

// Test postTaskToUser
const posted = await postTaskToUser(3, newTask.id);
console.log("posted task to user:", posted);

// ── DELETE (associations before entities) ─────────────────────────────────────

// Test deleteTaskTag
await deleteTaskTag(1, 2);
console.log("Removed tag 2 from task 1");

// Test deleteTaskFromUser 
const removedUserTask = await deleteTaskFromUser(1, 6);
console.log("Removed task from user:", removedUserTask);

// Test deleteTag 
const deletedTag = await deleteTag(newTag.id);
console.log("Deleted tag:", deletedTag);

// Test deleteTask
const deletedTask = await deleteTask(newTask.id);
console.log("Deleted task:", deletedTask);

// Test deleteUser
const deleted = await deleteUser(newUser.id);
console.log("Deleted user:", deleted);*/


const showusers = await getAllUsers();

const div = document.getElementById("utilizadores")!;
div.innerHTML = showusers.map(user => `
  <p><strong>ID:</strong> ${user.id} |
     <strong>Name:</strong> ${user.name} |
     <strong>Email:</strong> ${user.email} |
     <strong>Status:</strong> ${user.status ? "Active" : "Inactive"}
  </p>
`).join("");

const showtasks = await getTasks();

const div2 = document.getElementById("tarefas")!;
div2.innerHTML = showtasks.map(task => `
  <p><strong>ID:</strong> ${task.id} |
     <strong>title:</strong> ${task.title} |
     <strong>Done:</strong> ${task.done}
  </p>
`).join("");

const showtags = await getAllTags();

const div3 = document.getElementById("tags")!;
div3.innerHTML = showtags.map(tag => `
  <p><strong>ID:</strong> ${tag.id} |
     <strong>Name:</strong> ${tag.name}
  </p>
`).join("");