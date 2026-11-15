"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const exigirSessao_1 = require("./middlewares/exigirSessao");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Documentação Swagger
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
app.get('/', (_req, res) => {
    res.send('API de Eventos está rodando! Acesse /api-docs para a documentação.');
});
// Rotas públicas de autenticação (login, register, logout, sessao)
app.use('/api/auth', authRoutes_1.default);
// Rotas protegidas por sessão via cookie httpOnly
app.use('/api/events', exigirSessao_1.exigirSessao, eventRoutes_1.default);
exports.default = app;
