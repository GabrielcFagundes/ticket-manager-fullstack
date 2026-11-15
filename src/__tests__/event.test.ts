import { describe, test, expect, beforeAll, afterAll, afterEach, beforeEach } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe('Testes de Autenticação (Login com Cookie)', () => {
  test('Deve realizar login com credenciais corretas e definir cookie de sessão', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'admin@admin.com',
      password: '123456',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('usuario');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  test('Não deve realizar login com credenciais incorretas', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'admin@admin.com',
      password: 'senha_errada',
    });

    expect(res.status).toBe(401);
  });

  test('Deve bloquear acesso aos eventos sem estar autenticado', async () => {
    const res = await request(app).get('/api/events');
    expect(res.status).toBe(401);
  });
});

describe('Testes do CRUD de Eventos (Autenticado)', () => {
  const agent = request.agent(app);

  const validEvent = {
    title: 'Tech Summit 2027',
    description: 'Evento de tecnologia e inovação',
    date: '2027-11-20T09:00:00.000Z',
    location: 'Centro de Convenções',
    category: 'CONFERENCE',
    capacity: 300,
    ticketPrice: 99.9,
  };

  beforeEach(async () => {
    await agent.post('/api/auth/login').send({
      email: 'admin@admin.com',
      password: '123456',
    });
  });

  test('Deve criar um novo evento com sucesso', async () => {
    const res = await agent.post('/api/events').send(validEvent);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe(validEvent.title);
  });

  test('Não deve criar evento com data no passado', async () => {
    const res = await agent
      .post('/api/events')
      .send({ ...validEvent, date: '2020-01-01T00:00:00.000Z' });
    expect(res.status).toBe(400);
  });

  test('Deve listar todos os eventos', async () => {
    await agent.post('/api/events').send(validEvent);
    const res = await agent.get('/api/events');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  test('Deve consultar um evento pelo ID com sucesso', async () => {
    const created = await agent.post('/api/events').send(validEvent);
    const id = created.body._id;

    const res = await agent.get(`/api/events/${id}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(id);
  });

  test('Deve atualizar um evento existente com sucesso', async () => {
    const created = await agent.post('/api/events').send(validEvent);
    const id = created.body._id;

    const res = await agent
      .put(`/api/events/${id}`)
      .send({ ...validEvent, title: 'Tech Summit 2027 - Atualizado' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Tech Summit 2027 - Atualizado');
  });

  test('Deve excluir um evento existente com sucesso', async () => {
    const created = await agent.post('/api/events').send(validEvent);
    const id = created.body._id;

    const deleteRes = await agent.delete(`/api/events/${id}`);
    expect(deleteRes.status).toBe(200);

    const getRes = await agent.get(`/api/events/${id}`);
    expect(getRes.status).toBe(404);
  });
});