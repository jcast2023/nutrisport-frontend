export interface AuthResponse {
  token: string;
  mensaje: string;
}

export interface UsuarioLogueado {
  id: number;
  nombre: string;
  email: string;
  rol: 'Atleta' | 'Nutricionista'; // 👈 Tipado estricto para los roles que configuramos en .NET
}
