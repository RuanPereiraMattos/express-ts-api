import { Request, Response } from 'express';
import type { CreateUserDto, UpdateUserDto } from '../types/user.js';
import * as usersRepo from '../repositories/users.repository.js';

export async function getUsers(_req: Request, res: Response): Promise<void> {
  const users = await usersRepo.findAll();
  res.status(200).json(users);
}

export async function getUserById(req: Request<{ id: string }>, res: Response): Promise<void> {
  const user = await usersRepo.findById(req.params.id);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.status(200).json(user);
}

export async function createUser(req: Request, res: Response): Promise<void> {
  const { name, email } = req.body as CreateUserDto;
  if (!name || !email) {
    res.status(400).json({ message: 'name and email are required' });
    return;
  }
  if (await usersRepo.emailExists(email)) {
    res.status(409).json({ message: 'Email already in use' });
    return;
  }
  const user = await usersRepo.create({ name, email });
  res.status(201).json(user);
}

export async function updateUser(req: Request<{ id: string }>, res: Response): Promise<void> {
  const { name, email } = req.body as UpdateUserDto;
  const updated = await usersRepo.update(req.params.id, { name, email });
  if (!updated) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.status(200).json(updated);
}

export async function deleteUser(req: Request<{ id: string }>, res: Response): Promise<void> {
  const removed = await usersRepo.remove(req.params.id);
  if (!removed) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.status(204).send();
}
