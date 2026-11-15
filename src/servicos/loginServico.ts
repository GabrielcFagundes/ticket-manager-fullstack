// @ts-nocheck
import axios from "axios";

export type DadosLogin = { email: string; senha: string };
export type UsuarioSessao = { id: string; nome: string; email: string };
type RespostaSessao = { usuario: UsuarioSessao };
type RespostaErro = { mensagem?: string };

function obterMensagemErro(erro: unknown): string {
  if (axios.isAxiosError<RespostaErro>(erro)) {
    return (
      erro.response?.data.mensagem ?? "Não foi possível conectar ao servidor."
    );
  }
  return "Não foi possível concluir a operação. Tente novamente.";
}

export async function entrar(dados: DadosLogin): Promise<UsuarioSessao> {
  try {
    const resposta = await axios.post<RespostaSessao>("/api/login", dados);
    return resposta.data.usuario;
  } catch (erro) {
    throw new Error(obterMensagemErro(erro));
  }
}

export async function consultarSessao(): Promise<UsuarioSessao | null> {
  try {
    // TODO 06 — Consulte a identidade e devolva o usuário público.
    const resposta = await axios.get<RespostaSessao>("/api/sessao");
    return resposta.data.usuario;
  } catch (erro) {
    // TODO 07 — Diferencie ausência de sessão de falha na consulta.
    if (axios.isAxiosError(erro) && erro.response?.status === 401) {
      return null;
    }
    throw new Error(obterMensagemErro(erro));
  }
}

export async function sair(): Promise<void> {
  try {
    await axios.post("/api/logout");
  } catch (erro) {
    throw new Error(obterMensagemErro(erro));
  }
}