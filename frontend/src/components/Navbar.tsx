import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, LogOut, User } from 'lucide-react';
import type { UsuarioSessao } from '../services/authService';

interface NavbarProps {
  usuario: UsuarioSessao;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ usuario, onLogout }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-blue-600 font-bold text-xl">
          <Calendar className="w-6 h-6" />
          <span>Ticket Manager</span>
        </Link>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-1.5 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
            <User className="w-4 h-4 text-gray-500" />
            <span>{usuario.nome}</span>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center space-x-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
};