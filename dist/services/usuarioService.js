"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuariosMemoria = void 0;
exports.buscarUsuarioPorId = buscarUsuarioPorId;
exports.buscarUsuarioPorEmail = buscarUsuarioPorEmail;
exports.criarUsuario = criarUsuario;
exports.usuariosMemoria = [
    {
        id: '1',
        nome: 'Administrador',
        email: 'admin@admin.com',
        senha: '123456',
        ativo: true,
    },
];
async function buscarUsuarioPorId(id) {
    return exports.usuariosMemoria.find((u) => u.id === id) || null;
}
async function buscarUsuarioPorEmail(email) {
    return exports.usuariosMemoria.find((u) => u.email === email && u.ativo) || null;
}
async function criarUsuario(nome, email, senha) {
    const novo = {
        id: String(Date.now()),
        nome,
        email,
        senha,
        ativo: true,
    };
    exports.usuariosMemoria.push(novo);
    return novo;
}
