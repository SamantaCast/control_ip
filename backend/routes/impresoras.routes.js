/* RUTAS DE API PARA GESTIÓN DE IMPRESORAS CON FILTROS, CRUD Y ESTADÍSTICAS */
const express = require('express');
const router = express.Router();
const Impresora = require('../models/impresora');
const { verificarToken, soloAdmin } = require('../middleware/auth');

/* ==========================================
   LISTAR / BUSCAR IMPRESORAS (PÚBLICO)
========================================== */

router.get('/', async (req, res) => {
  try {
    const {
  busqueda,
  departamento,
  edificio,
  ubicacion,
  equipo
} = req.query;

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

/* FILTRO EDIFICIO*/

if (edificio && edificio.trim() !== '') {
  const letra = edificio.trim();

  filtro.edificio = {
      $regex: `^${letra}$`,
      $options: 'i'
    };
  }


/*  FILTRO DEPARTAMENTO */

if (departamento && departamento.trim() !== '') {

  filtro.departamento = {
      $regex: `^${departamento.trim()}$`,
      $options: 'i'
    };
  }


/* FILTRO UBICACIÓN */

if (ubicacion && ubicacion.trim() !== '') {

  filtro.ubicacion = {
      $regex: `^${ubicacion.trim()}$`,
      $options: 'i'
    };
  }


/* FILTRO EQUIPO */

if (equipo && equipo.trim() !== '') {

  filtro.equipo = {
     $regex: `^${equipo.trim()}$`,
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


// OBTENER EDIFICIOS ÚNICOS

router.get('/edificios', async (req, res) => {

    try {
      const edificios = await Impresora.distinct('edificio');
      edificios.sort((a, b) =>
      a.localeCompare(b)
    );

      res.json(edificios);
    } catch (error) {

      res.status(500).json({
        mensaje: 'Error al obtener edificios'
    });
  }
});


// OBTENER FILTROS

router.get("/filtros", async (req, res) => {

  try {

      const departamentos = await Impresora.distinct("departamento");
      const edificios = await Impresora.distinct("edificio");
      const ubicaciones = await Impresora.distinct("ubicacion");
      const equipos = await Impresora.distinct("equipo");

      res.json({

        departamentos: departamentos.sort(),
        edificios: edificios.sort(),
        ubicaciones: ubicaciones.sort(),
        equipos: equipos.sort(),
      });

    } catch (error) {

      res.status(500).json({
        mensaje: "Error al obtener filtros"
        });
    }
});


// AGREGAR IMPRESORA (SOLO ADMINISTRADORES) 

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


/* ESTADÍSTICAS DEL DASHBOARD */

router.get("/stats", async (req, res) => {

  try {
    const totalEquipos = await Impresora.countDocuments();
    const totalIPs = await Impresora.countDocuments({
    ip: {
      $exists: true,
      $ne: ""
    }
  });

    const totalUsuarios = await Impresora.countDocuments({
    usuario: {
      $exists: true,
      $ne: ""
    }
  });

    res.json({
      totalEquipos,
      totalUsuarios,
      totalIPs,
      equiposActivos: totalEquipos
});

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener estadísticas"
    });
  }

});
module.exports = router;