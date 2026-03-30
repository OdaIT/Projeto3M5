import { getTasks, getStats, postTask, updateTask, patchTaskDone, deleteTask, getTaskTagsById, addTagToTask } from "./api/apiTaskService.js";
import { getAllUsers, getUserStats, postUser, putUser, patchUserStatus, deleteUser, assignTaskToUser, getTasksByUser, removeTaskFromUser } from "./api/apiUserService.js";
import { getAllTags, postTag, deleteTaskTag, deleteTag } from "./api/apiTagService.js";
import { Task } from "./models/task";
import { User } from "./models/user";
import { Tag } from "./models/tag";

let allTasks: Task[] = [];
let allUsers: User[] = [];
let allTags: Tag[] = [];
let taskTagsMap: Record<number, Tag[]> = {};
let taskUserMap: Record<number, User | null> = {};

const TAG_COLORS = [
  "#e57373", "#f06292", "#ba68c8", "#7986cb",
  "#4fc3f7", "#4db6ac", "#81c784", "#ffb74d",
  "#a1887f", "#90a4ae"
];

function tagColor(id: number): string {
  return TAG_COLORS[id % TAG_COLORS.length];
}

async function loadTaskTags(): Promise<void> {
  const entries = await Promise.all(
    allTasks.map(async t => [t.id, await getTaskTagsById(t.id)] as [number, Tag[]])
  );
  taskTagsMap = Object.fromEntries(entries);
}

async function loadTaskUsers(): Promise<void> {
  const map: Record<number, User | null> = {};
  for (const t of allTasks) map[t.id] = null;
  for (const u of allUsers) {
    const tasks = await getTasksByUser(u.id);
    for (const t of tasks) map[t.id] = u;
  }
  taskUserMap = map;
}

function renderUsers(): void {
  const sortVal = (document.getElementById("user-sort") as HTMLSelectElement).value;
  const showVal = (document.getElementById("user-show") as HTMLSelectElement).value;
  const searchEmail = (document.getElementById("user-search-email") as HTMLInputElement).value.toLowerCase().trim();

  let users = [...allUsers];
  if (showVal === "active") users = users.filter(u => u.status);
  else if (showVal === "inactive") users = users.filter(u => !u.status);

  if (searchEmail) {
    users = users.filter(u => u.email.toLowerCase().includes(searchEmail));
  }

  users.sort((a, b) =>
    sortVal === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );

  const tbody = document.getElementById("users-tbody")!;
  tbody.innerHTML = users.map(u => `
    <tr id="user-row-${u.id}">
      <td><span class="display-val">${u.name}</span><input class="edit-input" value="${u.name}" style="display:none"></td>
      <td><span class="display-val">${u.email}</span><input class="edit-input" value="${u.email}" style="display:none"></td>
      <td class="${u.status ? "active" : "inactive"}">${u.status ? "Active" : "Inactive"}</td>
      <td class="actions">
        <button class="btn-edit" onclick="startEditUser(${u.id})">Edit</button>
        <button class="btn-save" style="display:none" onclick="saveEditUser(${u.id}, ${u.status})">Save</button>
        <button class="btn-status" onclick="toggleUserStatus(${u.id}, ${u.status})">${u.status ? "Deactivate" : "Activate"}</button>
        <button class="btn-delete" onclick="deleteUserRow(${u.id})">Delete</button>
      </td>
    </tr>
  `).join("");
}

