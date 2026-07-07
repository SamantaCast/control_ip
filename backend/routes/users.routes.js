// Rutas para la gestión de administradores.

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");

// Valida que la contraseña cumpla con los requisitos de seguridad.

function passwordValida(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;
  return regex.test(password);
}

// Compara la contraseña ingresada con la almacenada.

async function compararPassword(entrada, guardada) {
  // Verifica que exista una contraseña almacenada.
  if (!guardada) return false;

  // Compara utilizando bcrypt si la contraseña está cifrada.
  if (guardada.startsWith("$2a$") || guardada.startsWith("$2b$")) {
    return bcrypt.compare(entrada, guardada);
  }

  // Compara directamente si la contraseña no está cifrada.
  return entrada === guardada;
}

// Obtiene la lista de administradores registrados.

router.get("/", async (req, res) => {
  try {
    const usuarios = await User.find({ rol: "admin" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(usuarios);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener administradores",
    });
  }
});

// Crea un nuevo administrador.

router.post("/", async (req, res) => {
  try {
    console.log("DATOS RECIBIDOS POST:", req.body);

    const {
      nombre,
      usuario,
      password,
      repetirPassword,
      rol,
    } = req.body;

    // Verifica que todos los campos requeridos estén completos.
    if (!nombre || !usuario || !password || !repetirPassword) {
      return res.status(400).json({
        mensaje: "Completa todos los campos",
      });
    }

    // Verifica que ambas contraseñas coincidan.
    if (password !== repetirPassword) {
      return res.status(400).json({
        mensaje: "Las contraseñas no coinciden",
      });
    }

    // Valida la seguridad de la contraseña.
    if (!passwordValida(password)) {
      return res.status(400).json({
        mensaje:
          "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un símbolo",
      });
    }

    // Verifica que el usuario no exista.
    const existe = await User.findOne({
      usuario: usuario.trim(),
    });

    if (existe) {
      return res.status(400).json({
        mensaje: "Usuario no disponible",
      });
    }

    // Cifra la contraseña antes de almacenarla.
    const hash = await bcrypt.hash(password, 10);

    // Crea el nuevo administrador.
    const nuevo = new User({
      nombre: nombre.trim(),
      usuario: usuario.trim(),
      password: hash,
      rol: rol || "admin",
    });

    await nuevo.save();

    res.json({
      mensaje: "Administrador creado correctamente",
    });
  } catch (error) {
    console.log("ERROR AL CREAR ADMIN:", error);

    res.status(500).json({
      mensaje: "Error al crear administrador",
    });
  }
});

// Actualiza la información de un administrador.

router.put("/:id", async (req, res) => {
  try {
    console.log("DATOS RECIBIDOS PUT:", req.body);

    const {
      nombre,
      usuario,
      passwordActual,
      password,
      repetirPassword,
      rol,
    } = req.body;

    // Busca el administrador por su identificador.
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        mensaje: "Administrador no encontrado",
      });
    }

    // Verifica que todos los campos requeridos estén completos.
    if (
      !nombre ||
      !usuario ||
      !passwordActual ||
      !password ||
      !repetirPassword
    ) {
      return res.status(400).json({
        mensaje:
          "Debes escribir nombre, usuario, contraseña anterior y la nueva dos veces",
      });
    }

    // Verifica que el nombre de usuario no esté en uso.
    const usuarioRepetido = await User.findOne({
      usuario: usuario.trim(),
      _id: { $ne: req.params.id },
    });

    if (usuarioRepetido) {
      return res.status(400).json({
        mensaje: "Usuario no disponible",
      });
    }

    // Comprueba que la contraseña actual sea correcta.
    const coincideActual = await compararPassword(
      passwordActual,
      user.password
    );

    if (!coincideActual) {
      return res.status(401).json({
        mensaje: "La contraseña anterior es incorrecta",
      });
    }

    // Verifica que las nuevas contraseñas coincidan.
    if (password !== repetirPassword) {
      return res.status(400).json({
        mensaje: "Las contraseñas nuevas no coinciden",
      });
    }

    // Valida la nueva contraseña.
    if (!passwordValida(password)) {
      return res.status(400).json({
        mensaje:
          "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un símbolo",
      });
    }

    // Actualiza la información del administrador.
    user.nombre = nombre.trim();
    user.usuario = usuario.trim();
    user.rol = rol || "admin";
    user.password = await bcrypt.hash(password, 10);

    await user.save();

    res.json({
      mensaje: "Administrador actualizado correctamente",
    });
  } catch (error) {
    console.log("ERROR AL ACTUALIZAR ADMIN:", error);

    res.status(500).json({
      mensaje: "Error al actualizar administrador",
    });
  }
});

// Elimina un administrador.

router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.json({
      mensaje: "Administrador eliminado correctamente",
    });
  } catch (error) {
    console.log("ERROR AL ELIMINAR ADMIN:", error);

    res.status(500).json({
      mensaje: "Error al eliminar administrador",
    });
  }
});

// Exporta las rutas de administradores.

module.exports = router;