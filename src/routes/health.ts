import { Router, Request, Response } from 'express';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Server health check
 */

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Server health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy, returns current server time
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                   example: "2025-01-01 12:00:00"
 */
router.get('/', (_req: Request, res: Response) => {
  const iso = new Date().toISOString();
  const [yearMonthDay, timePart] = iso.split('T');
  const hourMinuteSeconds = timePart.split('.')[0];
  res.status(200).json({ date: `${yearMonthDay} ${hourMinuteSeconds}` });
});

export default router;