function renderTasks(): void {
  const sortVal = (document.getElementById("task-sort") as HTMLSelectElement).value;
  const showVal = (document.getElementById("task-show") as HTMLSelectElement).value;
  const searchTitle = (document.getElementById("task-search-title") as HTMLInputElement).value.toLowerCase().trim();

  let tasks = [...allTasks];
  if (showVal === "pending") tasks = tasks.filter(t => !t.done);
  else if (showVal === "done") tasks = tasks.filter(t => t.done);

  if (searchTitle) {
    tasks = tasks.filter(t => {
      const tags = taskTagsMap[t.id] || [];
      return t.title.toLowerCase().includes(searchTitle) ||
        tags.some(tag => tag.name.toLowerCase().includes(searchTitle));
    });
  }

  tasks.sort((a, b) =>
    sortVal === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
  );

  const tbody = document.getElementById("tasks-tbody")!;
  tbody.innerHTML = tasks.map(t => {
    const tags = taskTagsMap[t.id] || [];
    const tagPills = tags.map(tag =>
      `<span class="tag-pill" style="background-color:${tagColor(tag.id)}">${tag.name}<button class="tag-remove" onclick="removeTag(${t.id}, ${tag.id})">x</button></span>`
    ).join("");

    const tagOptions = allTags
      .filter(tag => !tags.find(tt => tt.id === tag.id))
      .map(tag => `<option value="${tag.id}">${tag.name}</option>`)
      .join("");

    const addTagSelect = tagOptions
      ? `<select class="add-tag-select" id="add-tag-${t.id}"><option value="">+</option>${tagOptions}</select>`
      : "";

    const assignedUser = taskUserMap[t.id];
    const userEmail = assignedUser
      ? `<div class="task-user-email">${assignedUser.email}<button class="user-remove" onclick="removeUserFromTask(${assignedUser.id}, ${t.id})">x</button></div>`
      : "";

    const userOptions = allUsers
      .map(u => `<option value="${u.id}">${u.email}</option>`)
      .join("");
    const addUserSelect = !assignedUser
      ? `<select class="add-user-select" id="add-user-${t.id}"><option value="">+</option>${userOptions}</select>`
      : "";

    return `
      <tr id="task-row-${t.id}">
        <td><span class="display-val">${t.title}</span>${userEmail}<input class="edit-input" value="${t.title}" style="display:none">${addUserSelect}</td>
        <td><div class="tags-cell">${tagPills}${addTagSelect}</div></td>
        <td class="${t.done ? "done" : "pending"}">${t.done ? "Done" : "Pending"}</td>
        <td class="actions">
          <button class="btn-edit" onclick="startEditTask(${t.id})">Edit</button>
          <button class="btn-save" style="display:none" onclick="saveEditTask(${t.id}, ${t.done})">Save</button>
          <button class="btn-status" onclick="toggleTaskDone(${t.id}, ${t.done})">${t.done ? "Pending" : "Done"}</button>
          <button class="btn-delete" onclick="deleteTaskRow(${t.id})">Delete</button>
        </td>
      </tr>
    `;
  }).join("");

  tasks.forEach(t => {
    const sel = document.getElementById(`add-tag-${t.id}`) as HTMLSelectElement;
    if (sel) {
      sel.addEventListener("change", async () => {
        const tagId = parseInt(sel.value);
        if (!tagId) return;
        await addTagToTask(t.id, tagId);
        await reloadTasks();
      });
    }

    const userSel = document.getElementById(`add-user-${t.id}`) as HTMLSelectElement;
    if (userSel) {
      userSel.addEventListener("change", async () => {
        const userId = parseInt(userSel.value);
        if (!userId) return;
        await assignTaskToUser(userId, t.id);
        await reloadTasks();
      });
    }
  });
}

async function loadStats(): Promise<void> {
  const [taskStats, userStats] = await Promise.all([getStats(), getUserStats()]);
  document.getElementById("total-users")!.textContent = `Total Users: ${userStats.total}`;
  document.getElementById("inactive-users")!.textContent = `Inactive: ${userStats.inactive}`;
  document.getElementById("active-users")!.textContent = `Active: ${userStats.active}`;
  document.getElementById("total-tasks")!.textContent = `Total Tasks: ${taskStats.total}`;
  document.getElementById("pending-tasks")!.textContent = `Pending Tasks: ${taskStats.pending}`;
  document.getElementById("done-tasks")!.textContent = `Tasks Done: ${taskStats.done}`;
}

async function reloadTasks(): Promise<void> {
  allTasks = await getTasks();
  await loadTaskTags();
  await loadTaskUsers();
  renderTasks();
  await loadStats();
}

function renderAllTags(): void {
  const container = document.getElementById("all-tags-container")!;
  container.innerHTML = allTags.map(tag =>
    `<span class="tag-pill" style="background-color:${tagColor(tag.id)}">${tag.name}<button class="tag-remove" onclick="deleteTagRow(${tag.id})">x</button></span>`
  ).join("");
}

