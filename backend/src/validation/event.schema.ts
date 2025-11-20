import { z } from 'zod';

const ticketTierSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive(),
  salesStart: z.string().datetime().optional(),
  salesEnd: z.string().datetime().optional(),
  perks: z.array(z.string()).optional(),
});

export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    slug: z.string().min(3),
    description: z.string().min(10),
    category: z.string().min(2),
    tags: z.array(z.string()).default([]),
    venue: z.object({
      name: z.string(),
      address: z.string(),
      city: z.string(),
      country: z.string(),
      coordinates: z
        .object({
          lat: z.number(),
          lng: z.number(),
        })
        .optional(),
    }),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    visibility: z.enum(['public', 'private']).default('public'),
    waitlistEnabled: z.boolean().default(false),
    ticketTiers: z.array(ticketTierSchema).min(1),
  }),
});

export const getEventSchema = z.object({
  params: z.object({
    eventId: z.string().length(24),
  }),
});

