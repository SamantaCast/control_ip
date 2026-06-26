/* RUTAS PARA GESTIÓN DE ADMINISTRADORES (USUARIOS) CON VALIDACIONES Y SEGURIDAD */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');


// VALIDAR CONTRASEÑA

function passwordValida(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;
  return regex.test(password);
}


// COMPARAR CONTRASEÑA

async function compararPassword(entrada, guardada) {
    if (!guardada) return false;
    if (guardada.startsWith('$2a$') || guardada.startsWith('$2b$')) {
      return bcrypt.compare(entrada, guardada);
    }

    return entrada === guardada;
  }


// OBTENER ADMINISTRADORES

router.get('/', async (req, res) => {
  try {
    const usuarios = await User.find({ rol: 'admin' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener administradores' });
  }
});


// CREAR ADMINISTRADOR

router.post('/', async (req, res) => {
  try {
    console.log('DATOS RECIBIDOS POST:', req.body);
  const {
    nombre,
    usuario,
    password,
    repetirPassword,
    rol
  } = req.body;

if (!nombre || !usuario || !password || !repetirPassword) {
  return res.status(400).json({
    mensaje: "Completa todos los campos"
  });
}

if (password !== repetirPassword) {
  return res.status(400).json({ mensaje: 'Las contraseñas no coinciden' });
    
  }

    if (!passwordValida(password)) {
      return res.status(400).json({
        mensaje: 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un símbolo'
      });
    }

    const existe = await User.findOne({ usuario: usuario.trim() });

    if (existe) {
      return res.status(400).json({ mensaje: 'Usuario no disponible' });
    }

    const hash = await bcrypt.hash(password, 10);

    const nuevo = new User({
     nombre: nombre.trim(),
     usuario: usuario.trim(),
     password: hash,
     rol: rol || "admin"
});

    await nuevo.save();

    res.json({ mensaje: 'Administrador creado correctamente' });
  } catch (error) {
    console.log('ERROR AL CREAR ADMIN:', error);
    res.status(500).json({ mensaje: 'Error al crear administrador' });
  }
});

// EDITAR ADMINISTRADOR

router.put('/:id', async (req, res) => {
  try {
    console.log('DATOS RECIBIDOS PUT:', req.body);

  const {
  nombre,
  usuario,
  passwordActual,
  password,
  repetirPassword,
  rol
} = req.body;

  const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ mensaje: 'Administrador no encontrado' });
    }

    if (
  !nombre ||
  !usuario ||
  !passwordActual ||
  !password ||
  !repetirPassword
) {
  return res.status(400).json({
    mensaje:
      "Debes escribir nombre, usuario, contraseña anterior y la nueva dos veces"
  });
}

const usuarioRepetido = await User.findOne({
    usuario: usuario.trim(),
    _id: { $ne: req.params.id }
    });

    if (usuarioRepetido) {
      return res.status(400).json({ mensaje: 'Usuario no disponible' });
    }

    const coincideActual = await compararPassword(passwordActual, user.password);
    if (!coincideActual) {
      return res.status(401).json({ mensaje: 'La contraseña anterior es incorrecta' });
    }

    if (password !== repetirPassword) {
      return res.status(400).json({ mensaje: 'Las contraseñas nuevas no coinciden' });
    }

    if (!passwordValida(password)) {
      return res.status(400).json({
        mensaje: 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un símbolo'
      });
    }

  user.nombre = nombre.trim();
  user.usuario = usuario.trim();
  user.rol = rol || "admin";
  user.password = await bcrypt.hash(password, 10);

  await user.save();
    res.json({ mensaje: 'Administrador actualizado correctamente' });
  } catch (error) {
  console.log('ERROR AL ACTUALIZAR ADMIN:', error);
    res.status(500).json({ mensaje: 'Error al actualizar administrador' });
  }
});


// ELIMINAR ADMINISTRADOR

router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Administrador eliminado correctamente' });
  } catch (error) {
    console.log('ERROR AL ELIMINAR ADMIN:', error);
    res.status(500).json({ mensaje: 'Error al eliminar administrador' });
  }
});
module.exports = router;