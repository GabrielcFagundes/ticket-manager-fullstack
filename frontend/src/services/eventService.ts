import axios from 'axios';
import api from './api';

export interface EventItem {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  capacity: number;
  ticketPrice: number;
}

export type EventPayload = Omit<EventItem, '_id'>;

function extrairErro(erro: unknown, padrao: string): string {
  if (axios.isAxiosError(erro)) {
    return erro.response?.data?.message || erro.response?.data?.mensagem || padrao;
  }
  return padrao;
}

export async function listarEventos(): Promise<EventItem[]> {
  try {
    const { data } = await api.get<EventItem[]>('/events');
    return data;
  } catch (erro) {
    throw new Error(extrairErro(erro, 'Erro ao carregar eventos.'));
  }
}

export async function criarEvento(payload: EventPayload): Promise<EventItem> {
  try {
    const { data } = await api.post<EventItem>('/events', payload);
    return data;
  } catch (erro) {
    throw new Error(extrairErro(erro, 'Erro ao cadastrar evento.'));
  }
}

export async function atualizarEvento(id: string, payload: EventPayload): Promise<EventItem> {
  try {
    const { data } = await api.put<EventItem>(`/events/${id}`, payload);
    return data;
  } catch (erro) {
    throw new Error(extrairErro(erro, 'Erro ao atualizar evento.'));
  }
}

export async function excluirEvento(id: string): Promise<void> {
  try {
    await api.delete(`/events/${id}`);
  } catch (erro) {
    throw new Error(extrairErro(erro, 'Erro ao excluir evento.'));
  }
}