import { User } from "../models/user";

const BASE_URL = "http://localhost:3000";

// GET /users
export async function getAllUsers(): Promise<User[]> {
  const res = await fetch(`${BASE_URL}/users`);

  if (!res.ok) {
    throw new Error("Erro ao buscar users");
  }

  return await res.json();
}

// GET /users/stats
export async function getUserStats(): Promise<any> {
  const res = await fetch(`${BASE_URL}/users/stats`);

  if (!res.ok) {
    throw new Error("Erro ao buscar stats dos users");
  }

  return await res.json();
}

// GET /users/:id
export async function getUserById(id: number): Promise<User> {
  const res = await fetch(`${BASE_URL}/users/${id}`);

  if (!res.ok) {
    throw new Error("Erro ao buscar user por id");
  }

  return await res.json();
}

// POST /users
export async function postUser(name: string, email: string): Promise<User> {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email }),
  });

  if (!res.ok) {
    throw new Error("Erro ao criar user");
  }

  return await res.json();
}

// PUT /users/:id
export async function putUser(id: number, user: User): Promise<User> {
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

  return await res.json();
}

// PATCH /users/:id
export async function patchUserStatus(id: number, status: boolean): Promise<User> {
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

  return await res.json();
}

// DELETE /users/:id
export async function deleteUser(id: number): Promise<User> {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Erro ao apagar user");
  }

  return await res.json();
}