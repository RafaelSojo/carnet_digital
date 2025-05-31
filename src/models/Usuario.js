const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo_usuario: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'usuarios',
  timestamps: false,
});

module.exports = Usuario;
