export interface UsuarioSistema {
  id: string;
  nome: string;
  email: string;
  senha: string;
  ativo: boolean;
}

export const usuariosMemoria: UsuarioSistema[] = [
  {
    id: '1',
    nome: 'Administrador',
    email: 'admin@admin.com',
    senha: '123456',
    ativo: true,
  },
];

export async function buscarUsuarioPorId(id: string) {
  return usuariosMemoria.find((u) => u.id === id) || null;
}

export async function buscarUsuarioPorEmail(email: string) {
  return usuariosMemoria.find((u) => u.email === email && u.ativo) || null;
}

export async function criarUsuario(nome: string, email: string, senha: string) {
  const novo: UsuarioSistema = {
    id: String(Date.now()),
    nome,
    email,
    senha,
    ativo: true,
  };
  usuariosMemoria.push(novo);
  return novo;
}