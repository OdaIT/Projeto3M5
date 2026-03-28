import {
  getTasks,
  getStats,
  postTask,
  getTaskById,
  deleteTask,
  patchTaskDone,
  addTagToTask,
  updateTaskTag
} from "./api/apiTaskService.js";
import { Task } from "./models/task";
import { User } from "./models/user";
import { Tag } from "./models/tag";
import { Stats } from "./models/stats.js";

// estado do frontend
let tasks: Task[] = [];
let users: User[] = [];
let tags: Tag[] = [];
let stats: Stats = { total: 0, done: 0, pending: 0 };

// Test deleteTask
const deleted = await deleteTask(11);
console.log("Deleted task:", deleted);

tasks = await getTasks();
stats = await getStats();
const newTask = await postTask("My new task");
const taskId = await getTaskById(12);

console.log(newTask);
console.log(tasks);
console.log(users);
console.log(tags);
console.log(stats);
console.log(taskId);


// Test patchTaskDone
const patched = await patchTaskDone(1, true);
console.log("Patched done:", patched);

// Test addTagToTask
const association = await addTagToTask(1, 2);
console.log("Added tag to task:", association);

// Test updateTaskTag
const updatedTag = await updateTaskTag(1, 1, { taskId: 1, tagId: 3 });
console.log("Updated task tag:", updatedTag);

console.log(taskId);