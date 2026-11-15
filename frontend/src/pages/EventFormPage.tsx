import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { EventForm } from '../components/EventForm';
import type { UsuarioSessao } from '../services/authService';
import {
  listarEventos,
  criarEvento,
  atualizarEvento,
  type EventItem,
  type EventPayload,
} from '../services/eventService';

interface EventFormPageProps {
  usuario: UsuarioSessao;
  onLogout: () => void;
}

export const EventFormPage: React.FC<EventFormPageProps> = ({ usuario, onLogout }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [eventoEmEdicao, setEventoEmEdicao] = useState<EventItem | null>(null);
  const [carregando, setCarregando] = useState<boolean>(Boolean(id));
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!id) return;

    async function carregarEventoParaEdicao() {
      try {
        const lista = await listarEventos();
        const encontrado = lista.find((item) => item._id === id) ?? null;
        if (!encontrado) {
          setErro('Evento não encontrado.');
        } else {
          setEventoEmEdicao(encontrado);
        }
      } catch (err) {
        setErro(err instanceof Error ? err.message : 'Erro ao carregar dados do evento.');
      } finally {
        setCarregando(false);
      }
    }

    carregarEventoParaEdicao();
  }, [id]);

  const handleSalvarEvento = async (payload: EventPayload, idEdicao?: string) => {
    setSalvando(true);
    setErro('');
    try {
      if (idEdicao) {
        await atualizarEvento(idEdicao, payload);
        navigate('/', { state: { sucesso: 'Evento atualizado com sucesso!' } });
      } else {
        await criarEvento(payload);
        navigate('/', { state: { sucesso: 'Evento cadastrado com sucesso!' } });
      }
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao salvar evento.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar usuario={usuario} onLogout={onLogout} />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Eventos
        </button>

        {erro && (
          <div className="mb-6 bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg text-sm font-medium">
            {erro}
          </div>
        )}

        {carregando ? (
          <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500 text-sm">
            Carregando dados do evento...
          </div>
        ) : (
          <EventForm
            eventoEmEdicao={eventoEmEdicao}
            salvando={salvando}
            onSalvar={handleSalvarEvento}
            onCancelarEdicao={() => navigate('/')}
          />
        )}
      </main>
    </div>
  );
};