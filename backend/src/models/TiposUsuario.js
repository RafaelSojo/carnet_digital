const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TiposUsuario = sequelize.define('TiposUsuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  Nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'El nombre no puede estar vacío'
      },
      len: {
        args: [1, 100],
        msg: 'El nombre debe tener entre 1 y 100 caracteres'
      }
    }
  }
}, {
  tableName: 'TiposUsuario',
  timestamps: false
});

module.exports = TiposUsuario;