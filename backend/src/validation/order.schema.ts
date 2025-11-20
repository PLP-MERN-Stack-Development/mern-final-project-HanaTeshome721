import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    eventId: z.string().length(24),
    tierId: z.string().length(24),
    quantity: z.number().int().positive().max(10),
    contactName: z.string().min(2),
    contactEmail: z.string().email(),
    attendees: z
      .array(
        z.object({
          name: z.string().min(2),
          email: z.string().email(),
        })
      )
      .min(1),
  }),
});

