import { Schema, model, Types } from 'mongoose';

export interface TicketDocument {
  _id: Types.ObjectId;
  event: Types.ObjectId;
  order: Types.ObjectId;
  tierId: Types.ObjectId;
  tierName: string;
  qrCode: string;
  status: 'reserved' | 'confirmed' | 'checked_in' | 'cancelled';
  attendee: {
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema<TicketDocument>(
  {
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    tierId: { type: Schema.Types.ObjectId, required: true },
    tierName: { type: String, required: true },
    qrCode: { type: String, required: true, unique: true },
    status: { type: String, enum: ['reserved', 'confirmed', 'checked_in', 'cancelled'], default: 'reserved' },
    attendee: {
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export const TicketModel = model<TicketDocument>('Ticket', ticketSchema);

