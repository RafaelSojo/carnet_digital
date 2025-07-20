const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const EstadoUsuario = require('./EstadoUsuario');

const Usuario = sequelize.define('Usuario', {
  usuarioId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  usuario: { type: DataTypes.STRING, unique: true, allowNull: false },
  tipo_identificacion: { type: DataTypes.STRING, allowNull: false },
  identificacion: { type: DataTypes.STRING, allowNull: false },
  nombre_completo: { type: DataTypes.STRING, allowNull: false },
  contrasena: { type: DataTypes.STRING, allowNull: false }, // puedes cambiar a "password" si prefieres
  tipo_usuario: { type: DataTypes.STRING, allowNull: false },
  bloqueado: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
  intentos_fallidos: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
  estadoId: { type: DataTypes.INTEGER, allowNull: true },

  // Nueva columna para fotografía
  fotografia: { type: DataTypes.BLOB('long'), allowNull: true }

}, {
  tableName: 'usuarios',
  timestamps: false
});

// Relación con estados_usuario
Usuario.belongsTo(EstadoUsuario, {
  foreignKey: 'estadoId',
  as: 'estado'
});

module.exports = Usuario;
