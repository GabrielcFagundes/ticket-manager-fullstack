import { Event } from '../models/Event';

export const createEventService = async (data: any) => {
  if (new Date(data.date) < new Date()) {
    throw new Error('A data do evento deve ser futura.');
  }
  const newEvent = await Event.create(data);
  return newEvent;
};

export const getAllEventsService = async () => {
  return await Event.find().sort({ createdAt: -1 });
};

export const getEventByIdService = async (id: string) => {
  const event = await Event.findById(id);
  if (!event) {
    throw new Error('Evento não encontrado.');
  }
  return event;
};

export const updateEventService = async (id: string, data: any) => {
  const updatedEvent = await Event.findByIdAndUpdate(id, data, { new: true });
  if (!updatedEvent) {
    throw new Error('Evento não encontrado para atualização.');
  }
  return updatedEvent;
};

export const deleteEventService = async (id: string) => {
  const deletedEvent = await Event.findByIdAndDelete(id);
  if (!deletedEvent) {
    throw new Error('Evento não encontrado para exclusão.');
  }
  return deletedEvent;
};