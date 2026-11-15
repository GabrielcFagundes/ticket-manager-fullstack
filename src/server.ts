import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './config/database';

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Swagger disponível em http://localhost:${PORT}/api-docs`);
  });
});