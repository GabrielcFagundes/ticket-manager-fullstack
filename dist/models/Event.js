"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const mongoose_1 = require("mongoose");
const eventSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    capacity: { type: Number, required: true },
    ticketPrice: { type: Number, required: true },
    status: { type: String, default: 'DRAFT' },
}, { timestamps: true });
exports.Event = (0, mongoose_1.model)('Event', eventSchema);
