import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { EventCard } from '../components/EventCard';
import type { UsuarioSessao } from '../services/authService';
import {
  listarEventos,
  excluirEvento,
  type EventItem,
} from '../services/eventService';

interface EventsPageProps {
  usuario: UsuarioSessao;
  onLogout: () => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ usuario, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sucesso, setSucesso] = useState('');
  const [erro, setErro] = useState('');

  const exibirSucesso = (msg: string) => {
    setErro('');
    setSucesso(msg);
    setTimeout(() => setSucesso(''), 4000);
  };

  const exibirErro = (msg: string) => {
    setSucesso('');
    setErro(msg);
  };

  const carregarEventos = async () => {
    try {
      const lista = await listarEventos();
      setEvents(lista);
    } catch (err) {
      exibirErro(err instanceof Error ? err.message : 'Erro ao carregar eventos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEventos();

    const mensagemRota = (location.state as { sucesso?: string } | null)?.sucesso;
    if (mensagemRota) {
      exibirSucesso(mensagemRota);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleExcluirEvento = async (id: string) => {
    try {
      await excluirEvento(id);
      exibirSucesso('Evento excluído com sucesso!');
      await carregarEventos();
    } catch (err) {
      exibirErro(err instanceof Error ? err.message : 'Erro ao excluir evento.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar usuario={usuario} onLogout={onLogout} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sucesso && (
          <div className="mb-6 bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-lg text-sm font-medium">
            {sucesso}
          </div>
        )}
        {erro && (
          <div className="mb-6 bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg text-sm font-medium">
            {erro}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Eventos Cadastrados ({events.length})
          </h2>

          <button
            type="button"
            onClick={() => navigate('/eventos/novo')}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Evento
          </button>
        </div>

        {loading ? (
          <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500 text-sm">
            Carregando eventos...
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500 text-sm">
            Nenhum evento cadastrado ainda. Clique em <strong>Novo Evento</strong> para criar o primeiro!
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((evt) => (
              <EventCard
                key={evt._id}
                evento={evt}
                emEdicao={false}
                onEditar={(eventoSelecionado) =>
                  navigate(`/eventos/editar/${eventoSelecionado._id}`)
                }
                onExcluir={handleExcluirEvento}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};