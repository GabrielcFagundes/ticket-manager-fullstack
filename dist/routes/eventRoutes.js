"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventController_1 = require("../controllers/eventController");
const validateEvent_1 = require("../middlewares/validateEvent");
const router = (0, express_1.Router)();
/**
 * @openapi
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - date
 *         - location
 *         - category
 *         - capacity
 *         - ticketPrice
 *       properties:
 *         id:
 *           type: string
 *           description: ID gerado automaticamente pelo MongoDB
 *         title:
 *           type: string
 *           example: "Workshop de Node.js"
 *         description:
 *           type: string
 *           example: "Aprenda a criar APIs RESTful do zero com TypeScript."
 *         date:
 *           type: string
 *           format: date-time
 *           example: "2027-06-15T14:00:00.000Z"
 *         location:
 *           type: string
 *           example: "Auditório Principal"
 *         category:
 *           type: string
 *           example: "WORKSHOP"
 *         capacity:
 *           type: integer
 *           example: 50
 *         ticketPrice:
 *           type: number
 *           example: 29.90
 *         status:
 *           type: string
 *           example: "PUBLISHED"
 */
/**
 * @openapi
 * /events:
 *   get:
 *     summary: Lista todos os eventos
 *     tags:
 *       - Events
 *     responses:
 *       200:
 *         description: Lista de eventos retornada com sucesso.
 *   post:
 *     summary: Cadastra um novo evento
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Evento criado com sucesso.
 *       400:
 *         description: Dados inválidos fornecidos.
 */
router.get('/', eventController_1.getAllEvents);
router.post('/', validateEvent_1.validateEventPayload, eventController_1.createEvent);
/**
 * @openapi
 * /events/{id}:
 *   get:
 *     summary: Busca um evento pelo ID
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evento encontrado.
 *       404:
 *         description: Evento não encontrado.
 *   put:
 *     summary: Atualiza um evento pelo ID
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Evento atualizado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Evento não encontrado.
 *   delete:
 *     summary: Remove um evento pelo ID
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evento deletado com sucesso.
 *       404:
 *         description: Evento não encontrado.
 */
router.get('/:id', eventController_1.getEventById);
router.put('/:id', validateEvent_1.validateEventPayload, eventController_1.updateEvent);
router.delete('/:id', eventController_1.deleteEvent);
exports.default = router;
