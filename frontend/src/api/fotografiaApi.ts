import api from "./axios";

export const obtenerFotografia = async (usuario: string): Promise<string> => {
  const response = await api.get(`/usuario/fotografia/${usuario}`);
  return response.data.fotografia;
};

export const actualizarFotografia = async (
  usuario: string,
  imagenBase64: string
): Promise<void> => {
  return api.put(`/usuario/fotografia/${usuario}`, { imagenBase64 });
};

export const eliminarFotografia = async (usuario: string): Promise<void> => {
  return api.delete(`/usuario/fotografia/${usuario}`);
};
