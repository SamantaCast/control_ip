// Modelo de usuarios para la gestión de autenticación y roles en MongoDB.

const mongoose = require("mongoose");

// Define la estructura del documento de un usuario.

const userSchema = new mongoose.Schema(
  {
    // Nombre de usuario utilizado para iniciar sesión.
    usuario: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Nombre completo del usuario.
    nombre: {
      type: String,
      required: true,
      trim: true,
    },

    // Contraseña del usuario.
    password: {
      type: String,
      required: true,
    },

    // Rol asignado al usuario.
    rol: {
      type: String,
      default: "admin",
    },
  },
  {
    // Agrega automáticamente las fechas de creación y actualización.
    timestamps: true,
  }
);

// Exporta el modelo utilizando la colección "users".

module.exports = mongoose.model("User", userSchema, "users");