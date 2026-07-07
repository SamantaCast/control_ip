// Conexión a la base de datos MongoDB.

const mongoose = require("mongoose");

// Función para conectar con la base de datos.

const conectarDB = async () => {
  try {
    // Establece la conexión utilizando la URI
    // definida en las variables de entorno.
    await mongoose.connect(process.env.MONGODB_URI);

    // Muestra un mensaje cuando la conexión es exitosa.
    console.log("MongoDB conectado");
  } catch (error) {
    // Muestra el error si ocurre un problema
    // durante la conexión.
    console.log(error);
  }
};

// Exporta la función de conexión.

module.exports = conectarDB;