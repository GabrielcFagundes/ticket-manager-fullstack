import type { Request, Response } from 'express';
import type { UsuarioSessao } from '../types/sessao';
import { autenticar } from '../services/loginService';
import { criarSessao, revogarSessao, duracaoSessao } from '../services/sessaoService';
import {
  lerTokenSessao,
  nomeCookieSessao,
  opcoesCookieSessao,
} from '../configuracoes/cookieSessao';

export async function entrar(requisicao: Request, resposta: Response): Promise<void> {
  const { email, senha } = (requisicao.body as { email?: unknown; senha?: unknown }) ?? {};

  if (typeof email !== 'string' || !email.trim() || typeof senha !== 'string' || !senha.trim()) {
    resposta.status(400).json({ mensagem: 'Informe email e senha.' });
    return;
  }

  const usuario = await autenticar(email, senha);

  if (!usuario) {
    resposta.status(401).json({ mensagem: 'Email ou senha inválidos.' });
    return;
  }

  const tokenAnterior = lerTokenSessao(requisicao);
  revogarSessao(tokenAnterior);

  const novoToken = criarSessao(usuario);

  resposta.cookie(nomeCookieSessao, novoToken, {
    ...opcoesCookieSessao(),
    maxAge: duracaoSessao,
  });

  resposta.set('Cache-Control', 'no-store');
  resposta.status(200).json({ usuario });
}

export function consultar(
  _requisicao: Request,
  resposta: Response<unknown, { usuario: UsuarioSessao }>,
): void {
  resposta.set('Cache-Control', 'no-store');
  resposta.status(200).json({ usuario: resposta.locals.usuario });
}

export function sair(requisicao: Request, resposta: Response): void {
  const token = lerTokenSessao(requisicao);
  revogarSessao(token);

  resposta.clearCookie(nomeCookieSessao, opcoesCookieSessao());
  resposta.status(204).send();
}