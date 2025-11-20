import { Schema, model, Types } from 'mongoose';

export interface TicketTier {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  remainingQuantity: number;
  salesStart?: Date;
  salesEnd?: Date;
  perks?: string[];
}

export interface EventDocument {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  venue: {
    name: string;
    address: string;
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  startDate: Date;
  endDate: Date;
  organizer: Types.ObjectId;
  status: 'draft' | 'published' | 'archived';
  visibility: 'public' | 'private';
  capacity: number;
  ticketTiers: TicketTier[];
  coverImage?: string;
  waitlistEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ticketTierSchema = new Schema<TicketTier>(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    remainingQuantity: { type: Number, required: true, min: 0 },
    salesStart: Date,
    salesEnd: Date,
    perks: [String],
  },
  { _id: true }
);

const eventSchema = new Schema<EventDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    venue: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    visibility: { type: String, enum: ['public', 'private'], default: 'public' },
    capacity: { type: Number, required: true, min: 1 },
    ticketTiers: { type: [ticketTierSchema], default: [] },
    coverImage: String,
    waitlistEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

eventSchema.pre('validate', function updateRemaining(next) {
  this.ticketTiers.forEach((tier) => {
    if (tier.remainingQuantity === undefined) {
      tier.remainingQuantity = tier.quantity;
    }
  });
  next();
});

export const EventModel = model<EventDocument>('Event', eventSchema);

