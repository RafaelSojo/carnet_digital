// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";

// Componentes
import Bienvenida from "./components/pages/Bienvenida";
import CambiarEstado from "./components/pages/CambiarEstado";
import Oferentes from "./components/pages/Oferentes";
import Login from "./components/pages/Login";

// Componente para proteger rutas privadas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.login);

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Bienvenida />
            </ProtectedRoute>
          }
        />

        <Route
          path="/CambiarEstado"
          element={
            <ProtectedRoute>
              <CambiarEstado />
            </ProtectedRoute>
          }
        />

        <Route
          path="/oferentesListos/:idPuesto"
          element={
            <ProtectedRoute>
              <Oferentes />
            </ProtectedRoute>
          }
        />

        {/* Redirige a login si no encuentra ruta */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
