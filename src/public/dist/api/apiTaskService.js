const BASE_URL = "http://localhost:3000";
// GET /tasks
export async function getTasks() {
    const res = await fetch(`${BASE_URL}/tasks`);
    if (!res.ok) {
        throw new Error("Erro ao buscar tasks");
    }
    return await res.json();
}
//GET /tasks/stats
export async function getStats() {
    const res = await fetch(`${BASE_URL}/tasks/stats`);
    if (!res.ok) {
        throw new Error("Erro ao buscar os stats");
    }
    return await res.json();
}
// GET /tasks/:id/tags
export async function getTaskTagsById(id) {
    const res = await fetch(`${BASE_URL}/tasks/${id}/tags`);
    if (!res.ok) {
        throw new Error("Erro ao buscar tags da task");
    }
    return await res.json();
}
export async function getTaskById(id) {
    const res = await fetch(`${BASE_URL}/tasks/${id}`);
    if (!res.ok) {
        throw new Error("Erro ao buscar task por id");
    }
    return await res.json();
}
// PUT /tasks/:id
export async function updateTask(id, task) {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
    });
    if (!res.ok) {
        throw new Error("Erro ao atualizar task");
    }
    return await res.json();
}
// POST	/tasks
export async function postTask(title) {
    const res = await fetch(`${BASE_URL}/tasks/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
    });
    if (!res.ok) {
        throw new Error("Erro ao postar uma task");
    }
    return await res.json();
}
// POST /tasks/:id/tags
export async function addTagToTask(taskId, tagId) {
    const res = await fetch(`${BASE_URL}/tasks/${taskId}/tags`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ tagId }),
    });
    if (!res.ok) {
        throw new Error("Erro ao adicionar uma tag à task");
    }
    return await res.json();
}
// PUT /tasks/:id/tags/:taskTagId
export async function updateTaskTag(taskId, taskTagId, body) {
    const res = await fetch(`${BASE_URL}/tasks/${taskId}/tags/${taskTagId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        throw new Error("Erro ao alterar uma task tag");
    }
    return await res.json();
}
// PATCH /tasks/:id/done
export async function patchTaskDone(id, done) {
    const res = await fetch(`${BASE_URL}/tasks/${id}/done`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ done }),
    });
    if (!res.ok) {
        throw new Error("Erro ao modificar uma done da task");
    }
    return await res.json();
}
// DELETE /tasks/:id
export async function deleteTask(id) {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        throw new Error("Erro ao apagar uma task");
    }
    return await res.json();
}
