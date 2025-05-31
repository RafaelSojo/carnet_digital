const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login.controller');

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               tipoUsuario:
 *                 type: string
 *     responses:
 *       201:
 *         description: Token generado exitosamente
 *       401:
 *         description: Usuario y/o contraseña incorrectos
 */
router.post('/', loginController.login);

/**
 * @swagger
 * /login/refresh:
 *   post:
 *     summary: Refrescar token
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refresh_token:
 *                 type: string
 *     responses:
 *       201:
 *         description: Nuevo token generado
 *       401:
 *         description: No autorizado
 */
router.post('/refresh', loginController.refresh);

/**
 * @swagger
 * /login/validate:
 *   post:
 *     summary: Validar access token
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token válido
 *       401:
 *         description: Token inválido
 */
router.post('/validate', loginController.validate);

module.exports = router;
