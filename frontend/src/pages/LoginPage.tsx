import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  loginUsuario,
  cadastrarUsuario,
  recuperarSenha,
  type UsuarioSessao,
} from '../services/authService';

interface LoginPageProps {
  onLoginSuccess: (usuario: UsuarioSessao) => void;
}

type AuthMode = 'login' | 'register' | 'forgot';

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSwitchMode = (newMode: AuthMode) => {
    setError('');
    setMessage('');
    setMode(newMode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const usuario = await loginUsuario(email, password);
        onLoginSuccess(usuario);
        navigate('/', { replace: true });
      } else if (mode === 'register') {
        if (password !== confirmPassword) {
          setError('As senhas não coincidem.');
          setLoading(false);
          return;
        }
        const msg = await cadastrarUsuario(name, email, password);
        setMessage(msg);
        setMode('login');
      } else if (mode === 'forgot') {
        const msg = await recuperarSenha(email);
        setMessage(msg);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">Ticket Manager</h1>
        <p className="text-sm text-center text-gray-500 mb-6">
          {mode === 'login' && 'Acesse sua conta para gerenciar eventos'}
          {mode === 'register' && 'Crie uma nova conta de acesso'}
          {mode === 'forgot' && 'Recupere o acesso à sua conta'}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="mt-1 block w-full rounded-lg border-gray-300 border p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@admin.com"
              className="mt-1 block w-full rounded-lg border-gray-300 border p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">Senha</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('forgot')}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="mt-1 block w-full rounded-lg border-gray-300 border p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••"
                className="mt-1 block w-full rounded-lg border-gray-300 border p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg transition text-sm disabled:opacity-50"
          >
            {loading
              ? 'Aguarde...'
              : mode === 'login'
              ? 'Entrar'
              : mode === 'register'
              ? 'Cadastrar'
              : 'Enviar E-mail'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 border-t pt-4">
          {mode === 'login' ? (
            <p>
              Não tem uma conta?{' '}
              <button
                onClick={() => handleSwitchMode('register')}
                className="text-blue-600 font-semibold hover:underline"
              >
                Cadastre-se
              </button>
            </p>
          ) : (
            <p>
              Já possui uma conta?{' '}
              <button
                onClick={() => handleSwitchMode('login')}
                className="text-blue-600 font-semibold hover:underline"
              >
                Faça Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};