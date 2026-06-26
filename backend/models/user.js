/* MODELO DE USUARIOS PARA GESTIÓN DE AUTENTICACIÓN Y ROLES EN MONGODB */

const mongoose = require('mongoose');

// ESQUEMA DE USUARIOS

const userSchema = new mongoose.Schema({

  usuario: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  nombre: {
    type: String,
    required: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

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