import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Usuario } from "../../types/ILogin";

interface LoginState {
  Usuario: Usuario | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  errorType: string | null;
}

const getStoredUser = (): Usuario | null => {
  try {
    const storedUser = localStorage.getItem("usuario");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Error parsing stored user:", error);
    localStorage.removeItem("usuario");
    return null;
  }
};

const initialState: LoginState = {
  Usuario: getStoredUser(),
  isAuthenticated: !!getStoredUser(),
  loading: false,
  error: null,
  errorType: null,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
      state.errorType = null;
    },
    loginSuccess: (state, action: PayloadAction<Usuario>) => {
      state.isAuthenticated = true;
      state.Usuario = action.payload;
      state.loading = false;
      state.error = null;
      state.errorType = null;

      // Guardar el usuario completo en localStorage
      localStorage.setItem("usuario", JSON.stringify(action.payload));
    },
    loginFailure: (state, action: PayloadAction<{ message: string; errorType: string }>) => {
      state.loading = false;
      state.error = action.payload.message;
      state.errorType = action.payload.errorType;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.Usuario = null;
      localStorage.removeItem("usuario");
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = loginSlice.actions;

export default loginSlice.reducer;
