"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autenticar = autenticar;
const usuarioService_1 = require("./usuarioService");
async function autenticar(email, senha) {
    const usuario = await (0, usuarioService_1.buscarUsuarioPorEmail)(email);
    if (!usuario || usuario.senha !== senha) {
        return null;
    }
    return {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
    };
}
