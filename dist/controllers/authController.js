"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
        return;
    }
    // Simulação de autenticação 
    if (email === 'admin@admin.com' && password === '123456') {
        res.status(200).json({
            message: 'Login realizado com sucesso.',
            token: 'fake-jwt-token-para-testes',
        });
        return;
    }
    res.status(401).json({ message: 'Credenciais inválidas.' });
};
exports.login = login;
