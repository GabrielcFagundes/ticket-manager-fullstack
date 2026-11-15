import React, { useEffect, useState } from 'react';
import type { EventItem, EventPayload } from '../services/eventService';

interface EventFormProps {
  eventoEmEdicao: EventItem | null;
  salvando: boolean;
  onSalvar: (payload: EventPayload, idEdicao?: string) => Promise<void>;
  onCancelarEdicao: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({
  eventoEmEdicao,
  salvando,
  onSalvar,
  onCancelarEdicao,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('WORKSHOP');
  const [capacity, setCapacity] = useState(50);
  const [ticketPrice, setTicketPrice] = useState(29.9);

  useEffect(() => {
    if (eventoEmEdicao) {
      setTitle(eventoEmEdicao.title);
      setDescription(eventoEmEdicao.description);
      setDate(eventoEmEdicao.date ? new Date(eventoEmEdicao.date).toISOString().slice(0, 16) : '');
      setLocation(eventoEmEdicao.location);
      setCategory(eventoEmEdicao.category || 'WORKSHOP');
      setCapacity(eventoEmEdicao.capacity);
      setTicketPrice(eventoEmEdicao.ticketPrice);
    } else {
      limparCampos();
    }
  }, [eventoEmEdicao]);

  const limparCampos = () => {
    setTitle('');
    setDescription('');
    setDate('');
    setLocation('');
    setCategory('WORKSHOP');
    setCapacity(50);
    setTicketPrice(29.9);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSalvar(
      {
        title,
        description,
        date: new Date(date).toISOString(),
        location,
        category,
        capacity: Number(capacity),
        ticketPrice: Number(ticketPrice),
      },
      eventoEmEdicao?._id
    );
    if (!eventoEmEdicao) {
      limparCampos();
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">
          {eventoEmEdicao ? 'Editando Evento' : 'Novo Evento'}
        </h2>
        {eventoEmEdicao && (
          <button
            type="button"
            onClick={onCancelarEdicao}
            className="text-xs text-gray-500 hover:text-gray-800 underline"
          >
            Cancelar Edição
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Título</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Workshop de React"
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Descrição</label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalhes sobre o evento..."
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Data e Hora</label>
            <input
              type="datetime-local"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="WORKSHOP">Workshop</option>
              <option value="CONFERENCE">Conferência</option>
              <option value="MEETUP">Meetup</option>
              <option value="SHOW">Show</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Local</label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ex: Auditório Principal"
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Capacidade</label>
            <input
              type="number"
              min={1}
              required
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Preço (R$)</label>
            <input
              type="number"
              step="0.01"
              min={0}
              required
              value={ticketPrice}
              onChange={(e) => setTicketPrice(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={salvando}
          className={`w-full text-white font-bold py-2.5 px-4 rounded-lg text-sm transition shadow-sm disabled:opacity-50 ${
            eventoEmEdicao
              ? 'bg-amber-600 hover:bg-amber-700'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {salvando
            ? 'Salvando...'
            : eventoEmEdicao
            ? 'Atualizar Evento'
            : 'Cadastrar Evento'}
        </button>
      </form>
    </div>
  );
};