"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entrar = entrar;
exports.consultar = consultar;
exports.sair = sair;
const loginService_1 = require("../services/loginService");
const sessaoService_1 = require("../services/sessaoService");
const cookieSessao_1 = require("../configuracoes/cookieSessao");
async function entrar(requisicao, resposta) {
    const { email, senha } = requisicao.body ?? {};
    if (typeof email !== 'string' || !email.trim() || typeof senha !== 'string' || !senha.trim()) {
        resposta.status(400).json({ mensagem: 'Informe email e senha.' });
        return;
    }
    const usuario = await (0, loginService_1.autenticar)(email, senha);
    if (!usuario) {
        resposta.status(401).json({ mensagem: 'Email ou senha inválidos.' });
        return;
    }
    const tokenAnterior = (0, cookieSessao_1.lerTokenSessao)(requisicao);
    (0, sessaoService_1.revogarSessao)(tokenAnterior);
    const novoToken = (0, sessaoService_1.criarSessao)(usuario);
    resposta.cookie(cookieSessao_1.nomeCookieSessao, novoToken, {
        ...(0, cookieSessao_1.opcoesCookieSessao)(),
        maxAge: sessaoService_1.duracaoSessao,
    });
    resposta.set('Cache-Control', 'no-store');
    resposta.status(200).json({ usuario });
}
function consultar(_requisicao, resposta) {
    resposta.set('Cache-Control', 'no-store');
    resposta.status(200).json({ usuario: resposta.locals.usuario });
}
function sair(requisicao, resposta) {
    const token = (0, cookieSessao_1.lerTokenSessao)(requisicao);
    (0, sessaoService_1.revogarSessao)(token);
    resposta.clearCookie(cookieSessao_1.nomeCookieSessao, (0, cookieSessao_1.opcoesCookieSessao)());
    resposta.status(204).send();
}
