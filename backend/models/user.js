const mongoose = require('mongoose');

// ESQUEMA DE USUARIOS

const userSchema = new mongoose.Schema({

  // USUARIO LOGIN
  usuario: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  // CONTRASEÑA
  password: {
    type: String,
    required: true
  },

  // ROL DEL USUARIO
  rol: {
    type: String,
    default: 'admin'
  }

}, {
  timestamps: true
});

// EXPORTAR MODELO

module.exports = mongoose.model(
  'User',
  userSchema,
  'users'
);