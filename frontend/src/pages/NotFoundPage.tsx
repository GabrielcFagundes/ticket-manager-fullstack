import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <h1 className="text-5xl font-bold text-blue-600 mb-2">404</h1>
      <p className="text-gray-600 mb-6">Página não encontrada.</p>
      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition"
      >
        Voltar para o início
      </Link>
    </div>
  );
};