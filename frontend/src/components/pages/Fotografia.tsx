import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { loginSuccess, logout } from "../../redux/slices/loginSlice";
import Swal from "sweetalert2";
import Layout from "../layout/Layout";
import {
  obtenerFotografia,
  actualizarFotografia,
  eliminarFotografia,
} from "../../api/fotografiaApi";

const FotografiaUsuario: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const usuarioLogueado = useSelector(
    (state: RootState) => state.login.Usuario
  );
  const [fotoBase64, setFotoBase64] = useState<string>("");

  const cargarFotografia = async () => {
    try {
      if (usuarioLogueado?.Usuario) {
        const base64 = await obtenerFotografia(usuarioLogueado.Usuario);
        setFotoBase64(base64);
      }
    } catch {
      setFotoBase64("");
    }
  };

  const handleSleccionarFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFotoBase64(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleActualizarFoto = async () => {
    if (!fotoBase64) {
      Swal.fire("Advertencia", "Debe seleccionar una imagen válida", "warning");
      return;
    }
    try {
      await actualizarFotografia(usuarioLogueado?.Usuario, fotoBase64);
      Swal.fire("Éxito", "Fotografía actualizada", "success");
    } catch (err: any) {
      Swal.fire(
        "Error",
        err.response?.data?.mensaje || "No se pudo actualizar la foto",
        "error"
      )
    }
  };

  const handleEliminarFoto = async () => {
    try {
      await eliminarFotografia(usuarioLogueado?.Usuario);
      setFotoBase64("");
      Swal.fire("Éxito", "Fotografia Eliminada", "success");
      
    } catch{
      Swal.fire(
        "Error", "No se pudo eliminar la foto", "error"
      );
    }
  };

  useEffect(() => {
    if (!usuarioLogueado) {
      const usuarioLocal = localStorage.getItem("usuario");
      if (usuarioLocal) {
        dispatch(loginSuccess(JSON.parse(usuarioLocal)));
      } else {
        dispatch(logout());
      }
    } else {
      cargarFotografia();
    }
  }, [usuarioLogueado]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-xl mx-auto bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
            Fotografía del Usuario
          </h2>

          {fotoBase64 ? (
            <img
              src={fotoBase64}
              alt="Fotografía del usuario"
              className="w-48 h-auto mb-4 rounded border mx-auto"
            />
          ) : (
            <p className="text-center text-gray-500 mb-4">No hay fotografía cargada</p>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleSleccionarFoto}
            className="mb-4 block mx-auto"
          />

          <div className="flex justify-center gap-4">
            <button
              onClick={cargarFotografia}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Obtener Fotografia
            </button>
            <button
              onClick={handleActualizarFoto}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Subir / Actualizar Foto
            </button>
            <button
              onClick={handleEliminarFoto}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Eliminar Foto
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FotografiaUsuario;
