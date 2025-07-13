import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (usuario: string, contrasena: string) => {
  const tipoUsuario = usuario.endsWith('@cuc.cr') ? 'estudiante'
                    : usuario.endsWith('@cuc.ac.cr') ? 'funcionario'
                    : '';

  if (!tipoUsuario) {
    throw new Error('Dominio del correo no es válido');
  }

  const response = await axios.post(`${API_URL}/login`, {}, {
    headers: {
      'usuario': usuario,
      'contrasena': contrasena,
      'tipoUsuario': tipoUsuario
    }
  });

  return response.data;
};