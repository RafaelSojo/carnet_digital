const TipoUsuario = require('../models/TiposUsuario');
const Bitacora = require('../models/Bitacora');
const { Op } = require('sequelize');

// GET /tipousuario
exports.obtenerTiposUsuario = async (req, res) => {
  try {
    const tipos = await TipoUsuario.findAll({
      attributes: ['id', 'nombre'],
      order: [['nombre', 'ASC']]
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

// GET /tipousuario/:id
exports.obtenerTipoUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.toString().trim() === '') {
      return res.status(400).json({ error: 'El ID es requerido y no puede estar vacío' });
    }

    const tipo = await TipoUsuario.findByPk(id, {
      attributes: ['id', 'nombre']
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

// POST /tipousuario
exports.crearTipoUsuario = async (req, res) => {
  const { id, nombre } = req.body;

  if (!id || id.toString().trim() === '') {
    return res.status(400).json({ error: 'El ID es requerido y no puede estar vacío' });
  }

  if (!nombre || nombre.toString().trim() === '') {
    return res.status(400).json({ error: 'El nombre es requerido y no puede estar vacío' });
  }

  try {
    const existenteId = await TipoUsuario.findOne({ where: { id: id.toString().trim() } });
    if (existenteId) {
      return res.status(400).json({ error: 'Ya existe un tipo de usuario con ese ID' });
    }

    const existenteNombre = await TipoUsuario.findOne({ where: { nombre: nombre.trim() } });
    if (existenteNombre) {
      return res.status(400).json({ error: 'Ya existe un tipo de usuario con ese nombre' });
    }

    const nuevoTipo = await TipoUsuario.create({
      id: id.toString().trim(),
      nombre: nombre.trim()
    });

    await Bitacora.create({
      usuario: req.usuarioId,
      accion: 'CREATE',
      descripcion: {
        mensaje: 'El usuario creó un nuevo tipo de usuario',
        datos: { id: nuevoTipo.id, nombre: nuevoTipo.nombre }
      }
    });

    return res.status(201).json(nuevoTipo);
  } catch (error) {
    console.error('Error al crear tipo de usuario:', error);
    await registrarErrorEnBitacora(req.usuarioId, error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// PUT /tipousuario/:id
exports.actualizarTipoUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  if (!id || id.toString().trim() === '') {
    return res.status(400).json({ error: 'El ID es requerido y no puede estar vacío' });
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
        nombre: nombre.trim(),
        id: { [Op.ne]: id }
      }
    });

    if (existente) {
      return res.status(400).json({ error: 'Ya existe un tipo de usuario con ese nombre' });
    }

    const nombreAnterior = tipo.nombre;

    tipo.nombre = nombre.trim();
    await tipo.save();

    await Bitacora.create({
      usuario: req.usuarioId,
      accion: 'UPDATE',
      descripcion: {
        antes: { id: tipo.id, nombre: nombreAnterior },
        despues: { id: tipo.id, nombre: tipo.nombre }
      }
    });

    return res.status(200).json({ mensaje: 'Tipo de usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar tipo de usuario:', error);
    await registrarErrorEnBitacora(req.usuarioId, error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// DELETE /tipousuario/:id
exports.eliminarTipoUsuario = async (req, res) => {
  const { id } = req.params;

  if (!id || id.toString().trim() === '') {
    return res.status(400).json({ error: 'El ID es requerido y no puede estar vacío' });
  }

  try {
    const tipo = await TipoUsuario.findByPk(id);
    if (!tipo) {
      return res.status(404).json({ error: `No existe tipo de usuario con ID ${id}` });
    }

    const tipoEliminado = { id: tipo.id, nombre: tipo.nombre };

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