async function loadData(): Promise<void> {
  [allUsers, allTasks, allTags] = await Promise.all([getAllUsers(), getTasks(), getAllTags()]);
  await loadTaskTags();
  await loadTaskUsers();
  renderUsers();
  renderTasks();
  renderAllTags();
  await loadStats();
}

// User actions
(window as any).startEditUser = (id: number) => {
  const row = document.getElementById(`user-row-${id}`)!;
  row.querySelectorAll(".display-val").forEach(el => (el as HTMLElement).style.display = "none");
  row.querySelectorAll(".edit-input").forEach(el => (el as HTMLElement).style.display = "inline");
  (row.querySelector(".btn-edit") as HTMLElement).style.display = "none";
  (row.querySelector(".btn-save") as HTMLElement).style.display = "inline";
};

(window as any).saveEditUser = async (id: number, status: boolean) => {
  const row = document.getElementById(`user-row-${id}`)!;
  const inputs = row.querySelectorAll(".edit-input") as NodeListOf<HTMLInputElement>;
  await putUser(id, { id, name: inputs[0].value.trim(), email: inputs[1].value.trim(), status });
  await loadData();
};

(window as any).toggleUserStatus = async (id: number, currentStatus: boolean) => {
  await patchUserStatus(id, !currentStatus);
  await loadData();
};

(window as any).deleteUserRow = async (id: number) => {
  await deleteUser(id);
  await loadData();
};

// Task actions
(window as any).startEditTask = (id: number) => {
  const row = document.getElementById(`task-row-${id}`)!;
  row.querySelectorAll(".display-val").forEach(el => (el as HTMLElement).style.display = "none");
  row.querySelectorAll(".edit-input").forEach(el => (el as HTMLElement).style.display = "inline");
  (row.querySelector(".btn-edit") as HTMLElement).style.display = "none";
  (row.querySelector(".btn-save") as HTMLElement).style.display = "inline";
};

(window as any).saveEditTask = async (id: number, done: boolean) => {
  const row = document.getElementById(`task-row-${id}`)!;
  const input = row.querySelector(".edit-input") as HTMLInputElement;
  await updateTask(id, { id, title: input.value.trim(), done });
  await reloadTasks();
};

(window as any).toggleTaskDone = async (id: number, currentDone: boolean) => {
  await patchTaskDone(id, !currentDone);
  await reloadTasks();
};

(window as any).deleteTaskRow = async (id: number) => {
  await deleteTask(id);
  await reloadTasks();
};

(window as any).removeTag = async (taskId: number, tagId: number) => {
  await deleteTaskTag(taskId, tagId);
  await reloadTasks();
};

(window as any).removeUserFromTask = async (userId: number, taskId: number) => {
  await removeTaskFromUser(userId, taskId);
  await reloadTasks();
};

(window as any).deleteTagRow = async (id: number) => {
  await deleteTag(id);
  await loadData();
};

// Init
await loadData();

document.getElementById("create-user-form")!.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nameInput = document.getElementById("user-name") as HTMLInputElement;
  const emailInput = document.getElementById("user-email") as HTMLInputElement;
  emailInput.setCustomValidity("");
  try {
    await postUser(nameInput.value.trim(), emailInput.value.trim());
    nameInput.value = "";
    emailInput.value = "";
    await loadData();
  } catch (err: any) {
    if (err.message === "Email já em utilização") {
      emailInput.setCustomValidity("Email já em utilização");
      emailInput.reportValidity();
    }
  }
});

document.getElementById("create-item-form")!.addEventListener("submit", async (e) => {
  e.preventDefault();
  const type = (document.getElementById("item-type") as HTMLSelectElement).value;
  const nameInput = document.getElementById("item-name") as HTMLInputElement;
  const name = nameInput.value.trim();
  if (type === "task") await postTask(name);
  else await postTag(name);
  nameInput.value = "";
  await loadData();
});

document.getElementById("user-sort")!.addEventListener("change", renderUsers);
document.getElementById("user-show")!.addEventListener("change", renderUsers);
document.getElementById("user-search-email")!.addEventListener("input", renderUsers);
document.getElementById("task-sort")!.addEventListener("change", renderTasks);
document.getElementById("task-show")!.addEventListener("change", renderTasks);
document.getElementById("task-search-title")!.addEventListener("input", renderTasks);
