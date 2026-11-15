"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duracaoSessao = void 0;
exports.criarSessao = criarSessao;
exports.consultarSessao = consultarSessao;
exports.revogarSessao = revogarSessao;
exports.duracaoSessao = 30 * 60 * 1000;
const sessoesMemoria = new Map();
function criarSessao(usuario) {
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    sessoesMemoria.set(token, {
        ...usuario,
        expiracao: Date.now() + exports.duracaoSessao,
    });
    return token;
}
function consultarSessao(token) {
    const sessao = sessoesMemoria.get(token);
    if (!sessao)
        return null;
    if (Date.now() > sessao.expiracao) {
        sessoesMemoria.delete(token);
        return null;
    }
    return sessao;
}
function revogarSessao(token) {
    if (token) {
        sessoesMemoria.delete(token);
    }
}
