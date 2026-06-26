/* MODELO DE IMPRESORAS PARA ALMACENAR Y GESTIONAR DATOS EN MONGODB */

const mongoose = require('mongoose');
const impresoraSchema = new mongoose.Schema({
  departamento: String,
  edificio: String,
  ubicacion: String,
  nombre: String,
  email: String,
  equipo: String,
  usuario: String,
  ip: String,
  codigo: String
}, { timestamps: true });

module.exports = mongoose.model('Impresora', impresoraSchema, 'datos');