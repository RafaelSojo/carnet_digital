import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Puesto } from '../../types/IPuesto';


interface PuestoState {
  puestos: Puesto[];
  puestoSeleccionado: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: PuestoState = {
  puestos: [],
  puestoSeleccionado: null,
  loading: false,
  error: null,
};

const puestoSlice = createSlice({
  name: 'puesto',
  initialState,
  reducers: {
    fetchPuestosStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPuestosSuccess: (state, action: PayloadAction<Puesto[]>) => {
      state.puestos = action.payload;
      state.loading = false;
    },
    fetchPuestosFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    seleccionarPuesto: (state, action: PayloadAction<number>) => {
      state.puestoSeleccionado = action.payload;
    },
  },
});

export const {
  fetchPuestosStart,
  fetchPuestosSuccess,
  fetchPuestosFailure,
  seleccionarPuesto,
} = puestoSlice.actions;

export default puestoSlice.reducer;