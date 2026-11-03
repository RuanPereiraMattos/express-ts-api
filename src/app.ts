import express, { Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { swaggerSpec } from './swagger.js';
import healthRouter from './routes/health.js';
import usersRouter from './routes/users.js';
import { initializeDatabase } from './repositories/users.repository.js';

const app = express();

const dbInit = initializeDatabase();

app.use(express.json());

app.use((_req: Request, _res: Response, next: NextFunction) => {
  dbInit.then(() => next()).catch(next);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/health', healthRouter);
app.use('/api/users', usersRouter);

const clientDist = path.join(process.cwd(), 'client', 'dist');
app.use(express.static(clientDist));
app.get('/{*splat}', (_req: Request, res: Response) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

export default app;
