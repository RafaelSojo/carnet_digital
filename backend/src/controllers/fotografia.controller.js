const Usuario = require("../models/Usuario");
const Bitacora = require("../models/Bitacora");
const sharp = require("sharp");

exports.actualizarFotografia = async (req, res) => {
  const usuarioID = req.params.usuario;
  const { imagenBase64 } = req.body;

  if (!imagenBase64 || typeof imagenBase64 !== "string") {
    return res
      .status(400)
      .json({ mensaje: "Falta imagen en base64 o no es válida" });
  }

  try {
    const buffer = Buffer.from(imagenBase64, "base64");

    if (buffer.length > 1_000_000) {
      return res.status(400).json({ mensaje: "Imagen mayor a 1MB" });
    }

    const meta = await sharp(buffer).metadata();
    if (Math.abs(meta.width / meta.height - 4 / 3) > 0.01) {
      return res.status(400).json({ mensaje: "Ratio debe ser 4:3" });
    }

    const usuario = await Usuario.findOne({ where: { usuario: usuarioID } });
    if (!usuario) {
      return res
        .status(404)
        .json({ mensaje: `No existe usuario ${usuarioID}` });
    }
    usuario.fotografia = imagenBase64;
    await usuario.save();

    await Bitacora.create({
      usuario: req.usuarioId,
      accion: "UPDATE",
      descripcion: {
        mensaje: `Foto actualizada para el usuario ${usuarioID}`,
      },
    });

    return res.status(204).send();
  } catch (err) {
    console.error("Error al actualizar la foto:", err);
    await registrarErrorEnBitacora(req.usuarioId, err.message);
    return res
      .status(500)
      .json({ mensaje: "Error al actualizar", error: err.message });
  }
};

exports.obtenerFotografia = async (req, res) => {
  const usuarioID = req.params.usuario;

  try {
    const usuario = await Usuario.findOne({ where: { usuario: usuarioID } });
    if (!usuario) {
      return res.status(404).json({ mensaje: `No existe el Usuario ${usuarioID}` });
    }
    if (!usuario.fotografia) {
      return res
        .status(404)
        .json({ mensaje: `No existe fotografia para el Usuario ${usuarioID}` });
    }

    const imagenConFormato = `data:image/jpeg;base64,${usuario.fotografia}`;

    await Bitacora.create({
      usuario: req.usuarioId,
      accion: "CONSULTA",
      descripcion: {
        mensaje: `Consulta de fotografía del usuario ${usuarioID}`,
      },
    });

    return res.json({ fotografia: imagenConFormato });
  } catch (err) {
    console.error("Error en getPhoto:", err);
    await registrarErrorEnBitacora(req.usuarioId, err.message);
    return res
      .status(500)
      .json({ mensaje: "Error al obtener foto", error: err.message });
  }
};

exports.eliminarFotografia = async (req, res) => {
  const usuarioID = req.params.usuario;

  try {
    const usuario = await Usuario.findOne({ where: { usuario: usuarioID } });

    if (!usuario || !usuario.fotografia) {
      return res
        .status(404)
        .json({ mensaje: "No hay fotografía que eliminar" });
    }

    usuario.fotografia = null;
    await usuario.save();

    await Bitacora.create({
      usuario: req.usuarioId,
      accion: "DELETE",
      descripcion: {
        mensaje: `Fotografía eliminada para el usuario ${usuarioID}`,
      },
    });

    return res.status(204).send();
  } catch (err) {
    console.error("Error en eliminar Fotografia:", err);
    await registrarErrorEnBitacora(req.usuarioId, err.message);
    return res
      .status(500)
      .json({ mensaje: "Error al eliminar foto", error: err.message });
  }
};

const registrarErrorEnBitacora = async (usuarioId, mensaje) => {
  try {
    await Bitacora.create({
      usuario: usuarioId || "Sistema",
      accion: "ERROR",
      descripcion: { error: mensaje },
    });
  } catch (err) {
    console.error("Error al registrar en bitácora:", err);
  }
};
