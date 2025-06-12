const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EstadoUsuario = sequelize.define('EstadoUsuario', {
  estadoId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  codigo: { type: DataTypes.STRING, allowNull: false, unique: true },
  descripcion: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'estados_usuario',
  timestamps: false
});

module.exports = EstadoUsuario;