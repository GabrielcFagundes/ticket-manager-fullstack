import React from 'react';
import { Navigate } from 'react-router-dom';
import type { UsuarioSessao } from '../services/authService';

interface ProtectedRouteProps {
  usuario: UsuarioSessao | null;
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ usuario, children }) => {
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};