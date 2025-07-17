const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');
const EstadoUsuario = require('../models/EstadoUsuario');
const Bitacora = require('../models/Bitacora'); // Importa el modelo

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

    const estadoAnterior = usuario.estadoId;

    usuario.estadoId = estadoId;
    await usuario.save();

    await Bitacora.create({
      usuario: req.usuarioId,
      accion: 'UPDATE',
      descripcion: {
        antes: { usuarioId: usuario.usuarioId, estadoId: estadoAnterior },
        despues: { usuarioId: usuario.usuarioId, estadoId: estadoId }
      }
    });

    return res.status(200).json({ mensaje: 'Estado actualizado correctamente' });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    await registrarErrorEnBitacora(req.usuarioId, error.message);
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

    await Bitacora.create({
      usuario: req.usuarioId,
      accion: 'CONSULTA',
      descripcion: { mensaje: 'El usuario consulta la lista de usuarios' }
    });

    return res.json(resultado);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    await registrarErrorEnBitacora(req.usuarioId, error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findOne({
      where: { usuarioId: id },
      include: {
        model: EstadoUsuario,
        as: 'estado',
        attributes: ['estadoId', 'codigo', 'descripcion'],
      },
      attributes: ['usuarioId', 'nombre_completo', 'usuario', 'estadoId']
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const resultado = {
      id: usuario.usuarioId,
      nombre_completo: usuario.nombre_completo,
      email: usuario.usuario,
      estado_id: usuario.estadoId,
      estado_nombre: usuario.estado?.descripcion || 'Desconocido',
    };

    await Bitacora.create({
      usuario: req.usuarioId,
      accion: 'CONSULTA',
      descripcion: { mensaje: `El usuario consulta el usuario con ID ${id}` }
    });

    return res.json(resultado);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    await registrarErrorEnBitacora(req.usuarioId, error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Función auxiliar para registrar errores
const registrarErrorEnBitacora = async (usuarioId, mensaje) => {
  try {
    await Bitacora.create({
      usuario: usuarioId || 'Sistema',
      accion: 'ERROR',
      descripcion: { error: mensaje }
    });
  } catch (err) {
    console.error('Error al registrar en bitácora:', err);
  }
};
