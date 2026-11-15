import { Schema, model } from 'mongoose';

const eventSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    capacity: { type: Number, required: true },
    ticketPrice: { type: Number, required: true },
    status: { type: String, default: 'DRAFT' },
  },
  { timestamps: true }
);

export const Event = model('Event', eventSchema);