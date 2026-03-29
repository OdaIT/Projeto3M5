import { getTasks, getStats, postTask, getTaskById, deleteTask, patchTaskDone, addTagToTask, updateTaskTag, } from "./api/apiTaskService.js";
import { getAllTags, getTagById, postTag, deleteTag, getTasksByTagId, deleteTaskTag, } from "./api/apiTagService.js";
import { getAllUsers, getUserStats, getUserById, postUser, putUser, patchUserStatus, deleteUser, } from "./api/apiUserService.js";
// Test getTasks
const allTasks = await getTasks();
console.log("All tasks:", allTasks);
// Test getStats
const allStats = await getStats();
console.log("Stats:", allStats);
// Test getTaskById
const taskId = await getTaskById(5);
console.log("Task by id:", taskId);
// Test postTask
const newTask = await postTask("My new task");
console.log("New Task:", newTask);
// Test deleteTask
const deletedTask = await deleteTask(9);
console.log("Deleted task:", deletedTask);
// Test patchTaskDone
const patched = await patchTaskDone(1, true);
console.log("Patched done:", patched);
// Test postTag
const newTag = await postTag("teste");
console.log("Created tag:", newTag);
//Test addTagToTask
const association = await addTagToTask(1, 2);
console.log("Added tag to task:", association);
//Test updateTaskTag
const updatedTag = await updateTaskTag(1, 1, { taskId: 2, tagId: 3 });
console.log("Updated task tag:", updatedTag);
// Test getAllTags
const allTags = await getAllTags();
console.log("All tags:", allTags);
// Test getTagById
const tag = await getTagById(1);
console.log("Tag by id:", tag);
// Test getTasksByTagId
const tasksByTag = await getTasksByTagId(1);
console.log("Tasks with tag 1:", tasksByTag);
// Test deleteTag
const deletedTag = await deleteTag(1);
console.log("Deleted tag:", deletedTag);
// Test deleteTaskTag
await deleteTaskTag(1, 2);
console.log("Removed tag 2 from task 1");
// Test getAllUsers
const allUsers = await getAllUsers();
console.log("All users:", allUsers);
// Test getUserStats
const userStats = await getUserStats();
console.log("User stats:", userStats);
// Test getUserById
const user = await getUserById(1);
console.log("User by id:", user);
// Test postUser
const newUser = await postUser("John Doe", "john@example.com");
console.log("Created user:", newUser);
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
// Test deleteUser
const deleted = await deleteUser(1);
console.log("Deleted user:", deleted);
