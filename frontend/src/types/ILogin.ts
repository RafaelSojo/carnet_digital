export interface Usuario {
  Usuario: string;
  Contrasenia: string;
  access_token: string;
  refresh_token: string;
  usuarioID: number;
  expires_in: string;
  nombre_completo: string; // puede ser string o Date si lo conviertes
}