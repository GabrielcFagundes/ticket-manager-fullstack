"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nomeCookieSessao = void 0;
exports.lerTokenSessao = lerTokenSessao;
exports.opcoesCookieSessao = opcoesCookieSessao;
exports.nomeCookieSessao = "sessao";
function lerTokenSessao(requisicao) {
    return requisicao.cookies?.[exports.nomeCookieSessao];
}
function opcoesCookieSessao() {
    return {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
    };
}
