import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { loginSuccess, logout } from "../../redux/slices/loginSlice";
import Swal from "sweetalert2";
import Layout from "../layout/Layout";
import {
  obtenerTiposUsuario,
  obtenerTipoUsuarioPorId,
  crearTipoUsuario,
  actualizarTipoUsuario,
  eliminarTipoUsuario,
} from "../../api/tipoUsuarioApi";

interface TipoUsuario {
  id: number;
  nombre: string;
}

const TiposUsuario: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [tipos, setTipos] = useState<TipoUsuario[]>([]);
  const [nombre, setNombre] = useState<string>("");
  const [id, setId] = useState<string>("");  // Mantengo string para input, parseamos luego
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const usuarioLogueado = useSelector((state: RootState) => state.login.Usuario);

  const fetchTipos = async () => {
    try {
      const data = await obtenerTiposUsuario();
      setTipos(data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron obtener los tipos de usuario", "error");
    }
  };

  const handleCrear = async () => {
    const parsedId = parseInt(id.trim(), 10);
    if (isNaN(parsedId) || parsedId <= 0 || nombre.trim() === "") {
      Swal.fire("Atención", "El ID debe ser un entero positivo y el nombre no puede estar vacío", "warning");
      return;
    }

    try {
      await crearTipoUsuario(parsedId, nombre.trim());
      Swal.fire("Éxito", "Tipo de usuario creado", "success");
      setId("");
      setNombre("");
      await fetchTipos();
    } catch {
      Swal.fire("Error", "No se pudo crear el tipo de usuario", "error");
    }
  };

  const handleEditar = (tipo: TipoUsuario) => {
    setEditandoId(tipo.id);
    setId(tipo.id.toString());
    setNombre(tipo.nombre);
  };

  const handleActualizar = async () => {
    if (editandoId === null || nombre.trim() === "") {
      Swal.fire("Atención", "El nombre es requerido y no puede estar vacío", "warning");
      return;
    }

    try {
      await actualizarTipoUsuario(editandoId, nombre.trim());
      Swal.fire("Éxito", "Tipo de usuario actualizado", "success");
      setEditandoId(null);
      setId("");
      setNombre("");
      await fetchTipos();
    } catch {
      Swal.fire("Error", "No se pudo actualizar el tipo de usuario", "error");
    }
  };

  const handleEliminar = async (id: number) => {
    try {
      await eliminarTipoUsuario(id);
      Swal.fire("Éxito", "Tipo de usuario eliminado", "success");
      await fetchTipos();
    } catch {
      Swal.fire("Error", "No se pudo eliminar el tipo de usuario", "error");
    }
  };

  const handleConsultarPorId = async () => {
    const parsedId = parseInt(id.trim(), 10);
    if (isNaN(parsedId) || parsedId <= 0) {
      Swal.fire("Atención", "Debe ingresar un ID válido (entero positivo)", "warning");
      return;
    }

    try {
      const tipo = await obtenerTipoUsuarioPorId(parsedId.toString());
      Swal.fire("Resultado", `ID: ${tipo.id} - Nombre: ${tipo.nombre}`, "info");
    } catch {
      Swal.fire("Error", "No se encontró el tipo de usuario", "error");
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
            Administración de Tipos de Usuario
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <input
              type="number"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="ID del tipo (entero positivo)"
              className="border px-3 py-2 rounded w-full sm:w-1/3"
              disabled={editandoId !== null} // No cambiar ID al editar
              min={1}
            />
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre"
              className="border px-3 py-2 rounded w-full sm:w-1/3"
            />
            <div className="flex flex-col gap-2">
              {editandoId !== null ? (
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
                <th className="p-2 border">Nombre</th>
                <th className="p-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tipos.map((tipo) => (
                <tr key={tipo.id} className="text-sm border-t">
                  <td className="p-2 border">{tipo.id}</td>
                  <td className="p-2 border">{tipo.nombre}</td>
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

export default TiposUsuario;
