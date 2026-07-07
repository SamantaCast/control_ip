// Middleware para autenticación y autorización usando JWT.

const jwt = require("jsonwebtoken");

// Verifica que el token JWT exista y sea válido.

function verificarToken(req, res, next) {
  // Obtiene el encabezado Authorization de la petición.
  const authHeader = req.headers.authorization;

  // Verifica que el encabezado exista.
  if (!authHeader) {
    return res.status(401).json({ mensaje: "Token requerido" });
  }

  // Extrae el token del formato "Bearer <token>".
  const token = authHeader.split(" ")[1];

  // Verifica que el token exista.
  if (!token) {
    return res.status(401).json({ mensaje: "Token inválido" });
  }

  try {
    // Valida el token utilizando la clave secreta.
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Guarda la información del usuario autenticado.
    req.user = payload;

    // Continúa con el siguiente middleware.
    next();
  } catch (error) {
    // Retorna un error si el token es inválido o expiró.
    return res.status(401).json({ mensaje: "Token expirado o inválido" });
  }
}

// Verifica que el usuario autenticado tenga rol de administrador.

function soloAdmin(req, res, next) {
  // Comprueba que el rol del usuario sea administrador.
  if (req.user.rol !== "admin") {
    return res.status(403).json({ mensaje: "Acceso denegado" });
  }

  // Permite continuar si el usuario es administrador.
  next();
}

// Exporta los middlewares.

module.exports = { verificarToken, soloAdmin };