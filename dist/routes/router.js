"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const exigirSessao_1 = require("../middlewares/exigirSessao");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const eventRoutes_1 = __importDefault(require("./eventRoutes"));
const rotas = (0, express_1.Router)();
rotas.use('/auth', authRoutes_1.default);
rotas.use('/events', exigirSessao_1.exigirSessao, eventRoutes_1.default);
exports.default = rotas;
