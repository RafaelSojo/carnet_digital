import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import api from "../../api/axios";
import { cambiarEstadoUsuario } from "../../api/usuarioApi";
import { loginSuccess, logout } from "../../redux/slices/loginSlice";
import Swal from 'sweetalert2';
import Layout from "../layout/Layout";

interface Usuario {
  id: number;
  nombre_completo: string;
  email: string;
  estado_id: number;
  estado_nombre: string;
}

const ESTADOS = [
  { estadoId: 1, descripcion: "Activo" },
  { estadoId: 2, descripcion: "Inactivo" },
  { estadoId: 3, descripcion: "Suspendido" },
  { estadoId: 4, descripcion: "Bloqueado" }
];

const ITEMS_POR_PAGINA = 10;

const CambiarEstado: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usuarioIdInput, setUsuarioIdInput] = useState<string>('');
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<string>('');
  const [paginaActual, setPaginaActual] = useState(1);

  const usuarioLogueado = useSelector((state: RootState) => state.login.Usuario);

  // Cálculos para la paginación
  const totalPaginas = Math.ceil(usuarios.length / ITEMS_POR_PAGINA);
  const indiceInicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const indiceFin = indiceInicio + ITEMS_POR_PAGINA;
  const usuariosPaginados = usuarios.slice(indiceInicio, indiceFin);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const response = await api.get("/usuarios");
      setUsuarios(response.data);
    } catch (err) {
      console.error("Error al obtener usuarios", err);
      setError("Error al obtener la lista de usuarios");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmarCambio = async () => {
    const usuarioId = Number(usuarioIdInput.trim());
    const nuevoEstadoId = Number(estadoSeleccionado.trim());

    if (!usuarioId || isNaN(usuarioId) || usuarioId <= 0) {
      Swal.fire({
        title: 'Atención',
        text: 'Todos los datos son requeridos y no pueden ser vacíos ni espacios en blanco.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    if (!nuevoEstadoId || isNaN(nuevoEstadoId) || nuevoEstadoId <= 0) {
      Swal.fire({
        title: 'Atención',
        text: 'Todos los datos son requeridos y no pueden ser vacíos ni espacios en blanco.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    try {
      await cambiarEstadoUsuario(usuarioId, nuevoEstadoId);
      Swal.fire({
        title: '¡Éxito!',
        text: 'El estado del usuario se actualizó correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
      await fetchUsuarios();
      setUsuarioIdInput('');
      setEstadoSeleccionado('');
    } catch {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo actualizar el estado del usuario.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
    }
  };

  const handleCambiarPagina = (nuevaPagina: number) => {
    setPaginaActual(nuevaPagina);
  };

  const handlePaginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  const handlePaginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      setPaginaActual(paginaActual + 1);
    }
  };

  useEffect(() => {
    if (!usuarioLogueado) {
      const usuarioLocal = localStorage.getItem("usuario");

      if (usuarioLocal) {
        const usuarioParseado = JSON.parse(usuarioLocal);
        dispatch(loginSuccess(usuarioParseado));
      } else {
        dispatch(logout());
      }
    } else {
      fetchUsuarios();
    }
  }, [usuarioLogueado]);

  // Resetear a la primera página cuando cambie el número de usuarios
  useEffect(() => {
    setPaginaActual(1);
  }, [usuarios.length]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
            Cambiar estado de usuarios.
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <input
              type="text"
              value={usuarioIdInput}
              onChange={(e) => setUsuarioIdInput(e.target.value)}
              placeholder="Ingrese ID del usuario"
              className="border px-3 py-2 rounded w-full sm:w-1/3"
            />

            <select
              value={estadoSeleccionado}
              onChange={(e) => setEstadoSeleccionado(e.target.value)}
              className="border px-3 py-2 rounded w-full sm:w-1/3"
            >
              <option value="">--Seleccione Estado--</option>
              {ESTADOS.map((estado) => (
                <option key={estado.estadoId} value={estado.estadoId}>
                  {estado.descripcion}
                </option>
              ))}
            </select>

            <button
              onClick={handleConfirmarCambio}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
            >
              Confirmar Cambio
            </button>
          </div>

          {loading ? (
            <div className="text-center">Cargando usuarios...</div>
          ) : error ? (
            <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Mostrando {indiceInicio + 1} - {Math.min(indiceFin, usuarios.length)} de {usuarios.length} usuarios
              </div>
              
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left text-sm">
                    <th className="p-2 border">ID</th>
                    <th className="p-2 border">Nombre</th>
                    <th className="p-2 border">Correo</th>
                    <th className="p-2 border">Estado Actual</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosPaginados.map((usuario) => (
                    <tr key={usuario.id} className="text-sm border-t">
                      <td className="p-2 border">{usuario.id}</td>
                      <td className="p-2 border">{usuario.nombre_completo}</td>
                      <td className="p-2 border">{usuario.email}</td>
                      <td className="p-2 border">{usuario.estado_nombre}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Controles de paginación */}
              {totalPaginas > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={handlePaginaAnterior}
                    disabled={paginaActual === 1}
                    className={`px-3 py-1 rounded ${
                      paginaActual === 1
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    Anterior
                  </button>

                  <div className="flex space-x-1">
                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numeroPagina) => (
                      <button
                        key={numeroPagina}
                        onClick={() => handleCambiarPagina(numeroPagina)}
                        className={`px-3 py-1 rounded ${
                          numeroPagina === paginaActual
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {numeroPagina}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handlePaginaSiguiente}
                    disabled={paginaActual === totalPaginas}
                    className={`px-3 py-1 rounded ${
                      paginaActual === totalPaginas
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CambiarEstado;