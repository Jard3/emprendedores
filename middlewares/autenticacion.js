const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware para verificar el token JWT
function verificarToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ mensaje: "Acceso denegado. Token requerido." });
  }

  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRETO);
    req.usuario = verificado;
    next();
  } catch (error) {
    res.status(400).json({ mensaje: "Token inválido." });
  }
}

// Middleware para permitir acceso solo a ciertos roles
function permitirRoles(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ mensaje: "Acceso restringido. Rol no autorizado." });
    }
    next();
  };
}

module.exports = {
  verificarToken,
  permitirRoles
};