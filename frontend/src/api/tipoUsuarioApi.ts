// src/api/tipoUsuarioApi.ts
import api from "./axios";

export const obtenerTiposUsuario = async () => {
  const response = await api.get("/tiposusuario");
  return response.data;
};

export const obtenerTipoUsuarioPorId = async (id: number) => {
  const response = await api.get(`/tiposusuario/${id}`);
  return response.data;
};

export const crearTipoUsuario = async (id: number, nombre: string) => {
  return api.post("/tiposusuario", { id, nombre });
};

export const actualizarTipoUsuario = async (id: number, nombre: string) => {
  return api.put(`/tiposusuario/${id}`, { nombre });
};

export const eliminarTipoUsuario = async (id: number) => {
  return api.delete(`/tiposusuario/${id}`);
};
