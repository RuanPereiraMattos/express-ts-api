# express-ts-api

A full-stack app with a **React** frontend and a **REST API** built with **Express v5** and **TypeScript**, with interactive documentation served by **Swagger UI**.

## Tech Stack

- **Frontend**: React 19 + Vite
- **Runtime**: Node.js (ESM)
- **Framework**: Express v5
- **Language**: TypeScript
- **Documentation**: swagger-jsdoc + swagger-ui-express
- **Database**: Turso (libSQL / SQLite)
- **Tests**: Vitest + Supertest

## Getting Started

**Install dependencies:**
```bash
npm install
cd client && npm install && cd ..
```

**Run locally (two terminals):**
```bash
# Terminal 1 — API on :3000
npm run dev

# Terminal 2 — Frontend on :5173
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173) for the app, or [http://localhost:3000/api-docs](http://localhost:3000/api-docs) for the Swagger UI.

## Scripts

```bash
npm run dev          # start API with tsx (no build step needed)
npm run build        # compile TypeScript to dist/
npm run start        # run compiled output (requires build first)
npm test             # run all tests once
npm run test:watch   # run tests in watch mode
```

## API Endpoints

All routes are prefixed with `/api`.

### Health

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Returns current server time |

### Users

| Method | Path | Description |
|---|---|---|
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create a user |
| PUT | `/api/users/:id` | Update a user |
| DELETE | `/api/users/:id` | Delete a user |

> Data persists in Turso (serverless SQLite). Locally you can use `file::memory:` in `.env` for ephemeral testing.

## Project Structure

```
client/                             # React + Vite frontend
├── src/
│   ├── App.tsx                     # CRUD UI
│   └── api.ts                      # fetch wrapper
src/                                # Express API
├── index.ts                        # Entry point — starts the server
├── app.ts                          # Express app setup (without listen)
├── swagger.ts                      # swagger-jsdoc configuration
├── db.ts                           # libSQL client singleton (Turso)
├── types/
│   └── user.ts                     # User, CreateUserDto, UpdateUserDto
├── repositories/
│   └── users.repository.ts         # Async SQL data access (Turso)
├── controllers/
│   └── users.controller.ts         # HTTP handlers
└── routes/
    ├── health.ts                   # GET /api/health
    └── users.ts                    # /api/users routes + OpenAPI annotations
api/
└── index.ts                        # Vercel serverless entry point
```

## Environment Variables

Create a `.env` file at the project root (see `.env.example`):

```env
PORT=3000
TURSO_DATABASE_URL=libsql://<your-db>.turso.io
TURSO_AUTH_TOKEN=<your-token>
```

Get your credentials from the [Turso dashboard](https://turso.tech). The table is created automatically on first start (`CREATE TABLE IF NOT EXISTS`).
