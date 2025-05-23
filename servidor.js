// servidor.js
const express = require("express");
const cors = require("cors");

// Configuración y conexión a base de datos
const conectarDB = require("./configuracion/baseDeDatos");

// Modelo para crear admin predeterminado
const Usuario = require("./modelos/Usuario");

const usuarioRoutes = require("./rutas/autenticacionRutas");
const usuariosRoutes = require("./rutas/usuariosRutas"); // ✅ RUTA AGREGADA AQUÍ
const turnoRoutes = require("./rutas/turnosRutas");
const trabajadorRoutes = require("./rutas/trabajadoresRutas");
const loginAdminRoutes = require("./rutas/loginAdministradorRutas"); // ✅ CORREGIDO AQUÍ
const loginTrabajadorRoutes = require("./rutas/loginTrabajadorRutas");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Crear administrador predeterminado si no existe
async function crearAdmin() {
  const admin = await Usuario.findOne({ email: "admin@correo.com" });
  if (!admin) {
    await Usuario.create({
      nombre: "Administrador",
      email: "admin@correo.com",
      telefono: "12345678",
      contrasena: "admin123",
      rol: "admin"
    });
    console.log("✅ Usuario administrador creado: admin@correo.com / admin123");
  } else {
    console.log("ℹ️ Usuario administrador ya existe.");
  }
}

// Conexión a MongoDB y creación de admin
conectarDB().then(async () => {
  await crearAdmin();
});

// Rutas de la API
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/usuarios", usuariosRoutes); // ✅ ESTA ES LA RUTA PARA GET /api/usuarios
app.use("/api/turnos", turnoRoutes);
app.use("/api/trabajadores", trabajadorRoutes);
app.use("/api/login/admin", loginAdminRoutes); // ✅ Ya no dará error
app.use("/api/login/trabajador", loginTrabajadorRoutes);

// Servicio de recordatorio (correo)
require("./servicios/recordatorioServicio");

// Configurar puerto y arrancar el servidor
const PORT = process.env.PUERTO || 4000;
app.listen(PORT, () => {
  console.log(`✅ Servidor funcionando en puerto ${PORT}`);
});

/*
✅ Cómo ejecutar el backend:
node servidor.js
npm run dev

✅ Cómo iniciar MongoDB (si es local):
mongod
*/