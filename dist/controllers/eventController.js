"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.getEventById = exports.getAllEvents = exports.createEvent = void 0;
const eventService_1 = require("../services/eventService");
const createEvent = async (req, res) => {
    try {
        const newEvent = await (0, eventService_1.createEventService)(req.body);
        return res.status(201).json(newEvent);
    }
    catch (error) {
        return res.status(400).json({ message: error.message || 'Erro ao cadastrar evento.' });
    }
};
exports.createEvent = createEvent;
const getAllEvents = async (req, res) => {
    try {
        const events = await (0, eventService_1.getAllEventsService)();
        return res.json(events);
    }
    catch (error) {
        return res.status(500).json({ message: 'Erro ao buscar eventos.' });
    }
};
exports.getAllEvents = getAllEvents;
const getEventById = async (req, res) => {
    try {
        const event = await (0, eventService_1.getEventByIdService)(req.params.id);
        return res.json(event);
    }
    catch (error) {
        return res.status(404).json({ message: error.message });
    }
};
exports.getEventById = getEventById;
const updateEvent = async (req, res) => {
    try {
        const updatedEvent = await (0, eventService_1.updateEventService)(req.params.id, req.body);
        return res.json(updatedEvent);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.updateEvent = updateEvent;
const deleteEvent = async (req, res) => {
    try {
        await (0, eventService_1.deleteEventService)(req.params.id);
        return res.status(200).json({ message: 'Evento deletado com sucesso!' });
    }
    catch (error) {
        return res.status(404).json({ message: error.message });
    }
};
exports.deleteEvent = deleteEvent;
