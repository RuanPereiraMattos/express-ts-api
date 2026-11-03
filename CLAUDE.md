# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server with tsx (no build step needed)
npm run build    # compile TypeScript to dist/
npm run start    # run compiled output (requires build first)
npm test         # run all tests once (uses in-memory libSQL)
npm run test:watch  # run tests in watch mode
```

## Architecture

Express v5 + TypeScript ESM project (`"type": "module"`). All relative imports must use `.js` extensions in source files (Node ESM requirement — tsx resolves them to `.ts` at dev time).

**Entry point:** `src/index.ts` — just calls `app.listen()`. All app setup is in `src/app.ts`.

**App setup (`src/app.ts`):** Registers middleware, mounts Swagger UI at `/api-docs`, mounts routers. Also holds the `dbInit` promise (`initializeDatabase()` called once at module load) and a middleware that awaits it before the first request — ensures the DB table exists on cold start.

**Database:** `src/db.ts` — libSQL (`@libsql/client`) singleton. Calls `dotenv.config()` in module body before `createClient()` to guarantee env vars are loaded (ESM static imports are hoisted, so dotenv must run here, not in `index.ts`). Connects to Turso when `TURSO_DATABASE_URL` is a `libsql://` URL; uses in-memory SQLite when `TURSO_DATABASE_URL=file::memory:` (tests).

**3-layer structure for `/users`:**
- `src/routes/users.ts` — Router wiring + all `@swagger` JSDoc annotations
- `src/controllers/users.controller.ts` — Async HTTP handlers (`Request<{ id: string }>` generic for `:id` params)
- `src/repositories/users.repository.ts` — Async SQL via `client.execute({ sql, args })`. Exports `initializeDatabase`, `findAll`, `findById`, `emailExists`, `create`, `update`, `remove`, `clearAll`.

**Swagger:** `src/swagger.ts` configures `swagger-jsdoc`, reading annotations from `src/routes/*.ts`. `swagger-ui-express` serves at `/api-docs`.

**Types:** `src/types/user.ts` — `User`, `CreateUserDto`, `UpdateUserDto` interfaces.

**Vercel deployment:** `api/index.ts` re-exports `app` as the serverless handler. `vercel.json` rewrites all requests to `/api/index`.

## TypeScript config

`tsconfig.json` uses `"module": "NodeNext"` + `"moduleResolution": "NodeNext"` — the correct pair for Node.js ESM. Compiled output goes to `dist/`.

## Tests

Vitest + Supertest. `vitest.config.ts` sets `TURSO_DATABASE_URL=file::memory:` so tests never hit the real Turso DB. Tests call `initializeDatabase()` in `beforeAll` and `clearAll()` in `beforeEach`. Test files must be under `src/` — `include: ['src/**/*.test.ts']` prevents Vitest from also running compiled `dist/` tests.

## Environment Variables

```env
PORT=3000
TURSO_DATABASE_URL=libsql://<your-db>.turso.io
TURSO_AUTH_TOKEN=<jwt>
```
