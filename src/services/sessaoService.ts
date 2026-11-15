import type { UsuarioSessao } from "../types/sessao";

export const duracaoSessao = 30 * 60 * 1000;

interface DadosSessao {
  id: string;
  nome: string;
  email: string;
  expiracao: number;
}

const sessoesMemoria = new Map<string, DadosSessao>();

export function criarSessao(usuario: UsuarioSessao): string {
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  sessoesMemoria.set(token, {
    ...usuario,
    expiracao: Date.now() + duracaoSessao,
  });
  return token;
}

export function consultarSessao(token: string): DadosSessao | null {
  const sessao = sessoesMemoria.get(token);
  if (!sessao) return null;

  if (Date.now() > sessao.expiracao) {
    sessoesMemoria.delete(token);
    return null;
  }

  return sessao;
}

export function revogarSessao(token?: string): void {
  if (token) {
    sessoesMemoria.delete(token);
  }
}
