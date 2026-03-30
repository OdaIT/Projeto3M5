import { User } from "../models/user";
import { Task } from "../models/task";
import { UserTask } from "../models/userTask";

const BASE_URL = "http://localhost:3000";

// GET /users
export async function getAllUsers(): Promise<User[]> {
  try {
    const res = await fetch(`${BASE_URL}/users`);

    if (!res.ok) {
      throw new Error("Erro ao buscar users");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// GET /users/stats
export async function getUserStats(): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/users/stats`);

    if (!res.ok) {
      throw new Error("Erro ao buscar stats dos users");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// GET /users/:id
export async function getUserById(id: number): Promise<User> {
  try {
    const res = await fetch(`${BASE_URL}/users/${id}`);

    if (!res.ok) {
      throw new Error("Erro ao buscar user por id");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// POST /users
export async function postUser(name: string, email: string): Promise<User> {
  try {
    const res = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    });
        //Erro 409 Conflict, para quando o email ja está em uso.
    if (res.status === 409) {
      throw new Error("Email já em utilização");
    }
    if (!res.ok) {
      throw new Error("Erro ao criar user");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// PUT /users/:id
export async function putUser(id: number, user: User): Promise<User> {
  try {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!res.ok) {
      throw new Error("Erro ao atualizar user");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// PATCH /users/:id
export async function patchUserStatus(id: number, status: boolean): Promise<User> {
  try {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      throw new Error("Erro ao modificar status do user");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// DELETE /users/:id
export async function deleteUser(id: number): Promise<User> {
  try {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Erro ao apagar user");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// POST /users/:id/tasks
export async function assignTaskToUser(userId: number, taskId: number): Promise<UserTask> {
  try {
    const res = await fetch(`${BASE_URL}/users/${userId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId }),
    });
    if (!res.ok) throw new Error("Erro ao associar task ao user");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// GET /users/:id/tasks
export async function getTasksByUser(userId: number): Promise<Task[]> {
  try {
    const res = await fetch(`${BASE_URL}/users/${userId}/tasks`);
    if (!res.ok) throw new Error("Erro ao buscar tasks do user");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// DELETE /users/:id/tasks/:taskId
export async function removeTaskFromUser(userId: number, taskId: number): Promise<{ message: string }> {
  try {
    const res = await fetch(`${BASE_URL}/users/${userId}/tasks/${taskId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erro ao apagar task do user");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}