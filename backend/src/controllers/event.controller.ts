import createHttpError from 'http-errors';
import slugify from 'slugify';
import { asyncHandler } from '../utils/async-handler';
import { EventModel } from '../models/event.model';

export const listEvents = asyncHandler(async (_req, res) => {
  const events = await EventModel.find({ status: 'published' })
    .sort({ startDate: 1 })
    .select('title startDate endDate venue category ticketTiers slug coverImage tags');

  res.json({ events });
});

export const getEventById = asyncHandler(async (req, res) => {
  const event = await EventModel.findById(req.params.eventId);
  if (!event) {
    throw createHttpError(404, 'Event not found');
  }

  res.json({ event });
});

export const createEvent = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw createHttpError(401, 'Authentication required');
  }

  const { slug, title } = req.body;
  const normalizedSlug = slugify(slug || title, { lower: true, strict: true });

  const existing = await EventModel.findOne({ slug: normalizedSlug });
  if (existing) {
    throw createHttpError(409, 'Slug already in use');
  }

  const event = await EventModel.create({
    ...req.body,
    slug: normalizedSlug,
    organizer: req.user.id,
    status: 'draft',
    ticketTiers: req.body.ticketTiers.map((tier: { quantity: number; remainingQuantity?: number }) => ({
      ...tier,
      remainingQuantity: tier.remainingQuantity ?? tier.quantity,
    })),
  });

  res.status(201).json({ event });
});

export const publishEvent = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw createHttpError(401, 'Authentication required');
  }

  const event = await EventModel.findOneAndUpdate(
    { _id: req.params.eventId, organizer: req.user.id },
    { status: 'published' },
    { new: true }
  );

  if (!event) {
    throw createHttpError(404, 'Event not found or insufficient permissions');
  }

  res.json({ event });
});

