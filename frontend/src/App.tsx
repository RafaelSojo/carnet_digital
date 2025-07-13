// src/App.tsx

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';


// Componentes

import Bienvenida from "./components/pages/Bienvenida";
import Puestos from "./components/pages/Puestos";
import Oferentes from "./components/pages/Oferentes";
import Login from './components/pages/Login'


<Route path="/oferentesListos/:idPuesto" element={
        
            <Oferentes />
          
        } />

    
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.login);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};


const App: React.FC = () => {
  return (
    <Router>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Bienvenida />
          </ProtectedRoute>
        } />

        <Route path="/puestos" element={
          <ProtectedRoute>
            <Puestos />
          </ProtectedRoute>
        } />

        <Route path="/oferentesListos/:idPuesto" element={
          <ProtectedRoute>
            <Oferentes />
          </ProtectedRoute>
        } />

        

        {/* Ruta por defecto redirige al dashboard si está autenticado o al login si no */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
