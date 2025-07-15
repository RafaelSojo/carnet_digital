const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');
const EstadoUsuario = require('../models/EstadoUsuario');


exports.cambiarEstado = async (req, res) => {
  const { usuarioId, estadoId } = req.body;

  if (!usuarioId || !estadoId || usuarioId.toString().trim() === '' || estadoId.toString().trim() === '') {
    return res.status(400).json({ error: 'Todos los datos son requeridos y no pueden ser vacíos ni espacios en blanco' });
  }

  try {
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    const estado = await EstadoUsuario.findByPk(estadoId);
    if (!estado) return res.status(404).json({ error: 'Estado no encontrado' });

    usuario.estadoId = estadoId;
    await usuario.save();

    return res.status(200).json({ mensaje: 'Estado actualizado correctamente' });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      include: {
        model: EstadoUsuario,
        as: 'estado',
        attributes: ['estadoId', 'codigo', 'descripcion'],
      },
      attributes: ['usuarioId', 'nombre_completo', 'usuario', 'estadoId']
    });

    const resultado = usuarios.map((u) => ({
      id: u.usuarioId,
      nombre_completo: u.nombre_completo,
      email: u.usuario,
      estado_id: u.estadoId,
      estado_nombre: u.estado?.descripcion || 'Desconocido',
    }));

    return res.json(resultado);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};