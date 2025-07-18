const TipoUsuario = require('../models/TiposUsuario');
const Bitacora = require('../models/Bitacora');
const { Op } = require('sequelize');

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

// GET /tiposusuario
exports.obtenerTiposUsuario = async (req, res) => {
  try {
    const tipos = await TipoUsuario.findAll({
      attributes: ['id', 'Nombre'],
      order: [['Nombre', 'ASC']]
    });

    await Bitacora.create({
      usuario: req.usuarioId,
      accion: 'CONSULTA',
      descripcion: { mensaje: 'El usuario consulta la lista de tipos de usuario' }
    });

    return res.json(tipos);
  } catch (error) {
    console.error('Error al obtener tipos de usuario:', error);
    await registrarErrorEnBitacora(req.usuarioId, error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// GET /tiposusuario/:id
exports.obtenerTipoUsuarioPorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id || isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'El ID es requerido y debe ser un número positivo' });
    }

    const tipo = await TipoUsuario.findByPk(id, {
      attributes: ['id', 'Nombre']
    });

    if (!tipo) {
      return res.status(404).json({ error: `No existe tipo de usuario con ID ${id}` });
    }

    await Bitacora.create({
      usuario: req.usuarioId,
      accion: 'CONSULTA',
      descripcion: { mensaje: `El usuario consulta el tipo de usuario con ID ${id}` }
    });

    return res.json(tipo);
  } catch (error) {
    console.error('Error al obtener tipo de usuario:', error);
    await registrarErrorEnBitacora(req.usuarioId, error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// POST /tiposusuario
exports.crearTipoUsuario = async (req, res) => {
  const { id, nombre } = req.body;

  if (!id || isNaN(id) || parseInt(id, 10) <= 0) {
    return res.status(400).json({ error: 'El ID es requerido, debe ser un número entero positivo' });
  }

  if (!nombre || nombre.toString().trim() === '') {
    return res.status(400).json({ error: 'El nombre es requerido y no puede estar vacío' });
  }

  try {
    const existenteId = await TipoUsuario.findByPk(parseInt(id, 10));
    if (existenteId) {
      return res.status(400).json({ error: 'Ya existe un tipo de usuario con ese ID' });
    }

    const existenteNombre = await TipoUsuario.findOne({ where: { Nombre: nombre.trim() } });
    if (existenteNombre) {
      return res.status(400).json({ error: 'Ya existe un tipo de usuario con ese nombre' });
    }

    const nuevoTipo = await TipoUsuario.create({
      id: parseInt(id, 10),
      Nombre: nombre.trim()
    });

    await Bitacora.create({
      usuario: req.usuarioId,
      accion: 'CREATE',
      descripcion: {
        mensaje: 'El usuario creó un nuevo tipo de usuario',
        datos: { id: nuevoTipo.id, nombre: nuevoTipo.Nombre }
      }
    });

    return res.status(201).json(nuevoTipo);
  } catch (error) {
    console.error('Error al crear tipo de usuario:', error);
    await registrarErrorEnBitacora(req.usuarioId, error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// PUT /tiposusuario/:id
exports.actualizarTipoUsuario = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { nombre } = req.body;

  if (!id || isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'El ID es requerido y debe ser un número positivo' });
  }

  if (!nombre || nombre.toString().trim() === '') {
    return res.status(400).json({ error: 'El nombre es requerido y no puede estar vacío' });
  }

  try {
    const tipo = await TipoUsuario.findByPk(id);
    if (!tipo) {
      return res.status(404).json({ error: `No existe tipo de usuario con ID ${id}` });
    }

    const existente = await TipoUsuario.findOne({
      where: {
        Nombre: nombre.trim(),
        id: { [Op.ne]: id }
      }
    });

    if (existente) {
      return res.status(400).json({ error: 'Ya existe un tipo de usuario con ese nombre' });
    }

    const nombreAnterior = tipo.Nombre;

    tipo.Nombre = nombre.trim();
    await tipo.save();

    await Bitacora.create({
      usuario: req.usuarioId,
      accion: 'UPDATE',
      descripcion: {
        antes: { id: tipo.id, nombre: nombreAnterior },
        despues: { id: tipo.id, nombre: tipo.Nombre }
      }
    });

    return res.status(200).json({ mensaje: 'Tipo de usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar tipo de usuario:', error);
    await registrarErrorEnBitacora(req.usuarioId, error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// DELETE /tiposusuario/:id
exports.eliminarTipoUsuario = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (!id || isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'El ID es requerido y debe ser un número positivo' });
  }

  try {
    const tipo = await TipoUsuario.findByPk(id);
    if (!tipo) {
      return res.status(404).json({ error: `No existe tipo de usuario con ID ${id}` });
    }

    const tipoEliminado = { id: tipo.id, nombre: tipo.Nombre };

    await tipo.destroy();

    await Bitacora.create({
      usuario: req.usuarioId,
      accion: 'DELETE',
      descripcion: {
        mensaje: 'El usuario eliminó un tipo de usuario',
        datos: tipoEliminado
      }
    });

    return res.status(200).json({ mensaje: 'Tipo de usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar tipo de usuario:', error);
    await registrarErrorEnBitacora(req.usuarioId, error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
