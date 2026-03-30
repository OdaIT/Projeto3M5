import { Tag } from "../models/tag";
import { Task } from "../models/task";

const BASE_URL = "http://localhost:3000";

// GET /tags        //promisse tag[] recebe um array de tags, ou seja, todas as tags
export async function getAllTags(): Promise<Tag[]> {
  try {
    const res = await fetch(`${BASE_URL}/tags`);

    if (!res.ok) {
      throw new Error("Erro ao buscar tags");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// GET /tags/:id        devolve um objeto
export async function getTagById(id: number): Promise<Tag> {
  try {
    const res = await fetch(`${BASE_URL}/tags/${id}`);

    if (!res.ok) {
      throw new Error("Erro ao buscar as tag por id");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// GET /tags/:id/tasks
export async function getTasksByTagId(id: number): Promise<Task[]> {
  try {
    const res = await fetch(`${BASE_URL}/tags/${id}/tasks`);

    if (!res.ok) {
      throw new Error("Erro ao buscar a task da tag por id");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// POST /tags
export async function postTag(name: string): Promise<Tag> {
  try {
    const res = await fetch(`${BASE_URL}/tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      throw new Error("Erro ao criar tag");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// DELETE /tags/:id
export async function deleteTag(id: number): Promise<Tag> {
  try {
    const res = await fetch(`${BASE_URL}/tags/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Erro ao apagar tag");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// DELETE /tasks/:id/tags/:tagId  // devolve a string do taskController -> removeTagFromTask
export async function deleteTaskTag(taskId: number, tagId: number): Promise<{ message: string }> {
  try {
    const res = await fetch(`${BASE_URL}/tasks/${taskId}/tags/${tagId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Erro ao remover tag da task");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
