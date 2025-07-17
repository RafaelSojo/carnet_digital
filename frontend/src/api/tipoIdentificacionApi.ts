// src/api/tipoIdentificacionApi.ts
import api from "./axios";

export const obtenerTiposIdentificacion = async () => {
  const response = await api.get("/tiposidentificacion");
  return response.data;
};

export const obtenerTipoIdentificacionPorId = async (id: number) => {
  const response = await api.get(`/tiposidentificacion/${id}`);
  return response.data;
};

export const crearTipoIdentificacion = async (id: number, Descripcion: string) => {
  return api.post("/tiposidentificacion", { id, Descripcion });
};

export const actualizarTipoIdentificacion = async (id: number, Descripcion: string) => {
  return api.put(`/tiposidentificacion/${id}`, { Descripcion });
};

export const eliminarTipoIdentificacion = async (id: number) => {
  return api.delete(`/tiposidentificacion/${id}`);
};
