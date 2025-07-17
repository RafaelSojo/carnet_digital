const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ajusta a tu conexión Sequelize

const Bitacora = sequelize.define('Bitacora', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  usuario: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  accion: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.JSON,
    allowNull: false
  }
}, {
  tableName: 'bitacora',
  timestamps: false
});

module.exports = Bitacora;
