import axios from 'axios';
import { store } from '../redux/store';
import { loginSuccess, logout } from '../redux/slices/loginSlice';
import { refreshToken } from './authApi';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor de REQUEST — Solo agrega el token
api.interceptors.request.use((config) => {
  const token = store.getState().login.Usuario?.access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de RESPONSE — Valida el token y refresca si es necesario
api.interceptors.response.use(
  async (response) => {
    const token = store.getState().login.Usuario?.access_token;
    if (token) {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/validate`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch {
        store.dispatch(logout());
        throw new axios.Cancel('Token inválido');
      }
    }
    return response;
  },
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

        const updatedUser = {
          Usuario: current.Usuario,
          usuarioID: current.usuarioID,
          access_token: newTokens.access_token,
          refresh_token: newTokens.refresh_token,
          expires_in: newTokens.expires_in,
          nombre_completo: current.nombre_completo,
        };

        store.dispatch(loginSuccess(updatedUser));
        localStorage.setItem('usuario', JSON.stringify(updatedUser));

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
