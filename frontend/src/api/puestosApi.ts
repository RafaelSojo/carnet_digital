import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchPuestosActivos = async () => {
  try {
    const response = await axios.get(`${API_URL}/puestos`);
    return response.data;
  } catch (error) {
    console.error('Error fetching puestos activos:', error);
    throw error;
  }
};