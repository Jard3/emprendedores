require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const methodOverride = require("method-override");

const conectarDB = require("./configuracion/baseDeDatos");

// Modelos
const Usuario = require("./modelos/Usuario");
const Trabajador = require("./modelos/Trabajador");
const Turno = require("./modelos/Turno");

// Rutas API
const usuarioRoutes = require("./rutas/autenticacionRutas");
const usuariosRoutes = require("./rutas/usuariosRutas");
const turnoRoutes = require("./rutas/turnosRutas");
const trabajadorRoutes = require("./rutas/trabajadoresRutas");
const loginAdminRoutes = require("./rutas/loginAdministradorRutas");
const loginTrabajadorRoutes = require("./rutas/loginTrabajadorRutas");

// Servicio de correo
const { enviarCorreoCreacionTurno } = require("./servicios/recordatorioServicio");

const app = express();

// Motor de plantillas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "vistas"));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Crear usuario admin por defecto
async function crearAdmin() {
  const admin = await Usuario.findOne({ email: "admin@correo.com" });
  if (!admin) {
    await Usuario.create({
      nombre: "Administrador",
      email: "admin@correo.com",
      telefono: "12345678",
      contrasena: "admin123",
      rol: "admin",
    });
    console.log("✅ Usuario administrador creado: admin@correo.com / admin123");
  } else {
    console.log("ℹ️ Usuario administrador ya existe.");
  }
}

// Conectar DB y crear admin
conectarDB().then(crearAdmin);

// Rutas API
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/turnos", turnoRoutes);
app.use("/api/trabajadores", trabajadorRoutes);
app.use("/api/login/admin", loginAdminRoutes);
app.use("/api/login/trabajador", loginTrabajadorRoutes);

// Rutas vistas
app.get("/", (req, res) => {
  res.render("principal");
});

// === Usuarios ===
app.get("/usuarios", async (req, res) => {
  const usuarios = await Usuario.find();
  res.render("usuario/index", { usuarios });
});

app.get("/usuarios/crear", (req, res) => {
  res.render("usuario/create");
});

app.post("/usuarios", async (req, res) => {
  try {
    console.log("📦 Datos recibidos del formulario:", req.body);
    await Usuario.create(req.body);
    res.redirect("/usuarios");
  } catch (error) {
    console.error("❌ Error al guardar usuario:", error);
    res.status(500).send("Error al guardar usuario");
  }
});

app.get("/usuarios/:id/editar", async (req, res) => {
  const usuario = await Usuario.findById(req.params.id);
  res.render("usuario/edit", { usuario });
});

// === Trabajadores ===
app.get("/trabajadores", async (req, res) => {
  const trabajadores = await Trabajador.find();
  res.render("trabajador/index", { trabajadores });
});

app.get("/trabajadores/crear", (req, res) => {
  res.render("trabajador/create");
});

app.post("/trabajadores", async (req, res) => {
  try {
    await Trabajador.create(req.body);
    res.redirect("/trabajadores");
  } catch (error) {
    console.error("❌ Error al guardar trabajador:", error);
    res.status(500).send("Error al guardar trabajador");
  }
});

app.get("/trabajadores/:id/editar", async (req, res) => {
  const trabajador = await Trabajador.findById(req.params.id);
  res.render("trabajador/edit", { trabajador });
});

// === Turnos ===
app.get("/turnos", async (req, res) => {
  const turnos = await Turno.find().populate("trabajador");
  res.render("turno/index", { turnos });
});

app.get("/turnos/crear", async (req, res) => {
  try {
    const trabajadores = await Trabajador.find();
    res.render("turno/create", { trabajadores });
  } catch (error) {
    console.error("❌ Error al cargar formulario de turno:", error);
    res.status(500).send("Error al cargar la página de creación de turno");
  }
});

app.post("/turnos", async (req, res) => {
  try {
    const { fecha, hora, correoCliente, telefono, negocio, trabajador, nota } = req.body;

    const turnoCreado = await Turno.create({
      correoCliente,
      telefono,
      negocio,
      trabajador,
      fecha,
      hora,
      nota,
    });

    const trabajadorData = await Trabajador.findById(trabajador);
    await enviarCorreoCreacionTurno(turnoCreado, trabajadorData);

    res.redirect("/turnos");
  } catch (error) {
    console.error("❌ Error creando turno:", error);
    res.status(500).send("Error al guardar turno: " + error.message);
  }
});

app.get("/turnos/:id/editar", async (req, res) => {
  try {
    const turno = await Turno.findById(req.params.id);
    const trabajadores = await Trabajador.find();
    res.render("turno/edit", { turno, trabajadores });
  } catch (error) {
    console.error("❌ Error cargando turno:", error);
    res.status(500).send("Error al cargar la edición del turno");
  }
});

app.put("/turnos/:id", async (req, res) => {
  try {
    const { fecha, hora, correoCliente, telefono, negocio, trabajador, nota } = req.body;

    await Turno.findByIdAndUpdate(req.params.id, {
      correoCliente,
      telefono,
      negocio,
      trabajador,
      fecha,
      hora,
      nota,
    });

    res.redirect("/turnos");
  } catch (error) {
    console.error("❌ Error actualizando turno:", error);
    res.status(500).send("Error al actualizar turno");
  }
});

// Puerto
const PORT = process.env.PUERTO || 4000;
app.listen(PORT, () => {
  console.log(`✅ Servidor funcionando en puerto ${PORT}`);
});
