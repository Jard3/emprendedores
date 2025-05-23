const express = require("express");
const router = express.Router();

const {
  obtenerUsuarios,
  crearUsuario,
  iniciarSesion,
  eliminarUsuario,
} = require("../controladores/autenticacionControlador");

const Usuario = require("../modelos/Usuario");
const { verificarToken, permitirRoles } = require("../middlewares/autenticacion");

// Registrar un nuevo usuario (abierto)
router.post("/", crearUsuario);

// Iniciar sesión (abierto)
router.post("/iniciar", iniciarSesion);

// Obtener todos los usuarios (solo para admin)
router.get("/", verificarToken, permitirRoles("admin"), obtenerUsuarios);

// Eliminar usuario (solo para admin)
router.delete("/:id", verificarToken, permitirRoles("admin"), eliminarUsuario);

// ✅ NUEVA RUTA PÚBLICA para obtener clientes y empleados
router.get("/publicos", async (req, res) => {
  try {
    const usuarios = await Usuario.find({ rol: { $in: ["cliente", "empleado"] } });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener usuarios públicos", error });
  }
});

module.exports = router;