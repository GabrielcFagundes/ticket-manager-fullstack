"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const app_1 = __importDefault(require("../app"));
let mongoServer;
(0, globals_1.beforeAll)(async () => {
    mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
    await mongoose_1.default.connect(mongoServer.getUri());
});
(0, globals_1.afterAll)(async () => {
    await mongoose_1.default.disconnect();
    await mongoServer.stop();
});
(0, globals_1.afterEach)(async () => {
    const collections = mongoose_1.default.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});
(0, globals_1.describe)('Testes de Autenticação (Login com Cookie)', () => {
    (0, globals_1.test)('Deve realizar login com credenciais corretas e definir cookie de sessão', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({
            email: 'admin@admin.com',
            password: '123456',
        });
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(res.body).toHaveProperty('usuario');
        (0, globals_1.expect)(res.headers['set-cookie']).toBeDefined();
    });
    (0, globals_1.test)('Não deve realizar login com credenciais incorretas', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({
            email: 'admin@admin.com',
            password: 'senha_errada',
        });
        (0, globals_1.expect)(res.status).toBe(401);
    });
    (0, globals_1.test)('Deve bloquear acesso aos eventos sem estar autenticado', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/api/events');
        (0, globals_1.expect)(res.status).toBe(401);
    });
});
(0, globals_1.describe)('Testes do CRUD de Eventos (Autenticado)', () => {
    const agent = supertest_1.default.agent(app_1.default);
    const validEvent = {
        title: 'Tech Summit 2027',
        description: 'Evento de tecnologia e inovação',
        date: '2027-11-20T09:00:00.000Z',
        location: 'Centro de Convenções',
        category: 'CONFERENCE',
        capacity: 300,
        ticketPrice: 99.9,
    };
    (0, globals_1.beforeEach)(async () => {
        await agent.post('/api/auth/login').send({
            email: 'admin@admin.com',
            password: '123456',
        });
    });
    (0, globals_1.test)('Deve criar um novo evento com sucesso', async () => {
        const res = await agent.post('/api/events').send(validEvent);
        (0, globals_1.expect)(res.status).toBe(201);
        (0, globals_1.expect)(res.body).toHaveProperty('_id');
        (0, globals_1.expect)(res.body.title).toBe(validEvent.title);
    });
    (0, globals_1.test)('Não deve criar evento com data no passado', async () => {
        const res = await agent
            .post('/api/events')
            .send({ ...validEvent, date: '2020-01-01T00:00:00.000Z' });
        (0, globals_1.expect)(res.status).toBe(400);
    });
    (0, globals_1.test)('Deve listar todos os eventos', async () => {
        await agent.post('/api/events').send(validEvent);
        const res = await agent.get('/api/events');
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(Array.isArray(res.body)).toBe(true);
        (0, globals_1.expect)(res.body.length).toBe(1);
    });
    (0, globals_1.test)('Deve consultar um evento pelo ID com sucesso', async () => {
        const created = await agent.post('/api/events').send(validEvent);
        const id = created.body._id;
        const res = await agent.get(`/api/events/${id}`);
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(res.body._id).toBe(id);
    });
    (0, globals_1.test)('Deve atualizar um evento existente com sucesso', async () => {
        const created = await agent.post('/api/events').send(validEvent);
        const id = created.body._id;
        const res = await agent
            .put(`/api/events/${id}`)
            .send({ ...validEvent, title: 'Tech Summit 2027 - Atualizado' });
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(res.body.title).toBe('Tech Summit 2027 - Atualizado');
    });
    (0, globals_1.test)('Deve excluir um evento existente com sucesso', async () => {
        const created = await agent.post('/api/events').send(validEvent);
        const id = created.body._id;
        const deleteRes = await agent.delete(`/api/events/${id}`);
        (0, globals_1.expect)(deleteRes.status).toBe(200);
        const getRes = await agent.get(`/api/events/${id}`);
        (0, globals_1.expect)(getRes.status).toBe(404);
    });
});
