import { z } from 'zod';
import { USER_ROLES } from '../constants/roles';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(USER_ROLES).optional(),
    organization: z.string().max(180).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
});

