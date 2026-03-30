import { Task } from "../models/task";
//import { User } from "../models/user";
import { Tag } from "../models/tag";
import { Stats } from "../models/stats";
import { TaskTag } from "../models/taskTag";

const BASE_URL = "http://localhost:3000";

// GET /tasks
export async function getTasks(): Promise<Task[]> {
  try {
    const res = await fetch(`${BASE_URL}/tasks`);

    if (!res.ok) {
      throw new Error("Erro ao buscar tasks");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

//GET /tasks/stats
export async function getStats(): Promise<Stats> {
  try {
    const res = await fetch(`${BASE_URL}/tasks/stats`);

    if (!res.ok) {
      throw new Error("Erro ao buscar os stats");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// GET /tasks/:id/tags
export async function getTaskTagsById(id: number): Promise<Tag[]> {
  try {
    const res = await fetch(`${BASE_URL}/tasks/${id}/tags`);

    if (!res.ok) {
      throw new Error("Erro ao buscar tags da task");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getTaskById(id: number): Promise<Task> {
  try {
    const res = await fetch(`${BASE_URL}/tasks/${id}`);

    if (!res.ok) {
      throw new Error("Erro ao buscar task por id");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// PUT /tasks/:id
export async function updateTask(id: number, task: Task): Promise<Task> {
  try {
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

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// POST	/tasks
export async function postTask(title: string): Promise<Task> {
  try {
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

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// POST /tasks/:id/tags
export async function addTagToTask(taskId: number, tagId: number): Promise<void> {
  try {
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
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// PUT /tasks/:id/tags/:taskTagId
export async function updateTaskTag(taskId: number, taskTagId: number, body: { taskId: number, tagId: number }): Promise<TaskTag> {
  try {
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

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// PATCH /tasks/:id/done
export async function patchTaskDone(id: number, done: boolean): Promise<Task> {
  try {
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

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// DELETE /tasks/:id
export async function deleteTask(id: number): Promise<Task> {
  try {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Erro ao apagar uma task");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
