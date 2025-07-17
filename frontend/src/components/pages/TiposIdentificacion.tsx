import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { loginSuccess, logout } from "../../redux/slices/loginSlice";
import Swal from "sweetalert2";
import Layout from "../layout/Layout";
import {
  obtenerTiposIdentificacion,
  obtenerTipoIdentificacionPorId,
  crearTipoIdentificacion,
  actualizarTipoIdentificacion,
  eliminarTipoIdentificacion,
} from "../../api/tipoIdentificacionApi";

interface TipoIdentificacion {
  id: number;
  Descripcion: string;
}

const TipoIdentificacionPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [tipos, setTipos] = useState<TipoIdentificacion[]>([]);
  const [descripcion, setDescripcion] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const usuarioLogueado = useSelector((state: RootState) => state.login.Usuario);

  const fetchTipos = async () => {
    try {
      const data = await obtenerTiposIdentificacion();
      setTipos(data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron obtener los tipos de identificación", "error");
    }
  };

  const handleCrear = async () => {
    const parsedId = parseInt(id.trim(), 10);
    if (!parsedId || descripcion.trim() === "") {
      Swal.fire("Atención", "Todos los datos son requeridos y no pueden ser vacíos", "warning");
      return;
    }

    try {
      await crearTipoIdentificacion(parsedId, descripcion.trim());
      Swal.fire("Éxito", "Tipo de identificación creado", "success");
      setId("");
      setDescripcion("");
      await fetchTipos();
    } catch {
      Swal.fire("Error", "No se pudo crear el tipo de identificación", "error");
    }
  };

  const handleEditar = (tipo: TipoIdentificacion) => {
    setEditandoId(tipo.id);
    setDescripcion(tipo.Descripcion);
  };

  const handleActualizar = async () => {
    if (!editandoId || descripcion.trim() === "") {
      Swal.fire("Atención", "Todos los datos son requeridos y no pueden ser vacíos", "warning");
      return;
    }

    try {
      await actualizarTipoIdentificacion(editandoId, descripcion.trim());
      Swal.fire("Éxito", "Tipo de identificación actualizado", "success");
      setEditandoId(null);
      setDescripcion("");
      await fetchTipos();
    } catch {
      Swal.fire("Error", "No se pudo actualizar el tipo de identificación", "error");
    }
  };

  const handleEliminar = async (id: number) => {
    try {
      await eliminarTipoIdentificacion(id);
      Swal.fire("Éxito", "Tipo de identificación eliminado", "success");
      await fetchTipos();
    } catch {
      Swal.fire("Error", "No se pudo eliminar el tipo de identificación", "error");
    }
  };

  const handleConsultarPorId = async () => {
    const parsedId = parseInt(id.trim(), 10);
    if (!parsedId) {
      Swal.fire("Atención", "Debe ingresar un ID válido", "warning");
      return;
    }

    try {
      const tipo = await obtenerTipoIdentificacionPorId(parsedId);
      Swal.fire("Resultado", `ID: ${tipo.id} - Descripción: ${tipo.Descripcion}`, "info");
    } catch {
      Swal.fire("Error", "No se encontró el tipo de identificación", "error");
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
      fetchTipos();
    }
  }, [usuarioLogueado]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
            Administración de Tipos de Identificación
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="ID del tipo"
              className="border px-3 py-2 rounded w-full sm:w-1/3"
            />
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción"
              className="border px-3 py-2 rounded w-full sm:w-1/3"
            />
            <div className="flex flex-col gap-2">
              {editandoId ? (
                <button
                  onClick={handleActualizar}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Actualizar
                </button>
              ) : (
                <button
                  onClick={handleCrear}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Crear
                </button>
              )}
              <button
                onClick={handleConsultarPorId}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Consultar por ID
              </button>
            </div>
          </div>

          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-sm">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Descripción</th>
                <th className="p-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tipos.map((tipo) => (
                <tr key={tipo.id} className="text-sm border-t">
                  <td className="p-2 border">{tipo.id}</td>
                  <td className="p-2 border">{tipo.Descripcion}</td>
                  <td className="p-2 border flex gap-2">
                    <button
                      onClick={() => handleEditar(tipo)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(tipo.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default TipoIdentificacionPage;
