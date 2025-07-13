import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchOferentesStart,
  fetchOferentesSuccess,
  fetchOferentesFailure,
} from "../../redux/slices/oferenteSlice";
import { fetchOferentesListos } from "../../api/oferenteApi";
import Layout from "../layout/Layout";
import Table, { Column } from "../common/Table";
import Button from "../common/Button";
import { Oferente } from "../../types/IOferente";
import { AppDispatch, RootState } from "../../redux/store";

const Oferentes: React.FC = () => {
  const { idPuesto } = useParams<{ idPuesto: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { oferentes, loading, error } = useSelector(
    (state: RootState) => state.oferente
  );
  const { puestos } = useSelector((state: RootState) => state.puesto);

  const puestoActual = puestos.find(
    (p) => p.IdPuesto === parseInt(idPuesto || "0")
  );

  useEffect(() => {
    if (idPuesto) {
      const getOferentes = async () => {
        dispatch(fetchOferentesStart());
        try {
          const data = await fetchOferentesListos(parseInt(idPuesto));
          console.log("Datos recibidos:", data);

          dispatch(fetchOferentesSuccess(data));
        } catch (error) {
          console.error("Error al obtener oferentes:", error);
          dispatch(
            fetchOferentesFailure(
              error instanceof Error ? error.message : "Error desconocido"
            )
          );
        }
      };

      getOferentes();
    }
  }, [dispatch, idPuesto]);

  const handleOferenteClick = (oferente: Oferente) => {
    navigate(`/oferente/${oferente.identificacion}`);
  };

  const handleRegresar = () => {
    navigate("/puestos");
  };

  const columns: Column<Oferente>[] = [
    {
      header: "Identificación",
      accessor: "identificacion",
      className: "text-gray-600 p-2",
    },
    {
      header: "Nombre",
      accessor: "nombre",
      className: "text-blue-600 hover:text-blue-800 hover:underline p-2",
    },
  ];

  return (
    <Layout>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Oferentes para el puesto:{" "}
            {puestoActual?.Nombre || "Puesto no encontrado"}
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-md">{error}</div>
        ) : (
          <>

            {Array.isArray(oferentes) && oferentes.length > 0 ? (
              <Table<Oferente>
                columns={columns}
                data={oferentes}
                onRowClick={handleOferenteClick}
                className="w-full table-auto border-collapse border border-gray-200"
              />
            ) : (
              <div className="text-center text-gray-500 py-4">
                No hay oferentes disponibles para este puesto
              </div>
            )}

            <div className="mt-6">
              <Button
                onClick={handleRegresar}
                variant="secondary"
                className="flex items-center"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                  />
                </svg>
                Regresar
              </Button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Oferentes;
