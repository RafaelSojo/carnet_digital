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

  // 👉 Agregamos el estado
  estadoId: { type: DataTypes.INTEGER, allowNull: true }
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
