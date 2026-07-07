// Rutas de la API para la gestión de impresoras.

const express = require("express");
const router = express.Router();
const Impresora = require("../models/impresora");
const { verificarToken, soloAdmin } = require("../middleware/auth");

// Obtiene el listado de impresoras y permite realizar búsquedas
// y aplicar filtros por departamento, edificio, ubicación y equipo.

router.get("/", async (req, res) => {
  try {
    const {
      busqueda,
      departamento,
      edificio,
      ubicacion,
      equipo,
    } = req.query;

    let filtro = {};

    // Construye el filtro de búsqueda por texto.
    if (busqueda && busqueda.trim() !== "") {
      const texto = busqueda.trim();

      filtro.$or = [
        { departamento: { $regex: texto, $options: "i" } },
        { edificio: { $regex: texto, $options: "i" } },
        { ubicacion: { $regex: texto, $options: "i" } },
        { nombre: { $regex: texto, $options: "i" } },
        { email: { $regex: texto, $options: "i" } },
        { equipo: { $regex: texto, $options: "i" } },
        { usuario: { $regex: texto, $options: "i" } },
        { ip: { $regex: texto, $options: "i" } },
        { codigo: { $regex: texto, $options: "i" } },
      ];
    }

    // Aplica los filtros seleccionados.

    if (edificio && edificio.trim() !== "") {
      filtro.edificio = edificio.trim();
    }

    if (departamento && departamento.trim() !== "") {
      filtro.departamento = departamento.trim();
    }

    if (ubicacion && ubicacion.trim() !== "") {
      filtro.ubicacion = ubicacion.trim();
    }

    if (equipo && equipo.trim() !== "") {
      filtro.equipo = equipo.trim();
    }

    // Muestra información de depuración en consola.

    console.log("QUERY:", req.query);
    console.log("FILTRO:", JSON.stringify(filtro, null, 2));

    // Obtiene los registros ordenados por departamento.

    const datos = await Impresora.find(filtro).sort({
      departamento: 1,
    });

    console.log("REGISTROS ENCONTRADOS:", datos.length);

    res.json(datos);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener impresoras",
    });
  }
});

// Obtiene el número total de registros.

router.get("/count", async (req, res) => {
  try {
    const total = await Impresora.countDocuments();
    res.json({ total });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al contar registros",
    });
  }
});

// Obtiene la lista de edificios registrados.

router.get("/edificios", async (req, res) => {
  try {
    const edificios = await Impresora.distinct("edificio");

    edificios.sort((a, b) => a.localeCompare(b));

    res.json(edificios);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener edificios",
    });
  }
});

// Obtiene los valores únicos para los filtros del sistema.

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
      mensaje: "Error al obtener filtros",
    });
  }
});

// Registra una nueva impresora.
// Requiere autenticación y permisos de administrador.

router.post("/", verificarToken, soloAdmin, async (req, res) => {
  try {
    const nueva = new Impresora(req.body);

    await nueva.save();

    res.json({
      mensaje: "Impresora guardada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al guardar impresora",
    });
  }
});

// Actualiza la información de una impresora.
// Requiere autenticación y permisos de administrador.

router.put("/:id", verificarToken, soloAdmin, async (req, res) => {
  try {
    await Impresora.findByIdAndUpdate(req.params.id, req.body);

    res.json({
      mensaje: "Impresora actualizada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar impresora",
    });
  }
});

// Elimina una impresora.
// Requiere autenticación y permisos de administrador.

router.delete("/:id", verificarToken, soloAdmin, async (req, res) => {
  try {
    await Impresora.findByIdAndDelete(req.params.id);

    res.json({
      mensaje: "Impresora eliminada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar impresora",
    });
  }
});

// Obtiene las estadísticas generales del dashboard.

router.get("/stats", async (req, res) => {
  try {
    const totalEquipos = await Impresora.countDocuments();

    const totalIPs = await Impresora.countDocuments({
      ip: {
        $exists: true,
        $ne: "",
      },
    });

    const totalUsuarios = await Impresora.countDocuments({
      usuario: {
        $exists: true,
        $ne: "",
      },
    });

    res.json({
      totalEquipos,
      totalUsuarios,
      totalIPs,
      equiposActivos: totalEquipos,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener estadísticas",
    });
  }
});

// Exporta las rutas de impresoras.

module.exports = router;