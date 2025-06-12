const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const authMiddleware = require('../middlewares/auth.middleware');


/**
 * @swagger
 * /usuarios/estado:
 *   patch:
 *     summary: Cambiar el estado de un usuario
 *     tags: [Usuario]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuarioId
 *               - estadoId
 *             properties:
 *               usuarioId:
 *                 type: integer
 *               estadoId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Usuario o estado no encontrado
 */
router.patch('/estado', authMiddleware.validateToken, usuarioController.cambiarEstado);



module.exports = router;
