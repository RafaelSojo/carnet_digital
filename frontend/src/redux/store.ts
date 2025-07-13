import { configureStore } from '@reduxjs/toolkit';
//import authReducer from './slices/authSlice';
import oferenteReducer from './slices/oferenteSlice';
import puestoReducer from './slices/puestoSlice';
import loginReducer from './slices/loginSlice';

export const store = configureStore({
  reducer: {
   // auth: authReducer,
    oferente: oferenteReducer,
    puesto: puestoReducer,
    login: loginReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;