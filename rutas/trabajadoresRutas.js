const express = require("express");
const router = express.Router();
const {
  crearTrabajador,
  obtenerTrabajadores,
  obtenerTrabajadorPorId,
  actualizarTrabajador,
  eliminarTrabajador
} = require("../controladores/trabajadoresControlador");

// Crear nuevo trabajador
router.post("/", crearTrabajador);

// Obtener todos los trabajadores
router.get("/", obtenerTrabajadores);

// Obtener un trabajador por ID
router.get("/:id", obtenerTrabajadorPorId);

// Actualizar un trabajador
router.put("/:id", actualizarTrabajador);

// Eliminar un trabajador
router.delete("/:id", eliminarTrabajador);

module.exports = router;