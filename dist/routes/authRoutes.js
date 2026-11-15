"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logincontroller_1 = require("../controllers/logincontroller");
const exigirSessao_1 = require("../middlewares/exigirSessao");
const usuarioService_1 = require("../services/usuarioService");
const router = (0, express_1.Router)();
// Login gravando cookie httpOnly (aceita "senha" ou "password" no body)
router.post('/login', (req, res, next) => {
    if (!req.body.senha && req.body.password) {
        req.body.senha = req.body.password;
    }
    return (0, logincontroller_1.entrar)(req, res).catch(next);
});
// Verifica se o cookie de sessão atual é válido e devolve os dados do usuário
router.get('/sessao', exigirSessao_1.exigirSessao, logincontroller_1.consultar);
// Encerra a sessão e limpa o cookie
router.post('/logout', logincontroller_1.sair);
// Cadastro de novo usuário
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
    }
    const existente = await (0, usuarioService_1.buscarUsuarioPorEmail)(email);
    if (existente) {
        return res.status(400).json({ mensagem: 'Este e-mail já está cadastrado.' });
    }
    await (0, usuarioService_1.criarUsuario)(name, email, password);
    return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso! Faça login.' });
});
// Recuperação de senha
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ mensagem: 'E-mail é obrigatório.' });
    }
    const existente = await (0, usuarioService_1.buscarUsuarioPorEmail)(email);
    if (!existente) {
        return res.status(404).json({ mensagem: 'E-mail não encontrado no sistema.' });
    }
    return res.json({ mensagem: 'Instruções de recuperação enviadas para o seu e-mail!' });
});
exports.default = router;
