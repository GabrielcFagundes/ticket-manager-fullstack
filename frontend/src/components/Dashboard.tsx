import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface EventItem {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  capacity: number;
  ticketPrice: number;
}

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado para controlar se estamos editando um evento existente
  const [editingId, setEditingId] = useState<string | null>(null);

  // Estados dos campos do formulário
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState(50);
  const [ticketPrice, setTicketPrice] = useState(29.9);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (err) {
      console.error('Erro ao buscar eventos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setDate('');
    setLocation('');
    setCapacity(50);
    setTicketPrice(29.9);
  };

  const handleStartEdit = (evt: EventItem) => {
    setEditingId(evt._id);
    setTitle(evt.title);
    setDescription(evt.description);
    const formattedDate = evt.date ? new Date(evt.date).toISOString().slice(0, 16) : '';
    setDate(formattedDate);
    setLocation(evt.location);
    setCapacity(evt.capacity);
    setTicketPrice(evt.ticketPrice);
  };

  // Submissão unificada: Cadastra se não estiver editando; Atualiza se estiver editando.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title,
      description,
      date: new Date(date).toISOString(),
      location,
      category: 'WORKSHOP',
      capacity: Number(capacity),
      ticketPrice: Number(ticketPrice),
    };

    try {
      if (editingId) {
        // Modo Edição -> Atualiza o evento (PUT /events/:id)
        await api.put(`/events/${editingId}`, payload);
      } else {
        // Modo Cadastro -> Cria um novo evento (POST /events)
        await api.post('/events', payload);
      }
      fetchEvents();
      resetForm();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao salvar o evento.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja realmente excluir este evento?')) {
      try {
        await api.delete(`/events/${id}`);
        fetchEvents();
      } catch (err) {
        alert('Erro ao deletar evento.');
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '16px' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Painel - Event Ticket Manager</h1>
          <button
            onClick={onLogout}
            style={{ backgroundColor: '#ef4444', color: '#ffffff', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', border: 'none', cursor: 'pointer' }}
          >
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Formulário de Cadastro / Edição */}
        <div className="bg-white p-6 rounded-lg shadow h-fit">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-700">
              {editingId ? 'Editando Evento' : 'Novo Evento'}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                Cancelar Edição
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-600">Título</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                className="w-full border rounded p-2 text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Descrição</label>
              <textarea
                required
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                className="w-full border rounded p-2 text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Data e Hora</label>
              <input
                type="datetime-local"
                required
                value={date}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
                className="w-full border rounded p-2 text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Local</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
                className="w-full border rounded p-2 text-sm outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-gray-600">Capacidade</label>
                <input
                  type="number"
                  required
                  value={capacity}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCapacity(Number(e.target.value))}
                  className="w-full border rounded p-2 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Preço (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={ticketPrice}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTicketPrice(Number(e.target.value))}
                  className="w-full border rounded p-2 text-sm outline-none"
                />
              </div>
            </div>

            {/* Botão de Envio com Cores Garantidas em Inline Styles */}
            <div className="pt-2">
              <button
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: editingId ? '#d97706' : '#16a34a', // Laranja escuro / Âmbar para Atualizar; Verde para Cadastrar
                  color: '#ffffff',
                  fontWeight: 'bold',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                {editingId ? 'Atualizar Evento' : 'Cadastrar Evento'}
              </button>
            </div>
          </form>
        </div>

        {/* Lista de Eventos */}
        <div className="md:col-span-2">
          <h2 className="text-lg font-bold mb-4 text-gray-700">Eventos Cadastrados</h2>
          {loading ? (
            <p className="text-gray-500">Carregando eventos...</p>
          ) : events.length === 0 ? (
            <p className="text-gray-500">Nenhum evento cadastrado ainda.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {events.map((evt) => (
                <div
                  key={evt._id}
                  style={{
                    backgroundColor: '#ffffff',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    border: editingId === evt._id ? '2px solid #d97706' : '1px solid #e5e7eb'
                  }}
                >
                  <div>
                    <h3 className="text-lg font-semibold text-blue-600">{evt.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{evt.description}</p>
                    <div className="mt-3 text-xs text-gray-500 space-y-1">
                      <p>📍 <strong>Local:</strong> {evt.location}</p>
                      <p>📅 <strong>Data:</strong> {new Date(evt.date).toLocaleString('pt-BR')}</p>
                      <p>
                        🎟️ <strong>Ingresso:</strong> R$ {evt.ticketPrice.toFixed(2)} | 👥{' '}
                        <strong>Vagas:</strong> {evt.capacity}
                      </p>
                    </div>
                  </div>

                  {/* Ações: Editar e Excluir */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStartEdit(evt)}
                      style={{
                        backgroundColor: '#fef3c7',
                        color: '#92400e',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        border: '1px solid #fcd34d',
                        cursor: 'pointer'
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(evt._id)}
                      style={{
                        backgroundColor: '#fee2e2',
                        color: '#991b1b',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        border: '1px solid #fca5a5',
                        cursor: 'pointer'
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};