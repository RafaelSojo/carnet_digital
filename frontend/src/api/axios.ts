import axios from 'axios';
import { store } from '../redux/store';
import { loginSuccess, logout } from '../redux/slices/loginSlice';
import { refreshToken } from './authApi';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.login.Usuario?.access_token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const current = store.getState().login.Usuario;

      if (!current) {
        store.dispatch(logout());
        return Promise.reject('Sesión no válida');
      }

      try {
        const newTokens = await refreshToken();

        // Crear el nuevo objeto usuario completo con los tokens renovados
        const updatedUser = {
          Usuario: current.Usuario,
          usuarioID: current.usuarioID,
          access_token: newTokens.access_token,
          refresh_token: newTokens.refresh_token,
          expires_in: newTokens.expires_in,
          nombre_completo: current.nombre_completo,
        };

        // Actualizar redux y localStorage con la info completa
        store.dispatch(loginSuccess(updatedUser));
        localStorage.setItem("usuario", JSON.stringify(updatedUser));

        originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`;
        return api(originalRequest);

      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
