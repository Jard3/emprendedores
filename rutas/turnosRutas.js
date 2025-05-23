const express = require("express");
const router = express.Router();

const {
  crearTurno,
  obtenerTurnosPorTrabajador,
  obtenerHistorialCliente,
  marcarTurnoAtendido,
  filtrarTurnos,
  reenviarRecordatorio,
  listarTodosTurnos,
  obtenerEstadisticas,
  actualizarSeguimientoTurno,
  confirmarTurnoLlegada,
  asignarClienteATrabajador, // ✅ debe estar correctamente exportada en el controlador
} = require("../controladores/turnosControlador");

const { verificarToken, permitirRoles } = require("../middlewares/autenticacion");

// 🧾 Rutas para clientes
router.post("/", crearTurno);
router.get("/cliente/:id", verificarToken, permitirRoles("cliente"), obtenerHistorialCliente);

// 🧾 Rutas para empleados
router.get("/trabajador/:id", verificarToken, permitirRoles("empleado"), obtenerTurnosPorTrabajador);
router.patch("/atendido/:id", verificarToken, permitirRoles("empleado"), marcarTurnoAtendido);
router.get("/filtrar", verificarToken, permitirRoles("empleado", "admin"), filtrarTurnos);

// 🧾 Rutas para administrador
router.get("/todos", verificarToken, permitirRoles("admin"), listarTodosTurnos);
router.post("/reenviar", verificarToken, permitirRoles("admin"), reenviarRecordatorio);
router.get("/estadisticas", verificarToken, permitirRoles("admin"), obtenerEstadisticas);
router.patch("/seguimiento/:id", verificarToken, permitirRoles("admin"), actualizarSeguimientoTurno);
router.patch("/asignar/:id", verificarToken, permitirRoles("admin"), asignarClienteATrabajador);

// ✅ Ruta pública para confirmar llegada con QR
router.patch("/confirmar/:id", confirmarTurnoLlegada);

module.exports = router;