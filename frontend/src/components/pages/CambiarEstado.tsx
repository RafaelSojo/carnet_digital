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

// Estados definidos manualmente
const ESTADOS = [
  { estadoId: 1, descripcion: "Activo" },
  { estadoId: 2, descripcion: "Inactivo" },
  { estadoId: 3, descripcion: "Suspendido" },
  { estadoId: 4, descripcion: "Bloqueado.0" }
];

const CambiarEstado: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const usuarioLogueado = useSelector((state: RootState) => state.login.Usuario);

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

  const handleEstadoChange = async (usuarioId: number, nuevoEstadoId: number) => {
    if (!usuarioId || !nuevoEstadoId) {
      alert("Debe seleccionar un estado válido.");
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
    } catch {
      Swal.fire({
  title: 'Error',
  text: 'No se pudo actualizar el estado del usuario.',
  icon: 'error',
  confirmButtonText: 'Cerrar',
});
    }
  };

useEffect(() => {
  if (!usuarioLogueado) {
    const usuarioLocal = localStorage.getItem("usuario");

    if (usuarioLocal) {
      const usuarioParseado = JSON.parse(usuarioLocal);
      dispatch(loginSuccess(usuarioParseado)); // Rehidrata el estado
    } else {
      dispatch(logout()); // Si no hay nada en localStorage, forzar logout
    }
  } else {
    fetchUsuarios();
  }
}, [usuarioLogueado]);

  return (
    <Layout>
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
          Cambiar estado de usuarios.
        </h2>

        {loading ? (
          <div className="text-center">Cargando usuarios...</div>
        ) : error ? (
          <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-sm">
                <th className="p-2 border">Nombre</th>
                <th className="p-2 border">Correo</th>
                <th className="p-2 border">Estado Actual</th>
                <th className="p-2 border">Cambiar Estado</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="text-sm border-t">
                  <td className="p-2 border">{usuario.nombre_completo}</td>
                  <td className="p-2 border">{usuario.email}</td>
                  <td className="p-2 border">{usuario.estado_nombre}</td>
                  <td className="p-2 border">
                    <select
                      className="border px-2 py-1 rounded w-full"
                      value={usuario.estado_id}
                      onChange={(e) =>
                        handleEstadoChange(usuario.id, Number(e.target.value))
                      }
                    >
                      <option value="">--Seleccione--</option>
                      {ESTADOS.map((estado) => (
                        <option key={estado.estadoId} value={estado.estadoId}>
                          {estado.descripcion}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
    </Layout>
  );
};

export default CambiarEstado;
