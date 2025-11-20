import { Router } from 'express';
import { healthRouter } from './modules/health.route';
import { authRouter } from './modules/auth.route';
import { eventRouter } from './modules/event.route';
import { orderRouter } from './modules/order.route';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/events', eventRouter);
apiRouter.use('/orders', orderRouter);
