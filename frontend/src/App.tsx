import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import {
  consultarSessaoAtual,
  logoutUsuario,
  type UsuarioSessao,
} from './services/authService';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { EventsPage } from './pages/EventsPage';
import { EventFormPage } from './pages/EventFormPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  const [usuario, setUsuario] = useState<UsuarioSessao | null>(null);
  const [carregandoSessao, setCarregandoSessao] = useState(true);
  const [erroSessao, setErroSessao] = useState('');

  useEffect(() => {
    let ativo = true;

    async function verificarSessao() {
      try {
        const dados = await consultarSessaoAtual();
        if (ativo) setUsuario(dados);
      } catch (err) {
        if (ativo) {
          setErroSessao(err instanceof Error ? err.message : 'Erro ao conectar com o servidor.');
        }
      } finally {
        if (ativo) setCarregandoSessao(false);
      }
    }

    verificarSessao();
    return () => {
      ativo = false;
    };
  }, []);

  const handleLogout = async () => {
    await logoutUsuario();
    setUsuario(null);
  };

  if (carregandoSessao) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600 text-sm">
        Verificando sessão...
      </div>
    );
  }

  if (erroSessao) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center gap-4">
        <p className="text-red-600 font-medium text-sm">{erroSessao}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            usuario ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage onLoginSuccess={setUsuario} />
            )
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute usuario={usuario}>
              {usuario && <EventsPage usuario={usuario} onLogout={handleLogout} />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/eventos/novo"
          element={
            <ProtectedRoute usuario={usuario}>
              {usuario && <EventFormPage usuario={usuario} onLogout={handleLogout} />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/eventos/editar/:id"
          element={
            <ProtectedRoute usuario={usuario}>
              {usuario && <EventFormPage usuario={usuario} onLogout={handleLogout} />}
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;