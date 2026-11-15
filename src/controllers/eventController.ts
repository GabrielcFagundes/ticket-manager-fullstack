import { Request, Response } from 'express';
import {
  createEventService,
  getAllEventsService,
  getEventByIdService,
  updateEventService,
  deleteEventService,
} from '../services/eventService';

export const createEvent = async (req: Request, res: Response) => {
  try {
    const newEvent = await createEventService(req.body);
    return res.status(201).json(newEvent);
  } catch (error: any) {
    return res.status(400).json({ message: error.message || 'Erro ao cadastrar evento.' });
  }
};

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await getAllEventsService();
    return res.json(events);
  } catch (error: any) {
    return res.status(500).json({ message: 'Erro ao buscar eventos.' });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const event = await getEventByIdService(req.params.id);
    return res.json(event);
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const updatedEvent = await updateEventService(req.params.id, req.body);
    return res.json(updatedEvent);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    await deleteEventService(req.params.id);
    return res.status(200).json({ message: 'Evento deletado com sucesso!' });
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};