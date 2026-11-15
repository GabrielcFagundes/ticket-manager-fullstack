import { buscarUsuarioPorEmail } from './usuarioService';
import type { UsuarioSessao } from '../types/sessao';

export async function autenticar(email: string, senha: string): Promise<UsuarioSessao | null> {
  const usuario = await buscarUsuarioPorEmail(email);

  if (!usuario || usuario.senha !== senha) {
    return null;
  }

  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
  };
}