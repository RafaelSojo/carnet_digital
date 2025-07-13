import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Usuario } from "../../types/ILogin";

interface LoginState {
  Usuario: Usuario | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  errorType: string | null; // Campo adicional para clasificar el tipo de error
}

const initialState: LoginState = {
  Usuario: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  errorType: null, // Inicializado como null
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
      state.errorType = null; // Resetear el tipo de error al comenzar el login
    },
    loginSuccess: (state, action: PayloadAction<Usuario>) => {
      state.isAuthenticated = true;
      state.Usuario = action.payload;
      state.loading = false;
      state.error = null;
      state.errorType = null; // No hay error después de un login exitoso
    },
    loginFailure: (state, action: PayloadAction<{ message: string; errorType: string }>) => {
      state.loading = false;
      state.error = action.payload.message; // Asignar el mensaje del error
      state.errorType = action.payload.errorType; // Asignar el tipo de error
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.Usuario = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = loginSlice.actions;

export default loginSlice.reducer;
