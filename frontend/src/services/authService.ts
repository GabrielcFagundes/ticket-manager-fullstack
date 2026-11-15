import axios from 'axios';
import api from './api';

export interface UsuarioSessao {
  id: string;
  nome: string;
  email: string;
}

function extrairErro(erro: unknown, padrao: string): string {
  if (axios.isAxiosError(erro)) {
    return erro.response?.data?.mensagem || erro.response?.data?.message || padrao;
  }
  return padrao;
}

export async function loginUsuario(email: string, senha: string): Promise<UsuarioSessao> {
  try {
    const { data } = await api.post<{ usuario: UsuarioSessao }>('/auth/login', { email, senha });
    return data.usuario;
  } catch (erro) {
    throw new Error(extrairErro(erro, 'Falha ao realizar login.'));
  }
}

export async function cadastrarUsuario(name: string, email: string, password: string): Promise<string> {
  try {
    const { data } = await api.post<{ mensagem: string }>('/auth/register', { name, email, password });
    return data.mensagem;
  } catch (erro) {
    throw new Error(extrairErro(erro, 'Erro ao cadastrar usuário.'));
  }
}

export async function recuperarSenha(email: string): Promise<string> {
  try {
    const { data } = await api.post<{ mensagem: string }>('/auth/forgot-password', { email });
    return data.mensagem;
  } catch (erro) {
    throw new Error(extrairErro(erro, 'Erro ao solicitar recuperação de senha.'));
  }
}

export async function consultarSessaoAtual(): Promise<UsuarioSessao | null> {
  try {
    const { data } = await api.get<{ usuario: UsuarioSessao }>('/auth/sessao');
    return data.usuario;
  } catch (erro) {
    if (axios.isAxiosError(erro) && erro.response?.status === 401) {
      return null;
    }
    throw new Error(extrairErro(erro, 'Erro ao validar sessão com o servidor.'));
  }
}

export async function logoutUsuario(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } catch (erro) {
    throw new Error(extrairErro(erro, 'Erro ao sair do sistema.'));
  }
}