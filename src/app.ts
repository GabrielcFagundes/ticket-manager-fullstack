import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import eventRoutes from './routes/eventRoutes';
import authRoutes from './routes/authRoutes';
import { exigirSessao } from './middlewares/exigirSessao';

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (_req, res) => {
  res.send('API de Eventos está rodando! Acesse /api-docs para a documentação.');
});

// Rotas públicas de autenticação (login, register, logout, sessao)
app.use('/api/auth', authRoutes);

// Rotas protegidas por sessão via cookie httpOnly
app.use('/api/events', exigirSessao, eventRoutes);

export default app;