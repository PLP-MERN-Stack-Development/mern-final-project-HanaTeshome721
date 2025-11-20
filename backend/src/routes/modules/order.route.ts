import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { validateResource } from '../../middleware/validate-resource';
import { createOrderSchema } from '../../validation/order.schema';
import { createOrder, listMyOrders } from '../../controllers/order.controller';

export const orderRouter = Router();

orderRouter.use(authenticate);
orderRouter.post('/', validateResource(createOrderSchema), createOrder);
orderRouter.get('/me', listMyOrders);

