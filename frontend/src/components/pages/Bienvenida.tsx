import React from "react";
import { useSelector } from 'react-redux';
import Layout from "../layout/Layout";

import { RootState } from '../../redux/store';

const Bienvenida: React.FC = () => {
 const { Usuario } = useSelector((state: RootState) => state.login);

  return (
    <Layout>
      
<div className="bg-white shadow rounded-lg p-6 text-center">
  <h1 className="text-2xl font-bold text-gray-800 mb-4">
    Bienvenido, {Usuario?.nombre_completo || 'Usuario'}
  </h1>
 
  <div className="mt-6 p-6 bg-blue-100 rounded-lg border border-blue-100">
            <div className="flex justify-center mb-6">
          <img
            src="/logo.jpg"
            alt="Logo Los 4 mares"
            className="w-50 h-50 rounded-full"
          />
        </div>
    <h2 className="text-xl font-semibold text-blue-800 mb-3">
      Información de la Empresa.
    </h2>
    <p className="text-gray-700 mb-4">
      Los 4 mares, empresa líder en el campo de la programacion, comprometida
      con la atención y el bienestar de nuestros clientes.
      Con una pasión por la excelencia y un equipo de profesionales altamente
      capacitados, nos enorgullece brindar nuestros servicios para satisfacer sus necesidades.
    </p>
    <p className="text-gray-700 font-bold">
      En Los 4 mares, nuestra misión es proporcionar facilidad a nuestros usuarios, 
      brindándoles soluciones de software de calidad.
    </p>
  </div>
</div>
    </Layout>
  );
};

export default Bienvenida;
