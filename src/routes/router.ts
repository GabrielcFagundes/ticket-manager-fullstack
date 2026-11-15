import { Router } from 'express';
import { exigirSessao } from '../middlewares/exigirSessao';
import authRoutes from './authRoutes';
import eventRoutes from './eventRoutes';

const rotas = Router();

rotas.use('/auth', authRoutes);
rotas.use('/events', exigirSessao, eventRoutes);

export default rotas;