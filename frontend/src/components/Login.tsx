import React, { useState } from 'react';
import api from '../services/api';

interface LoginProps {
  onLoginSuccess: () => void;
}

type AuthMode = 'login' | 'register' | 'forgot';

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  
  // Campos do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Mensagens
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const clearState = () => {
    setError('');
    setMessage('');
  };

  const handleSwitchMode = (newMode: AuthMode) => {
    clearState();
    setMode(newMode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearState();
    setLoading(true);

    try {
      if (mode === 'login') {
        const response = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', response.data.token || 'admin-token');
        onLoginSuccess();
      } else if (mode === 'register') {
        if (password !== confirmPassword) {
          setError('As senhas não coincidem.');
          setLoading(false);
          return;
        }
        await api.post('/auth/register', { name, email, password });
        setMessage('Conta criada com sucesso! Você já pode fazer login.');
        setMode('login');
      } else if (mode === 'forgot') {
        await api.post('/auth/forgot-password', { email });
        setMessage('Instruções de recuperação de senha enviadas para o seu e-mail!');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ocorreu um erro ao processar a solicitação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        {/* Título do Card */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Ticket Manager
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          {mode === 'login' && 'Acesse sua conta para gerenciar eventos'}
          {mode === 'register' && 'Crie uma nova conta de acesso'}
          {mode === 'forgot' && 'Recupere o acesso à sua conta'}
        </p>

        {/* Notificações */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4 text-sm">
            {message}
          </div>
        )}

        {/* Formulário */}
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
                className="mt-1 block w-full rounded-md border-gray-300 border p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
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
              placeholder="seu@email.com"
              className="mt-1 block w-full rounded-md border-gray-300 border p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
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
                placeholder="••••••••"
                className="mt-1 block w-full rounded-md border-gray-300 border p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
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
                placeholder="••••••••"
                className="mt-1 block w-full rounded-md border-gray-300 border p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200 text-sm disabled:opacity-50"
          >
            {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : mode === 'register' ? 'Cadastrar' : 'Enviar E-mail'}
          </button>
        </form>

        {/* Opções de Alternância */}
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