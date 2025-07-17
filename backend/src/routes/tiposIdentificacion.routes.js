const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const ctrl = require("../controllers/tiposIdentificacion.controller");

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware.validateToken);

/**
 * @swagger
 * /tiposidentificacion:
 *   get:
 *     summary: Obtener todos los tipos de identificación
 *     tags: [TiposIdentificacion]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tipos de identificación
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   Descripcion:
 *                     type: string
 */
router.get("/", ctrl.obtenerTiposIdentificacion);

/**
 * @swagger
 * /tiposidentificacion/{id}:
 *   get:
 *     summary: Obtener un tipo de identificación por ID
 *     tags: [TiposIdentificacion]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tipo de identificación encontrado
 *       404:
 *         description: Tipo de identificación no encontrado
 */
router.get("/:id", ctrl.obtenerTipoIdentificacionPorId);

/**
 * @swagger
 * /tiposidentificacion:
 *   post:
 *     summary: Crear un nuevo tipo de identificación
 *     tags: [TiposIdentificacion]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Descripcion
 *             properties:
 *               Descripcion:
 *                 type: string
 *                 example: "Licencia de Conducir"
 *     responses:
 *       201:
 *         description: Tipo de identificación creado exitosamente
 *       400:
 *         description: Datos inválidos o descripción duplicada
 */
router.post("/", ctrl.crearTipoIdentificacion);

/**
 * @swagger
 * /tiposidentificacion/{id}:
 *   put:
 *     summary: Actualizar un tipo de identificación
 *     tags: [TiposIdentificacion]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Descripcion
 *             properties:
 *               Descripcion:
 *                 type: string
 *                 example: "Cédula de Ciudadanía"
 *     responses:
 *       200:
 *         description: Tipo de identificación actualizado correctamente
 *       404:
 *         description: Tipo de identificación no encontrado
 *       400:
 *         description: Datos inválidos o descripción duplicada
 */
router.put("/:id", ctrl.actualizarTipoIdentificacion);

/**
 * @swagger
 * /tiposidentificacion/{id}:
 *   delete:
 *     summary: Eliminar un tipo de identificación
 *     tags: [TiposIdentificacion]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tipo de identificación eliminado correctamente
 *       404:
 *         description: Tipo de identificación no encontrado
 */
router.delete("/:id", ctrl.eliminarTipoIdentificacion);

module.exports = router;