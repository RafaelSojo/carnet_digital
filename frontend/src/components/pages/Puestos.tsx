import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchPuestosStart, fetchPuestosSuccess, fetchPuestosFailure, seleccionarPuesto } from '../../redux/slices/puestoSlice';
import { fetchPuestosActivos } from '../../api/puestosApi';
import Layout from '../layout/Layout';
import Table, {Column} from '../common/Table';
import { Puesto } from '../../types/IPuesto';
import { AppDispatch, RootState } from '../../redux/store';

const Puestos: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { puestos, loading, error } = useSelector((state: RootState) => state.puesto);

  useEffect(() => {
    const getPuestos = async () => {
      dispatch(fetchPuestosStart());
      try {
        const data = await fetchPuestosActivos();
        dispatch(fetchPuestosSuccess(data));
      } catch (error) {
        dispatch(fetchPuestosFailure(error instanceof Error ? error.message : 'Error desconocido'));
      }
    };

    getPuestos();
  }, [dispatch]);

  const handlePuestoClick = (puesto: Puesto) => {
    dispatch(seleccionarPuesto(puesto.IdPuesto));
    navigate(`/oferentesListos/${puesto.IdPuesto}`);
  };

  const columns: Column<Puesto>[] = [
    {
      header: 'Código',
      accessor: 'IdPuesto',
    },
    {
      header: 'Nombre',
      accessor: (puesto: Puesto) => (
        <span className="text-blue-600 hover:text-blue-800 hover:underline">
          {puesto.Nombre}
        </span>
      ),
    },
  ];

  return (
    <Layout>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Puestos Disponibles</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        ) : (
          <Table<Puesto>
            columns={columns}
            data={puestos}
            onRowClick={handlePuestoClick}
          />
        )}
      </div>
    </Layout>
  );
};

export default Puestos;