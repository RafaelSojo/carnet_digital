import React, { useEffect, useRef, useState } from "react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fotoBase64, setFotoBase64] = useState<string>("");
  const [usuarioID, setusuarioID] = useState<string>("");

  const cargarFotografia = async () => {
    if (!usuarioID) {
      Swal.fire(
        "Advertencia",
        "Debe ingresar un correo de usuario valido",
        "warning"
      );
      return;
    }
    try {
      if (usuarioLogueado?.Usuario) {
        const base64 = await obtenerFotografia(usuarioID);
        setFotoBase64(base64);
      }
    } catch (err: any) {
      console.error("Error al obtener la fotografía:", err);
      console.log("Error completo:", err.response?.data);
      console.log("Error completo:", err.response?.mensaje);
      const mensajeError =
        err.response?.data?.mensaje ||
        err.response?.data?.error ||
        "Erro al obtener la fotografia";
      Swal.fire("Error", mensajeError, "error");
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
    if (!usuarioID && !fotoBase64) {
      Swal.fire(
        "Advertencia",
        "Todos los datos son requeridos y no pueden ser vacíos",
        "warning"
      );
      return;
    }
    if (!usuarioID) {
      Swal.fire(
        "Advertencia",
        "Debe ingresar un correo de usuario valido",
        "warning"
      );
      return;
    }
    if (!fotoBase64) {
      Swal.fire("Advertencia", "Debe seleccionar una imagen válida", "warning");
      return;
    }
    try {
      const base64Clean = fotoBase64.split(",")[1];
      await actualizarFotografia(usuarioID, base64Clean);
      Swal.fire("Éxito", "Fotografía actualizada", "success");
      setusuarioID("");
      setFotoBase64("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      console.error("Error al actualizar la fotografía:", err);
      console.log("Error completo:", err.response?.data);
      console.log("Error completo:", err.response?.mensaje);
      const mensajeError =
        err.response?.data?.mensaje ||
        err.response?.data?.error ||
        "Error al actualizar la fotografia";
      Swal.fire("Error", mensajeError, "error");
    }
  };

  const handleEliminarFoto = async () => {
    if (!usuarioID && !fotoBase64) {
      Swal.fire(
        "Advertencia",
        "Todos los datos son requeridos y no pueden ser vacíos",
        "warning"
      );
      return;
    }
    if (!usuarioID) {
      Swal.fire(
        "Advertencia",
        "Debe ingresar un correo de usuario valido",
        "warning"
      );
      return;
    }
    if (!fotoBase64) {
      Swal.fire(
        "Advertencia",
        "Debe obtener la imagen del usuario previo a eliminar",
        "warning"
      );
      return;
    }
    try {
      await eliminarFotografia(usuarioID);
      setFotoBase64("");
      Swal.fire("Éxito", "Fotografia Eliminada", "success");
      setusuarioID("");
      setFotoBase64("");
    } catch (err: any) {
      console.error("Error al Eliminar la fotografía:", err);
      console.log("Error completo:", err.response?.data);
      console.log("Error completo:", err.response?.mensaje);
      const mensajeError =
        err.response?.data?.mensaje ||
        err.response?.data?.error ||
        "Erro al Eliminar la fotografia";
      Swal.fire("Error", mensajeError, "error");
    }
  };

  useEffect(() => {
    const usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal) {
      dispatch(loginSuccess(JSON.parse(usuarioLocal)));
    } else {
      dispatch(logout());
    }
  }, []);

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
            <p className="text-center text-gray-500 mb-4">
              No hay fotografía cargada
            </p>
          )}

          <input
            type="text"
            value={usuarioID}
            onChange={(e) => setusuarioID(e.target.value)}
            placeholder="Ingrese el correo del usuario"
            className="border px-3 py-2 rounded w-full mb-4"
          />

          <input
            type="file"
            id="fileUpload"
            accept="image/*"
            onChange={handleSleccionarFoto}
            ref={fileInputRef}
            className="hidden"
          />
          <label
            htmlFor="fileUpload"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer block text-center mb-4"
          >
            Seleccionar Fotografía
          </label>

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
