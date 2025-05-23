const express = require("express");
const router = express.Router();
const Usuario = require("../modelos/Usuario");
const { verificarToken, permitirRoles } = require("../middlewares/autenticacion");

// Ruta pública para obtener solo clientes y empleados
router.get("/publicos", async (req, res) => {
  try {
    const usuarios = await Usuario.find({ rol: { $in: ["cliente", "empleado"] } });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener usuarios públicos", error });
  }
});

// Ruta privada para obtener todos los usuarios (admin)
router.get("/", verificarToken, permitirRoles("admin"), async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener usuarios", error });
  }
});

module.exports = router;