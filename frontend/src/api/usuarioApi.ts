// src/api/usuarioApi.ts
import api from "./axios";

// No necesitas volver a agregar headers aquí, ya los pone el interceptor
export const cambiarEstadoUsuario = async (usuarioId: number, estadoId: number) => {
  return api.patch("/usuarios/estado", {
    usuarioId,
    estadoId,
  });
};

export const obtenerUsuarioPorId = async (usuarioId: number) => {
  const response = await api.get(`/usuarios/${usuarioId}`);
  return response.data;
};