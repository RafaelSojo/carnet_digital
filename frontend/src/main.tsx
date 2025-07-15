import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { loginSuccess } from "./redux/slices/loginSlice";

// Hidratar sesión desde localStorage si existe
const savedAccessToken = localStorage.getItem("access_token");
const savedRefreshToken = localStorage.getItem("refresh_token");
const savedUsuario = localStorage.getItem("Usuario");
const savedContrasenia = localStorage.getItem("Contrasenia");
const savedUsuarioID = localStorage.getItem("usuarioID");
const savedNombreCompleto = localStorage.getItem("nombre_completo");
const savedExpiresIn = localStorage.getItem("expires_in");

if (
  savedAccessToken &&
  savedRefreshToken &&
  savedUsuario &&
  savedContrasenia &&
  savedUsuarioID &&
  savedNombreCompleto &&
  savedExpiresIn
) {
  store.dispatch(
    loginSuccess({
      Usuario: savedUsuario,
      Contrasenia: savedContrasenia,
      access_token: savedAccessToken,
      refresh_token: savedRefreshToken,
      usuarioID: Number(savedUsuarioID),
      nombre_completo: savedNombreCompleto,
      expires_in: Number(savedExpiresIn),
    })
  );
}

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
