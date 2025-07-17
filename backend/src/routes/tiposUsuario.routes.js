const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const ctrl = require("../controllers/tiposUsuario.controller");

// Proteger todas las rutas con autenticación
router.use(authMiddleware.validateToken);

/**
 * @swagger
 * /tiposusuario:
 *   get:
 *     summary: Obtener todos los tipos de usuario
 *     tags: [TiposUsuario]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tipos de usuario
 */
router.get("/", ctrl.obtenerTiposUsuario);

/**
 * @swagger
 * /tiposusuario/{id}:
 *   get:
 *     summary: Obtener un tipo de usuario por ID
 *     tags: [TiposUsuario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tipo de usuario encontrado
 *       404:
 *         description: Tipo de usuario no encontrado
 */
router.get("/:id", ctrl.obtenerTipoUsuarioPorId);

/**
 * @swagger
 * /tiposusuario:
 *   post:
 *     summary: Crear un nuevo tipo de usuario
 *     tags: [TiposUsuario]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - nombre
 *             properties:
 *               id:
 *                 type: string
 *                 example: "ADM"
 *               nombre:
 *                 type: string
 *                 example: "Administrador"
 *     responses:
 *       201:
 *         description: Tipo de usuario creado exitosamente
 *       400:
 *         description: Datos inválidos o duplicados
 */
router.post("/", ctrl.crearTipoUsuario);

/**
 * @swagger
 * /tiposusuario/{id}:
 *   put:
 *     summary: Actualizar un tipo de usuario
 *     tags: [TiposUsuario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Usuario Estandar"
 *     responses:
 *       200:
 *         description: Tipo de usuario actualizado correctamente
 *       404:
 *         description: Tipo de usuario no encontrado
 *       400:
 *         description: Datos inválidos o duplicados
 */
router.put("/:id", ctrl.actualizarTipoUsuario);

/**
 * @swagger
 * /tiposusuario/{id}:
 *   delete:
 *     summary: Eliminar un tipo de usuario
 *     tags: [TiposUsuario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tipo de usuario eliminado correctamente
 *       404:
 *         description: Tipo de usuario no encontrado
 */
router.delete("/:id", ctrl.eliminarTipoUsuario);

module.exports = router;
