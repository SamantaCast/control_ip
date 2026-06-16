const express = require('express');
const router = express.Router();

const Impresora = require('../models/impresora');
const { verificarToken, soloAdmin } = require('../middleware/auth');

// BUSCAR / LISTAR
// Esta parte debe ser pública
// para que funcione el buscador sin iniciar sesión
router.get('/', async (req, res) => {
  try {
    const { busqueda, edificio } = req.query;

    let filtro = {};

    if (busqueda && busqueda.trim() !== '') {
      const texto = busqueda.trim();

      filtro.$or = [
        { departamento: { $regex: texto, $options: 'i' } },
        { edificio: { $regex: texto, $options: 'i' } },
        { ubicacion: { $regex: texto, $options: 'i' } },
        { nombre: { $regex: texto, $options: 'i' } },
        { email: { $regex: texto, $options: 'i' } },
        { equipo: { $regex: texto, $options: 'i' } },
        { usuario: { $regex: texto, $options: 'i' } },
        { ip: { $regex: texto, $options: 'i' } },
        { codigo: { $regex: texto, $options: 'i' } }
      ];
    }

    if (edificio && edificio.trim() !== '') {
      const letra = edificio.trim();

      filtro.edificio = {
        $regex: `^${letra}$`,
        $options: 'i'
      };
    }

    const datos = await Impresora.find(filtro)
  .sort({ departamento: 1 });
    res.json(datos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener impresoras' });
  }
});

// CONTAR REGISTROS TOTALES
router.get('/count', async (req, res) => {
  try {
    const total = await Impresora.countDocuments();
    res.json({ total });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al contar registros' });
  }
});

// AGREGAR
// Solo administradores

router.post('/', verificarToken, soloAdmin, async (req, res) => {
  try {
    const nueva = new Impresora(req.body);
    await nueva.save();
    res.json({ mensaje: 'Impresora guardada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al guardar impresora' });
  }
});


// EDITAR

router.put('/:id', verificarToken, soloAdmin, async (req, res) => {
  try {
    await Impresora.findByIdAndUpdate(req.params.id, req.body);
    res.json({ mensaje: 'Impresora actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar impresora' });
  }
});


// ELIMINAR

router.delete('/:id', verificarToken, soloAdmin, async (req, res) => {
  try {
    await Impresora.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Impresora eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar impresora' });
  }
});

module.exports = router;