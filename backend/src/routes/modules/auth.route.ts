import { Router } from 'express';
import { registerUser, loginUser, getCurrentUser } from '../../controllers/auth.controller';
import { validateResource } from '../../middleware/validate-resource';
import { registerSchema, loginSchema } from '../../validation/auth.schema';
import { authenticate } from '../../middleware/auth';

export const authRouter = Router();

authRouter.post('/register', validateResource(registerSchema), registerUser);
authRouter.post('/login', validateResource(loginSchema), loginUser);
authRouter.get('/me', authenticate, getCurrentUser);

