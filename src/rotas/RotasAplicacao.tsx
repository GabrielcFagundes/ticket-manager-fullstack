// @ts-nocheck
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ContasPagar from "../paginas/ContasPagar";
import ContasReceber from "../paginas/ContasReceber";
import DetalhesPrestacao from "../paginas/DetalhesPrestacao";
import Inicio from "../paginas/Inicio";
import Login from "../paginas/Login";
import ListaPrestacoes from "../paginas/ListaPrestacoes";
import NaoEncontrado from "../paginas/NaoEncontrado";
import NovaPrestacao from "../paginas/NovaPrestacao";
import SobreSistema from "../paginas/SobreSistema";
import { consultarSessao, type UsuarioSessao } from "../servicos/loginServico";
import LayoutPrincipal from "./LayoutPrincipal";

function RotasAplicacao() {
  const [usuario, definirUsuario] = useState<UsuarioSessao | null>(null);
  const [carregando, definirCarregando] = useState(true);
  const [erro, definirErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function recuperarSessao() {
      try {
        // TODO 08 — Recupere a identidade antes de escolher a tela.
        const dadosUsuario = await consultarSessao();
        if (ativo) {
          definirUsuario(dadosUsuario);
        }
      } catch (erro) {
        if (ativo) {
          definirErro(
            erro instanceof Error
              ? erro.message
              : "Falha ao verificar a sessão.",
          );
        }
      } finally {
        if (ativo) definirCarregando(false);
      }
    }

    recuperarSessao();

    return () => {
      ativo = false;
    };
  }, []);

  if (carregando) {
    return (
      <main className="estado-sessao" role="status">
        Verificando sessão...
      </main>
    );
  }

  if (erro) {
    return (
      <main className="estado-sessao">
        <p className="mensagem-erro" role="alert">
          {erro}
        </p>
        <button onClick={() => window.location.reload()}>
          Tentar novamente
        </button>
      </main>
    );
  }

  return (
    <Routes>
      <Route
        path="login"
        element={
          usuario ? (
            <Navigate to="/" replace />
          ) : (
            <Login aoEntrar={definirUsuario} />
          )
        }
      />
      <Route
        element={
          usuario ? (
            <LayoutPrincipal
              usuario={usuario}
              aoSair={() => definirUsuario(null)}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route index element={<Inicio />} />
        <Route path="prestacoes" element={<ListaPrestacoes />} />
        <Route path="prestacoes/pagar" element={<ContasPagar />} />
        <Route path="prestacoes/receber" element={<ContasReceber />} />
        <Route path="prestacoes/nova" element={<NovaPrestacao />} />
        <Route path="prestacoes/:id" element={<DetalhesPrestacao />} />
        <Route path="sobre" element={<SobreSistema />} />
        <Route path="*" element={<NaoEncontrado />} />
      </Route>
    </Routes>
  );
}

export default RotasAplicacao;