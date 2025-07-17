const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TiposIdentificacion = sequelize.define('TiposIdentificacion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  Descripcion: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'La descripción no puede estar vacía'
      },
      len: {
        args: [1, 100],
        msg: 'La descripción debe tener entre 1 y 100 caracteres'
      }
    }
  }
}, {
  tableName: 'TiposIdentificacion',
  timestamps: false
});

module.exports = TiposIdentificacion;