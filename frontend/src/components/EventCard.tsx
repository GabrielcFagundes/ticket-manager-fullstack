import React, { useState } from 'react';
import { Calendar, MapPin, Ticket, Users, Pencil, Trash2 } from 'lucide-react';
import type { EventItem } from '../services/eventService';

interface EventCardProps {
  evento: EventItem;
  emEdicao: boolean;
  onEditar: (evento: EventItem) => void;
  onExcluir: (id: string) => Promise<void>;
}

export const EventCard: React.FC<EventCardProps> = ({
  evento,
  emEdicao,
  onEditar,
  onExcluir,
}) => {
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  const handleConfirmarExclusao = async () => {
    setExcluindo(true);
    try {
      await onExcluir(evento._id);
    } finally {
      setExcluindo(false);
      setConfirmandoExclusao(false);
    }
  };

  return (
    <div
      className={`bg-white p-5 rounded-xl shadow-sm transition flex flex-col sm:flex-row justify-between gap-4 border ${
        emEdicao ? 'border-amber-500 ring-2 ring-amber-200' : 'border-gray-200'
      }`}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full">
            {evento.category}
          </span>
          <h3 className="text-lg font-bold text-gray-800">{evento.title}</h3>
        </div>

        <p className="text-gray-600 text-sm">{evento.description}</p>

        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{evento.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{new Date(evento.date).toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Ticket className="w-4 h-4 text-gray-400" />
            <span>R$ {evento.ticketPrice.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-gray-400" />
            <span>{evento.capacity} vagas</span>
          </div>
        </div>
      </div>

      <div className="flex sm:flex-col justify-end items-end gap-2 shrink-0">
        {!confirmandoExclusao ? (
          <>
            <button
              onClick={() => onEditar(evento)}
              className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-xs px-3 py-1.5 rounded-lg transition"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Editar</span>
            </button>

            <button
              onClick={() => setConfirmandoExclusao(true)}
              className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-800 font-semibold text-xs px-3 py-1.5 rounded-lg transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Excluir</span>
            </button>
          </>
        ) : (
          <div className="bg-red-50 border border-red-200 p-2 rounded-lg text-right space-y-1.5">
            <p className="text-xs font-semibold text-red-800">Confirmar exclusão?</p>
            <div className="flex gap-1.5 justify-end">
              <button
                onClick={() => setConfirmandoExclusao(false)}
                disabled={excluindo}
                className="text-xs px-2 py-1 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Não
              </button>
              <button
                onClick={handleConfirmarExclusao}
                disabled={excluindo}
                className="text-xs px-2 py-1 bg-red-600 text-white rounded font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {excluindo ? '...' : 'Sim'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};