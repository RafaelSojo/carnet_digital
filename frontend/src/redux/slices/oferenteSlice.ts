import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Oferente } from "../../types/IOferente";

interface OferenteState {
  oferentes: Oferente[];
  loading: boolean;
  error: string | null;
}

const initialState: OferenteState = {
  oferentes: [],
  loading: false,
  error: null,
};

const oferenteSlice = createSlice({
  name: "oferente",
  initialState,
  reducers: {
    fetchOferentesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchOferentesSuccess: (state, action: PayloadAction<Oferente[]>) => {
      state.oferentes = action.payload;
      state.loading = false;
    },
    fetchOferentesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
   
  },
});

export const {
  fetchOferentesStart,
  fetchOferentesSuccess,
  fetchOferentesFailure,

} = oferenteSlice.actions;

export default oferenteSlice.reducer;
