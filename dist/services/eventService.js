"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEventService = exports.updateEventService = exports.getEventByIdService = exports.getAllEventsService = exports.createEventService = void 0;
const Event_1 = require("../models/Event");
const createEventService = async (data) => {
    if (new Date(data.date) < new Date()) {
        throw new Error('A data do evento deve ser futura.');
    }
    const newEvent = await Event_1.Event.create(data);
    return newEvent;
};
exports.createEventService = createEventService;
const getAllEventsService = async () => {
    return await Event_1.Event.find().sort({ createdAt: -1 });
};
exports.getAllEventsService = getAllEventsService;
const getEventByIdService = async (id) => {
    const event = await Event_1.Event.findById(id);
    if (!event) {
        throw new Error('Evento não encontrado.');
    }
    return event;
};
exports.getEventByIdService = getEventByIdService;
const updateEventService = async (id, data) => {
    const updatedEvent = await Event_1.Event.findByIdAndUpdate(id, data, { new: true });
    if (!updatedEvent) {
        throw new Error('Evento não encontrado para atualização.');
    }
    return updatedEvent;
};
exports.updateEventService = updateEventService;
const deleteEventService = async (id) => {
    const deletedEvent = await Event_1.Event.findByIdAndDelete(id);
    if (!deletedEvent) {
        throw new Error('Evento não encontrado para exclusão.');
    }
    return deletedEvent;
};
exports.deleteEventService = deleteEventService;
