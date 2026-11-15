"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exigirSessao = exigirSessao;
const cookieSessao_1 = require("../configuracoes/cookieSessao");
const sessaoService_1 = require("../services/sessaoService");
const usuarioService_1 = require("../services/usuarioService");
async function exigirSessao(requisicao, resposta, proximo) {
    const token = (0, cookieSessao_1.lerTokenSessao)(requisicao);
    const sessao = token ? (0, sessaoService_1.consultarSessao)(token) : null;
    const usuario = sessao ? await (0, usuarioService_1.buscarUsuarioPorId)(sessao.id) : null;
    if (!usuario || !usuario.ativo) {
        if (token) {
            (0, sessaoService_1.revogarSessao)(token);
        }
        resposta.clearCookie(cookieSessao_1.nomeCookieSessao, (0, cookieSessao_1.opcoesCookieSessao)());
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
