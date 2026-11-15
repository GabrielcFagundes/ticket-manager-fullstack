import type { Request, CookieOptions } from "express";

export const nomeCookieSessao = "sessao";

export function lerTokenSessao(requisicao: Request): string | undefined {
  return requisicao.cookies?.[nomeCookieSessao];
}

export function opcoesCookieSessao(): CookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  };
}
