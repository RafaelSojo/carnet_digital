import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchOferentesListos = async (idPuesto: number) => {
  try {
    const response = await axios.get(`${API_URL}/oferentesListos/${idPuesto}`);

    return response.data;
  } catch (error) {
    console.log('Error en la petición de oferentesListos:', error);
    throw error;
  }
};
