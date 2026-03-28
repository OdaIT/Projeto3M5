import { Task } from "../models/task";
//import { User } from "../models/user";
import { Tag } from "../models/tag";
import { Stats } from "../models/stats";

const BASE_URL = "http://localhost:3000";

// GET /tasks
export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${BASE_URL}/tasks`);

  if (!res.ok) {
    throw new Error("Erro ao buscar tasks");
  }

  return await res.json();
}

//GET /tasks/stats
export async function getStats(): Promise<Stats> {
  const res = await fetch(`${BASE_URL}/tasks/stats`);

  if (!res.ok) {
    throw new Error("Erro ao buscar os stats");
  }

  return await res.json();
}

// GET /tasks/:id/tags
export async function getTaskTagsById(id: number): Promise<Tag[]> {
  const res = await fetch(`${BASE_URL}/tasks/${id}/tags`);

  if (!res.ok) {
    throw new Error("Erro ao buscar tags da task");
  }

  return await res.json();
}

export async function getTaskById(id: number): Promise<Task> {
  const res = await fetch(`${BASE_URL}/tasks/${id}`);

  if (!res.ok) {
    throw new Error("Erro ao buscar task por id");
  }

  return await res.json();
}

// PUT /tasks/:id
export async function updateTask(id: number, task: Task): Promise<Task> {
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
export async function postTask(title: string): Promise<Task> {
  const res = await fetch(`${BASE_URL}/tasks/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) {
    throw new Error("Erro ao postar task");
  }

  return await res.json();
}

// POST /tasks/:id/tags
export async function addTagToTask(taskId: number, tagId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}/tags`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tagId }),
  });

  if (!res.ok) {
    throw new Error("Erro ao adicionar tag à task");
  }
}

// PUT /tasks/:id/tags/:taskTagId
export async function updateTaskTag(taskId: number, taskTagId: number, body: { taskId: number, tagId: number }): Promise<void> {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}/tags/${taskTagId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Erro ao atualizar task tag");
  }
}

// PATCH /tasks/:id/done
export async function patchTaskDone(id: number, done: boolean): Promise<Task> {
  const res = await fetch(`${BASE_URL}/tasks/${id}/done`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ done }),
  });

  if (!res.ok) {
    throw new Error("Erro ao alterar done da task");
  }

  return await res.json();
}

// DELETE /tasks/:id
export async function deleteTask(id: number): Promise<Task> {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Erro ao apagar task");
  }

  return await res.json();
}