import express, { Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
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

export default app;
