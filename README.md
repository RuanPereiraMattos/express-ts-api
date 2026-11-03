# TypeScript Swagger API

A sample REST API built with **Express v5** and **TypeScript**, with interactive documentation served by **Swagger UI**.

## Tech Stack

- **Runtime**: Node.js (ESM)
- **Framework**: Express v5
- **Language**: TypeScript 7
- **Documentation**: swagger-jsdoc + swagger-ui-express
- **Database**: Turso (libSQL / SQLite)
- **Tests**: Vitest + Supertest

## Getting Started

**Install dependencies:**
```bash
npm install
```

**Start the development server:**
```bash
npm run dev
```

The server starts on port `3000` (configurable via `.env`).

**Open the interactive API docs:**
```
http://localhost:3000/api-docs
```

## Scripts

```bash
npm run dev          # start dev server with tsx (no build step needed)
npm run build        # compile TypeScript to dist/
npm run start        # run compiled output (requires build first)
npm test             # run all tests once
npm run test:watch   # run tests in watch mode
```

## Endpoints

### Health

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Returns current server time |

### Users

| Method | Path | Description |
|---|---|---|
| GET | `/users` | List all users |
| GET | `/users/:id` | Get user by ID |
| POST | `/users` | Create a user |
| PUT | `/users/:id` | Update a user |
| DELETE | `/users/:id` | Delete a user |

> Data persists in Turso (serverless SQLite). Locally you can use `file::memory:` in `.env` for ephemeral testing.

## Project Structure

```
src/
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
    ├── health.ts                   # GET /health
    └── users.ts                    # /users routes + OpenAPI annotations
api/
└── index.ts                        # Vercel serverless entry point
```

## Environment Variables

Create a `.env` file at the project root:

```env
PORT=3000
TURSO_DATABASE_URL=libsql://<your-db>.turso.io
TURSO_AUTH_TOKEN=<your-token>
```

Get your credentials from the [Turso dashboard](https://turso.tech). The table is created automatically on first start (`CREATE TABLE IF NOT EXISTS`).
