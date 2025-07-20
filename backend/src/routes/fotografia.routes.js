const express = require('express');
const router = express.Router();
const fotografiaController = require('../controllers/fotografia.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Obtener fotografía
router.get('/:usuario', authMiddleware.validateToken, fotografiaController.obtenerFotografia);

// Actualizar fotografía
router.put('/:usuario', authMiddleware.validateToken, fotografiaController.actualizarFotografia);

// Eliminar fotografía
router.delete('/:usuario', authMiddleware.validateToken, fotografiaController.eliminarFotografia);

module.exports = router;
