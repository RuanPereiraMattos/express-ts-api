import { useState, useEffect, useCallback } from 'react';
import { getUsers, createUser, updateUser, deleteUser, type User } from './api';

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const load = useCallback(async () => {
    try {
      setUsers(await getUsers());
    } catch {
      setError('Failed to load users.');
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await createUser(newName.trim(), newEmail.trim());
      setNewName('');
      setNewEmail('');
      await load();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  function startEdit(user: User) {
    setEditingId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
  }

  async function handleUpdate(id: string) {
    setError('');
    try {
      await updateUser(id, editName.trim(), editEmail.trim());
      setEditingId(null);
      await load();
    } catch {
      setError('Failed to update user.');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this user?')) return;
    setError('');
    try {
      await deleteUser(id);
      await load();
    } catch {
      setError('Failed to delete user.');
    }
  }

  return (
    <div className="container">
      <h1>Users</h1>

      <form className="create-form" onSubmit={handleCreate}>
        <input
          placeholder="Name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newEmail}
          onChange={e => setNewEmail(e.target.value)}
          required
        />
        <button type="submit">Add user</button>
      </form>

      {error && <p className="error">{error}</p>}

      {users.length === 0 ? (
        <p className="empty">No users yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user =>
              editingId === user.id ? (
                <tr key={user.id}>
                  <td>
                    <input value={editName} onChange={e => setEditName(e.target.value)} />
                  </td>
                  <td>
                    <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} />
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="actions">
                    <button className="save" onClick={() => handleUpdate(user.id)}>Save</button>
                    <button className="cancel" onClick={() => setEditingId(null)}>Cancel</button>
                  </td>
                </tr>
              ) : (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="actions">
                    <button className="edit" onClick={() => startEdit(user)}>Edit</button>
                    <button className="delete" onClick={() => handleDelete(user.id)}>Delete</button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
