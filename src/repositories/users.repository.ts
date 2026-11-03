import { randomUUID } from 'node:crypto';
import { client } from '../db.js';
import type { User, CreateUserDto, UpdateUserDto } from '../types/user.js';

export async function initializeDatabase(): Promise<void> {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id       TEXT PRIMARY KEY,
      name     TEXT NOT NULL,
      email    TEXT NOT NULL UNIQUE,
      createdAt TEXT NOT NULL
    )
  `);
}

export async function findAll(): Promise<User[]> {
  const result = await client.execute('SELECT * FROM users ORDER BY createdAt ASC');
  return result.rows.map(rowToUser);
}

export async function findById(id: string): Promise<User | undefined> {
  const result = await client.execute({
    sql: 'SELECT * FROM users WHERE id = ?',
    args: [id],
  });
  return result.rows.length ? rowToUser(result.rows[0]) : undefined;
}

export async function emailExists(email: string): Promise<boolean> {
  const result = await client.execute({
    sql: 'SELECT 1 FROM users WHERE email = ?',
    args: [email],
  });
  return result.rows.length > 0;
}

export async function create(data: CreateUserDto): Promise<User> {
  const user: User = {
    id: randomUUID(),
    name: data.name,
    email: data.email,
    createdAt: new Date().toISOString(),
  };
  await client.execute({
    sql: 'INSERT INTO users (id, name, email, createdAt) VALUES (?, ?, ?, ?)',
    args: [user.id, user.name, user.email, user.createdAt],
  });
  return user;
}

export async function update(id: string, data: UpdateUserDto): Promise<User | undefined> {
  const existing = await findById(id);
  if (!existing) return undefined;
  const updated: User = {
    ...existing,
    ...(data.name !== undefined && { name: data.name }),
    ...(data.email !== undefined && { email: data.email }),
  };
  await client.execute({
    sql: 'UPDATE users SET name = ?, email = ? WHERE id = ?',
    args: [updated.name, updated.email, updated.id],
  });
  return updated;
}

export async function remove(id: string): Promise<boolean> {
  const result = await client.execute({
    sql: 'DELETE FROM users WHERE id = ?',
    args: [id],
  });
  return result.rowsAffected > 0;
}

export async function clearAll(): Promise<void> {
  await client.execute('DELETE FROM users');
}

function rowToUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    createdAt: row.createdAt as string,
  };
}
