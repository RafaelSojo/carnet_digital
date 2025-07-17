const TipoIdentificacion = require('../models/TiposIdentificacion');
const Bitacora = require('../models/Bitacora');
const { Op } = require('sequelize');

// GET /tipoidentificacion
exports.obtenerTiposIdentificacion = async (req, res) => {
  try {
    const tipos = await TipoIdentificacion.findAll({
      attributes: ['id', 'Descripcion'],
      order: [['Descripcion', 'ASC']]
    });

    await Bitacora.create({
      usuario: req.usuarioId,
      accion: 'CONSULTA',
      descripcion: { mensaje: 'El usuario consulta la lista de tipos de identificación' }
    });

    return res.json(tipos);
  } catch (error) {
    console.error('Error al obtener tipos de identificación:', error);
    await registrarErrorEnBitacora(req.usuarioId, error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// GET /tipoidentificacion/:id
exports.obtenerTipoIdentificacionPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.toString().trim() === '') {
      return res.status(400).json({ error: 'El ID es requerido y no puede estar vacío' });
    }

    const tipo = await TipoIdentificacion.findByPk(id, {
      attributes: ['id', 'Descripcion']
    });

    if (!tipo) {
      return res.status(404).json({ error: `No existe tipo de identificación con ID ${id}` });
    }

    await Bitacora.create({
      usuario: req.usuarioId,
      accion: 'CONSULTA',
      descripcion: { mensaje: `El usuario consulta el tipo de identificación con ID ${id}` }
    });

    return res.json(tipo);
  } catch (error) {
    console.error('Error al obtener tipo de identificación:', error);
    await registrarErrorEnBitacora(req.usuarioId, error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// POST /tipoidentificacion
exports.crearTipoIdentificacion = async (req, res) => {
  const { id, Descripcion } = req.body;

  if (!id || id.toString().trim() === '') {
    return res.status(400).json({ error: 'El ID es requerido y no puede estar vacío' });
  }

  if (!Descripcion || Descripcion.toString().trim() === '') {
    return res.status(400).json({ error: 'La descripción es requerida y no puede estar vacía' });
  }

  try {
    // Verificar si ya existe por id
    const existenteId = await TipoIdentificacion.findOne({
      where: { id: id.toString().trim() }
    });
    if (existenteId) {
      return res.status(400).json({ error: 'Ya existe un tipo de identificación con ese ID' });
    }

    // Verificar si ya existe por descripción
    const existenteDescripcion = await TipoIdentificacion.findOne({
      where: { Descripcion: Descripcion.trim() }
    });
    if (existenteDescripcion) {
      return res.status(400).json({ error: 'Ya existe un tipo de identificación con esa descripción' });
    }

    const nuevoTipo = await TipoIdentificacion.create({
      id: id.toString().trim(),
      Descripcion: Descripcion.trim()
    });

    await Bitacora.create({
      usuario: req.usuarioId,
      accion: 'CREATE',
      descripcion: { 
        mensaje: 'El usuario creó un nuevo tipo de identificación',
        datos: { id: nuevoTipo.id, Descripcion: nuevoTipo.Descripcion }
      }
    });

    return res.status(201).json(nuevoTipo);
  } catch (error) {
    console.error('Error al crear tipo de identificación:', error);
    await registrarErrorEnBitacora(req.usuarioId, error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// PUT /tipoidentificacion/:id
exports.actualizarTipoIdentificacion = async (req, res) => {
  const { id } = req.params;
  const { Descripcion } = req.body;

  if (!id || id.toString().trim() === '') {
    return res.status(400).json({ error: 'El ID es requerido y no puede estar vacío' });
  }

  if (!Descripcion || Descripcion.toString().trim() === '') {
    return res.status(400).json({ error: 'La descripción es requerida y no puede estar vacía' });
  }

  try {
    const tipo = await TipoIdentificacion.findByPk(id);
    if (!tipo) {
      return res.status(404).json({ error: `No existe tipo de identificación con ID ${id}` });
    }

    // Verificar si ya existe otro con la misma descripción
    const existente = await TipoIdentificacion.findOne({
      where: { 
        Descripcion: Descripcion.trim(),
        id: { [Op.ne]: id }
      }
    });

    if (existente) {
      return res.status(400).json({ error: 'Ya existe un tipo de identificación con esa descripción' });
    }

    const descripcionAnterior = tipo.Descripcion;
    
    tipo.Descripcion = Descripcion.trim();
    await tipo.save();

    await Bitacora.create({
      usuario: req.usuarioId,
      accion: 'UPDATE',
      descripcion: {
        antes: { id: tipo.id, Descripcion: descripcionAnterior },
        despues: { id: tipo.id, Descripcion: tipo.Descripcion }
      }
    });

    return res.status(200).json({ mensaje: 'Tipo de identificación actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar tipo de identificación:', error);
    await registrarErrorEnBitacora(req.usuarioId, error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// DELETE /tipoidentificacion/:id
exports.eliminarTipoIdentificacion = async (req, res) => {
  const { id } = req.params;

  if (!id || id.toString().trim() === '') {
    return res.status(400).json({ error: 'El ID es requerido y no puede estar vacío' });
  }

  try {
    const tipo = await TipoIdentificacion.findByPk(id);
    if (!tipo) {
      return res.status(404).json({ error: `No existe tipo de identificación con ID ${id}` });
    }

    const tipoEliminado = { id: tipo.id, Descripcion: tipo.Descripcion };
    
    await tipo.destroy();

    await Bitacora.create({
      usuario: req.usuarioId,
      accion: 'DELETE',
      descripcion: {
        mensaje: 'El usuario eliminó un tipo de identificación',
        datos: tipoEliminado
      }
    });

    return res.status(200).json({ mensaje: 'Tipo de identificación eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar tipo de identificación:', error);
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
