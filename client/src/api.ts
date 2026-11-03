export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

const BASE = '/api/users';

export async function getUsers(): Promise<User[]> {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function createUser(name: string, email: string): Promise<User> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? 'Failed to create user');
  }
  return res.json();
}

export async function updateUser(id: string, name: string, email: string): Promise<User> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email }),
  });
  if (!res.ok) throw new Error('Failed to update user');
  return res.json();
}

export async function deleteUser(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete user');
}
