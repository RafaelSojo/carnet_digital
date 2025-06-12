const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login.controller');

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Login / Token]
 *     parameters:
 *       - in: header
 *         name: usuario
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de usuario
 *       - in: header
 *         name: contrasena
 *         required: true
 *         schema:
 *           type: string
 *         description: Contraseña del usuario
 *       - in: header
 *         name: tipousuario
 *         required: true
 *         schema:
 *           type: string
 *         description: Tipo de usuario
 *     responses:
 *       201:
 *         description: Login exitoso, devuelve tokens de acceso y refresh
 *       400:
 *         description: Datos incompletos
 *       401:
 *         description: Usuario y/o contraseña incorrectos
 *       500:
 *         description: Error en el servidor
 */
router.post('/login', loginController.login);


/**
 * @swagger
 * /refresh:
 *   post:
 *     summary: Refrescar token
 *     tags: [Login / Token]
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
 *         description:
 *       401:
 *         description: No autorizado
 */
router.post('/refresh', loginController.refresh);

/**
 * @swagger
 * /validate:
 *   post:
 *     summary: Validar access token
 *     tags: [Login / Token]
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
 *         description: true
 *       401:
 *         description: Unauthorized
 */
router.post('/validate', loginController.validate);

module.exports = router;
