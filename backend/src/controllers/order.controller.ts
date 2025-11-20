import { randomUUID } from 'crypto';
import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import { asyncHandler } from '../utils/async-handler';
import { EventModel } from '../models/event.model';
import { OrderModel } from '../models/order.model';
import { TicketModel } from '../models/ticket.model';

export const createOrder = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw createHttpError(401, 'Authentication required');
  }

  const { eventId, tierId, quantity, contactEmail, contactName, attendees } = req.body;
  const tierObjectId = new mongoose.Types.ObjectId(tierId);

  const event = await EventModel.findById(eventId);
  if (!event || event.status !== 'published') {
    throw createHttpError(404, 'Event not available');
  }

  const tier = event.ticketTiers.id(tierId);
  if (!tier) {
    throw createHttpError(404, 'Ticket tier not found');
  }

  if (tier.remainingQuantity < quantity) {
    throw createHttpError(400, 'Not enough tickets remaining');
  }

  if (attendees.length !== quantity) {
    throw createHttpError(400, 'Attendee count must match quantity');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const subtotal = tier.price * quantity;
    const order = await OrderModel.create(
      [
        {
          event: event._id,
          buyer: req.user.id,
          total: subtotal,
          currency: 'usd',
          items: [
            {
              tierId: tierObjectId,
              tierName: tier.name,
              quantity,
              unitPrice: tier.price,
              subtotal,
            },
          ],
          contactEmail,
          contactName,
        },
      ],
      { session }
    );

    const createdOrder = order[0];

    const tickets = await TicketModel.create(
      attendees.map((attendee) => ({
        event: event._id,
        order: createdOrder._id,
        tierId: tierObjectId,
        tierName: tier.name,
        attendee,
        qrCode: randomUUID(),
      })),
      { session }
    );

    createdOrder.tickets = tickets.map((ticket) => ticket._id);
    await createdOrder.save({ session });

    tier.remainingQuantity -= quantity;
    await event.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ order: createdOrder, tickets });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

export const listMyOrders = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw createHttpError(401, 'Authentication required');
  }

  const orders = await OrderModel.find({ buyer: req.user.id })
    .populate('event', 'title startDate endDate venue')
    .populate('tickets');

  res.json({ orders });
});

