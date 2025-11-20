import { Schema, model, Types } from 'mongoose';

export interface OrderItem {
  tierId: Types.ObjectId;
  tierName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderDocument {
  _id: Types.ObjectId;
  event: Types.ObjectId;
  buyer: Types.ObjectId;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  total: number;
  currency: string;
  items: OrderItem[];
  tickets: Types.ObjectId[];
  contactEmail: string;
  contactName: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<OrderItem>(
  {
    tierId: { type: Schema.Types.ObjectId, required: true },
    tierName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new Schema<OrderDocument>(
  {
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    paymentStatus: { type: String, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' },
    total: { type: Number, required: true },
    currency: { type: String, default: 'usd' },
    items: { type: [orderItemSchema], required: true },
    tickets: [{ type: Schema.Types.ObjectId, ref: 'Ticket' }],
    contactEmail: { type: String, required: true },
    contactName: { type: String, required: true },
  },
  { timestamps: true }
);

export const OrderModel = model<OrderDocument>('Order', orderSchema);

