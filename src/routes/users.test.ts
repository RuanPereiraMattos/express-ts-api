import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { initializeDatabase, clearAll } from '../repositories/users.repository.js';

beforeAll(async () => {
  await initializeDatabase();
});

beforeEach(async () => {
  await clearAll();
});

describe('GET /users', () => {
  it('returns 200 with empty array initially', async () => {
    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns all created users', async () => {
    await request(app).post('/users').send({ name: 'Alice', email: 'alice@example.com' });
    await request(app).post('/users').send({ name: 'Bob', email: 'bob@example.com' });

    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

describe('POST /users', () => {
  it('creates a user and returns 201 with full user object', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: 'Alice', email: 'alice@example.com' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: 'Alice', email: 'alice@example.com' });
    expect(res.body.id).toBeDefined();
    expect(res.body.createdAt).toBeDefined();
  });

  it('returns 400 when name is missing', async () => {
    const res = await request(app).post('/users').send({ email: 'alice@example.com' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'name and email are required' });
  });

  it('returns 400 when email is missing', async () => {
    const res = await request(app).post('/users').send({ name: 'Alice' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'name and email are required' });
  });

  it('returns 409 when email is already in use', async () => {
    await request(app).post('/users').send({ name: 'Alice', email: 'alice@example.com' });
    const res = await request(app).post('/users').send({ name: 'Alice2', email: 'alice@example.com' });
    expect(res.status).toBe(409);
    expect(res.body).toEqual({ message: 'Email already in use' });
  });
});

describe('GET /users/:id', () => {
  it('returns 200 with the correct user', async () => {
    const created = await request(app)
      .post('/users')
      .send({ name: 'Alice', email: 'alice@example.com' });

    const res = await request(app).get(`/users/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ name: 'Alice', email: 'alice@example.com' });
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).get('/users/non-existent-id');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'User not found' });
  });
});

describe('PUT /users/:id', () => {
  it('updates the user and returns 200', async () => {
    const created = await request(app)
      .post('/users')
      .send({ name: 'Alice', email: 'alice@example.com' });

    const res = await request(app)
      .put(`/users/${created.body.id}`)
      .send({ name: 'Alice Updated' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Alice Updated');
    expect(res.body.email).toBe('alice@example.com');
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).put('/users/non-existent-id').send({ name: 'X' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /users/:id', () => {
  it('deletes the user and returns 204', async () => {
    const created = await request(app)
      .post('/users')
      .send({ name: 'Alice', email: 'alice@example.com' });

    const res = await request(app).delete(`/users/${created.body.id}`);
    expect(res.status).toBe(204);
  });

  it('returns 404 after deletion on GET', async () => {
    const created = await request(app)
      .post('/users')
      .send({ name: 'Alice', email: 'alice@example.com' });

    await request(app).delete(`/users/${created.body.id}`);

    const res = await request(app).get(`/users/${created.body.id}`);
    expect(res.status).toBe(404);
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).delete('/users/non-existent-id');
    expect(res.status).toBe(404);
  });
});
