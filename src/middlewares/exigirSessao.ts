import type { Request, Response, NextFunction } from 'express';
import {
  lerTokenSessao,
  nomeCookieSessao,
  opcoesCookieSessao,
} from '../configuracoes/cookieSessao';
import { consultarSessao, revogarSessao } from '../services/sessaoService';
import { buscarUsuarioPorId } from '../services/usuarioService';

export async function exigirSessao(
  requisicao: Request,
  resposta: Response,
  proximo: NextFunction,
): Promise<void> {
  const token = lerTokenSessao(requisicao);
  const sessao = token ? consultarSessao(token) : null;

  const usuario = sessao ? await buscarUsuarioPorId(sessao.id) : null;

  if (!usuario || !usuario.ativo) {
    if (token) {
      revogarSessao(token);
    }
    resposta.clearCookie(nomeCookieSessao, opcoesCookieSessao());
    resposta.status(401).json({ mensagem: 'Acesso não autorizado. Faça login novamente.' });
    return;
  }

  resposta.locals.usuario = {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
  };

  proximo();
}