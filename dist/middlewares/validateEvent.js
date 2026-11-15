"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEventPayload = void 0;
const validateEventPayload = (req, res, next) => {
    const { title, date, capacity, ticketPrice } = req.body;
    if (!title || !date || capacity === undefined || ticketPrice === undefined) {
        return res.status(400).json({
            message: 'Campos obrigatórios ausentes: title, date, capacity e ticketPrice são necessários.'
        });
    }
    if (capacity < 0 || ticketPrice < 0) {
        return res.status(400).json({
            message: 'Capacidade e preço do ingresso não podem ser valores negativos.'
        });
    }
    next();
};
exports.validateEventPayload = validateEventPayload;
