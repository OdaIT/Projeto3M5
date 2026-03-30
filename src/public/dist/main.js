import { getTasks, getStats, postTask, updateTask, patchTaskDone, deleteTask, getTaskTagsById, addTagToTask } from "./api/apiTaskService.js";
import { getAllUsers, getUserStats, postUser, putUser, patchUserStatus, deleteUser, assignTaskToUser, getTasksByUser, removeTaskFromUser } from "./api/apiUserService.js";
import { getAllTags, postTag, deleteTaskTag, deleteTag } from "./api/apiTagService.js";
let allTasks = [];
let allUsers = [];
let allTags = [];
let taskTagsMap = {};
let taskUserMap = {};
const TAG_COLORS = [
    "#e57373", "#f06292", "#ba68c8", "#7986cb",
    "#4fc3f7", "#4db6ac", "#81c784", "#ffb74d",
    "#a1887f", "#90a4ae"
];
function tagColor(id) {
    return TAG_COLORS[id % TAG_COLORS.length];
}
async function loadTaskTags() {
    const entries = await Promise.all(allTasks.map(async (t) => [t.id, await getTaskTagsById(t.id)]));
    taskTagsMap = Object.fromEntries(entries);
}
async function loadTaskUsers() {
    const map = {};
    for (const t of allTasks)
        map[t.id] = null;
    for (const u of allUsers) {
        const tasks = await getTasksByUser(u.id);
        for (const t of tasks)
            map[t.id] = u;
    }
    taskUserMap = map;
}
function renderUsers() {
    const sortVal = document.getElementById("user-sort").value;
    const showVal = document.getElementById("user-show").value;
    const searchEmail = document.getElementById("user-search-email").value.toLowerCase().trim();
    let users = [...allUsers];
    if (showVal === "active")
        users = users.filter(u => u.status);
    else if (showVal === "inactive")
        users = users.filter(u => !u.status);
    if (searchEmail) {
        users = users.filter(u => u.email.toLowerCase().includes(searchEmail));
    }
    users.sort((a, b) => sortVal === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
    const tbody = document.getElementById("users-tbody");
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
function renderTasks() {
    const sortVal = document.getElementById("task-sort").value;
    const showVal = document.getElementById("task-show").value;
    const searchTitle = document.getElementById("task-search-title").value.toLowerCase().trim();
    let tasks = [...allTasks];
    if (showVal === "pending")
        tasks = tasks.filter(t => !t.done);
    else if (showVal === "done")
        tasks = tasks.filter(t => t.done);
    if (searchTitle) {
        tasks = tasks.filter(t => {
            const tags = taskTagsMap[t.id] || [];
            return t.title.toLowerCase().includes(searchTitle) ||
                tags.some(tag => tag.name.toLowerCase().includes(searchTitle));
        });
    }
    tasks.sort((a, b) => sortVal === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));
    const tbody = document.getElementById("tasks-tbody");
    tbody.innerHTML = tasks.map(t => {
        const tags = taskTagsMap[t.id] || [];
        const tagPills = tags.map(tag => `<span class="tag-pill" style="background-color:${tagColor(tag.id)}">${tag.name}<button class="tag-remove" onclick="removeTag(${t.id}, ${tag.id})">x</button></span>`).join("");
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
    // bind add-tag selects
    tasks.forEach(t => {
        const sel = document.getElementById(`add-tag-${t.id}`);
        if (sel) {
            sel.addEventListener("change", async () => {
                const tagId = parseInt(sel.value);
                if (!tagId)
                    return;
                await addTagToTask(t.id, tagId);
                await reloadTasks();
            });
        }
        const userSel = document.getElementById(`add-user-${t.id}`);
        if (userSel) {
            userSel.addEventListener("change", async () => {
                const userId = parseInt(userSel.value);
                if (!userId)
                    return;
                await assignTaskToUser(userId, t.id);
                await reloadTasks();
            });
        }
    });
}
async function loadStats() {
    const [taskStats, userStats] = await Promise.all([getStats(), getUserStats()]);
    document.getElementById("total-users").textContent = `Total Users: ${userStats.total}`;
    document.getElementById("inactive-users").textContent = `Inactive: ${userStats.inactive}`;
    document.getElementById("active-users").textContent = `Active: ${userStats.active}`;
    document.getElementById("total-tasks").textContent = `Total Tasks: ${taskStats.total}`;
    document.getElementById("pending-tasks").textContent = `Pending Tasks: ${taskStats.pending}`;
    document.getElementById("done-tasks").textContent = `Tasks Done: ${taskStats.done}`;
}
async function reloadTasks() {
    allTasks = await getTasks();
    await loadTaskTags();
    await loadTaskUsers();
    renderTasks();
    await loadStats();
}
function renderAllTags() {
    const container = document.getElementById("all-tags-container");
    container.innerHTML = allTags.map(tag => `<span class="tag-pill" style="background-color:${tagColor(tag.id)}">${tag.name}<button class="tag-remove" onclick="deleteTagRow(${tag.id})">x</button></span>`).join("");
}
async function loadData() {
    [allUsers, allTasks, allTags] = await Promise.all([getAllUsers(), getTasks(), getAllTags()]);
    await loadTaskTags();
    await loadTaskUsers();
    renderUsers();
    renderTasks();
    renderAllTags();
    await loadStats();
}
// User actions
window.startEditUser = (id) => {
    const row = document.getElementById(`user-row-${id}`);
    row.querySelectorAll(".display-val").forEach(el => el.style.display = "none");
    row.querySelectorAll(".edit-input").forEach(el => el.style.display = "inline");
    row.querySelector(".btn-edit").style.display = "none";
    row.querySelector(".btn-save").style.display = "inline";
};
window.saveEditUser = async (id, status) => {
    const row = document.getElementById(`user-row-${id}`);
    const inputs = row.querySelectorAll(".edit-input");
    await putUser(id, { id, name: inputs[0].value.trim(), email: inputs[1].value.trim(), status });
    await loadData();
};
window.toggleUserStatus = async (id, currentStatus) => {
    await patchUserStatus(id, !currentStatus);
    await loadData();
};
window.deleteUserRow = async (id) => {
    await deleteUser(id);
    await loadData();
};
// Task actions
window.startEditTask = (id) => {
    const row = document.getElementById(`task-row-${id}`);
    row.querySelectorAll(".display-val").forEach(el => el.style.display = "none");
    row.querySelectorAll(".edit-input").forEach(el => el.style.display = "inline");
    row.querySelector(".btn-edit").style.display = "none";
    row.querySelector(".btn-save").style.display = "inline";
};
window.saveEditTask = async (id, done) => {
    const row = document.getElementById(`task-row-${id}`);
    const input = row.querySelector(".edit-input");
    await updateTask(id, { id, title: input.value.trim(), done });
    await reloadTasks();
};
window.toggleTaskDone = async (id, currentDone) => {
    await patchTaskDone(id, !currentDone);
    await reloadTasks();
};
window.deleteTaskRow = async (id) => {
    await deleteTask(id);
    await reloadTasks();
};
window.removeTag = async (taskId, tagId) => {
    await deleteTaskTag(taskId, tagId);
    await reloadTasks();
};
window.removeUserFromTask = async (userId, taskId) => {
    await removeTaskFromUser(userId, taskId);
    await reloadTasks();
};
window.deleteTagRow = async (id) => {
    await deleteTag(id);
    await loadData();
};
// Init
await loadData();
document.getElementById("create-user-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("user-name");
    const emailInput = document.getElementById("user-email");
    emailInput.setCustomValidity("");
    try {
        await postUser(nameInput.value.trim(), emailInput.value.trim());
        nameInput.value = "";
        emailInput.value = "";
        await loadData();
    }
    catch (err) {
        if (err.message === "Email já em utilização") {
            emailInput.setCustomValidity("Email já em utilização");
            emailInput.reportValidity();
        }
    }
});
document.getElementById("create-item-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const type = document.getElementById("item-type").value;
    const nameInput = document.getElementById("item-name");
    const name = nameInput.value.trim();
    if (type === "task")
        await postTask(name);
    else
        await postTag(name);
    nameInput.value = "";
    await loadData();
});
document.getElementById("user-sort").addEventListener("change", renderUsers);
document.getElementById("user-show").addEventListener("change", renderUsers);
document.getElementById("user-search-email").addEventListener("input", renderUsers);
document.getElementById("task-sort").addEventListener("change", renderTasks);
document.getElementById("task-show").addEventListener("change", renderTasks);
document.getElementById("task-search-title").addEventListener("input", renderTasks);
