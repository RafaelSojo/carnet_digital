const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');
const EstadoUsuario = require('../models/EstadoUsuario');


exports.cambiarEstado = async (req, res) => {
  const { usuarioId, estadoId } = req.body;

  if (!usuarioId || !estadoId || usuarioId.toString().trim() === '' || estadoId.toString().trim() === '') {
    return res.status(400).json({ message: 'usuarioId y estadoId son requeridos y no pueden estar vacíos' });
  }

  try {
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    const estado = await EstadoUsuario.findByPk(estadoId);
    if (!estado) return res.status(404).json({ message: 'Estado no encontrado' });

    usuario.estadoId = estadoId;
    await usuario.save();

    return res.status(200).json({ message: 'Estado actualizado correctamente' });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};
