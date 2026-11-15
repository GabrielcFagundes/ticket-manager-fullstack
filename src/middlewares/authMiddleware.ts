import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
  }

  // Espera um formato simples como "Bearer token123" ou apenas um token no header
  const token = authHeader.split(' ')[1] || authHeader;

  if (token !== 'token-de-teste-123' && token !== 'admin-token') {
    return res.status(403).json({ message: 'Token inválido ou expirado.' });
  }

  next();
};